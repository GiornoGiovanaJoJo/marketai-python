"""Organizations app business logic services."""
from typing import Dict, List, Optional
from django.db import transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from .models import Organization, Employee, Partner, AccessPermission


User = get_user_model()


class OrganizationService:
    """Service for organization-related business logic."""
    
    @staticmethod
    @transaction.atomic
    def create_organization(
        owner: User,
        name: str,
        **kwargs
    ) -> Organization:
        """Create a new organization with owner as first employee."""
        # Create organization
        organization = Organization.objects.create(
            owner=owner,
            name=name,
            **kwargs
        )
        
        # Create owner as employee
        Employee.objects.create(
            organization=organization,
            user=owner,
            role=Employee.Role.OWNER,
            status=Employee.Status.ACTIVE,
            position='Owner'
        )
        
        # Grant full permissions to owner
        OrganizationService.grant_full_permissions(
            organization=organization,
            employee=organization.employees.first()
        )
        
        return organization
    
    @staticmethod
    def grant_full_permissions(
        organization: Organization,
        employee: Employee
    ) -> List[AccessPermission]:
        """Grant all permissions to an employee."""
        permissions = []
        
        for resource in AccessPermission.Resource:
            for permission in AccessPermission.Permission:
                perm, created = AccessPermission.objects.get_or_create(
                    organization=organization,
                    employee=employee,
                    resource=resource,
                    permission=permission,
                    defaults={'is_active': True}
                )
                permissions.append(perm)
        
        return permissions
    
    @staticmethod
    def get_user_role(organization: Organization, user: User) -> Optional[str]:
        """Get user's role in organization."""
        if organization.owner == user:
            return Employee.Role.OWNER
        
        try:
            employee = Employee.objects.get(
                organization=organization,
                user=user,
                status=Employee.Status.ACTIVE
            )
            return employee.role
        except Employee.DoesNotExist:
            return None
    
    @staticmethod
    def is_user_member(organization: Organization, user: User) -> bool:
        """Check if user is a member of organization."""
        if organization.owner == user:
            return True
        
        return Employee.objects.filter(
            organization=organization,
            user=user,
            status=Employee.Status.ACTIVE
        ).exists()


class EmployeeService:
    """Service for employee-related business logic."""
    
    @staticmethod
    @transaction.atomic
    def invite_employee(
        organization: Organization,
        email: str,
        role: str = Employee.Role.VIEWER,
        **kwargs
    ) -> Employee:
        """Invite a user to join organization as employee."""
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': email}
        )
        
        # Check if already employee
        if Employee.objects.filter(organization=organization, user=user).exists():
            raise ValidationError("User is already an employee of this organization")
        
        # Create employee
        employee = Employee.objects.create(
            organization=organization,
            user=user,
            role=role,
            status=Employee.Status.INVITED if created else Employee.Status.ACTIVE,
            **kwargs
        )
        
        # Grant default permissions based on role
        EmployeeService.grant_role_permissions(employee)
        
        # TODO: Send invitation email
        
        return employee
    
    @staticmethod
    def grant_role_permissions(employee: Employee) -> List[AccessPermission]:
        """Grant permissions based on employee role."""
        permissions = []
        
        # Define permissions by role
        role_permissions = {
            Employee.Role.OWNER: {
                'resources': list(AccessPermission.Resource),
                'permissions': list(AccessPermission.Permission)
            },
            Employee.Role.ADMIN: {
                'resources': list(AccessPermission.Resource),
                'permissions': [
                    AccessPermission.Permission.VIEW,
                    AccessPermission.Permission.CREATE,
                    AccessPermission.Permission.EDIT,
                    AccessPermission.Permission.MANAGE
                ]
            },
            Employee.Role.MANAGER: {
                'resources': [
                    AccessPermission.Resource.CAMPAIGNS,
                    AccessPermission.Resource.STATISTICS,
                    AccessPermission.Resource.REPORTS,
                    AccessPermission.Resource.PARTNERS
                ],
                'permissions': [
                    AccessPermission.Permission.VIEW,
                    AccessPermission.Permission.CREATE,
                    AccessPermission.Permission.EDIT
                ]
            },
            Employee.Role.ANALYST: {
                'resources': [
                    AccessPermission.Resource.CAMPAIGNS,
                    AccessPermission.Resource.STATISTICS,
                    AccessPermission.Resource.REPORTS
                ],
                'permissions': [
                    AccessPermission.Permission.VIEW
                ]
            },
            Employee.Role.VIEWER: {
                'resources': [
                    AccessPermission.Resource.CAMPAIGNS,
                    AccessPermission.Resource.STATISTICS
                ],
                'permissions': [
                    AccessPermission.Permission.VIEW
                ]
            }
        }
        
        role_perms = role_permissions.get(employee.role, {})
        resources = role_perms.get('resources', [])
        perms = role_perms.get('permissions', [])
        
        for resource in resources:
            for permission in perms:
                perm, created = AccessPermission.objects.get_or_create(
                    organization=employee.organization,
                    employee=employee,
                    resource=resource,
                    permission=permission,
                    defaults={'is_active': True}
                )
                permissions.append(perm)
        
        return permissions
    
    @staticmethod
    @transaction.atomic
    def update_employee_role(
        employee: Employee,
        new_role: str
    ) -> Employee:
        """Update employee role and adjust permissions accordingly."""
        old_role = employee.role
        employee.role = new_role
        employee.save()
        
        # Remove old permissions
        AccessPermission.objects.filter(
            organization=employee.organization,
            employee=employee
        ).delete()
        
        # Grant new role permissions
        EmployeeService.grant_role_permissions(employee)
        
        return employee


class PartnerService:
    """Service for partner-related business logic."""
    
    @staticmethod
    def get_active_partners(
        organization: Organization,
        partner_type: Optional[str] = None
    ) -> List[Partner]:
        """Get active partners for organization."""
        queryset = Partner.objects.filter(
            organization=organization,
            status=Partner.Status.ACTIVE
        )
        
        if partner_type:
            queryset = queryset.filter(partner_type=partner_type)
        
        return list(queryset)
    
    @staticmethod
    def get_partner_stats(organization: Organization) -> Dict:
        """Get partner statistics for organization."""
        stats = {
            'total': Partner.objects.filter(organization=organization).count(),
            'active': Partner.objects.filter(
                organization=organization,
                status=Partner.Status.ACTIVE
            ).count(),
            'by_type': {}
        }
        
        for partner_type in Partner.PartnerType:
            count = Partner.objects.filter(
                organization=organization,
                partner_type=partner_type
            ).count()
            if count > 0:
                stats['by_type'][partner_type.label] = count
        
        return stats


class AccessPermissionService:
    """Service for access permission-related business logic."""
    
    @staticmethod
    def check_permission(
        employee: Employee,
        resource: str,
        permission: str
    ) -> bool:
        """Check if employee has specific permission."""
        # Owner always has all permissions
        if employee.role == Employee.Role.OWNER:
            return True
        
        return AccessPermission.objects.filter(
            employee=employee,
            resource=resource,
            permission=permission,
            is_active=True
        ).exists()
    
    @staticmethod
    def get_employee_permissions(
        employee: Employee,
        resource: Optional[str] = None
    ) -> List[AccessPermission]:
        """Get all permissions for an employee."""
        queryset = AccessPermission.objects.filter(
            employee=employee,
            is_active=True
        )
        
        if resource:
            queryset = queryset.filter(resource=resource)
        
        return list(queryset)

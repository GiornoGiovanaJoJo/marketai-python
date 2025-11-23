"""Organizations app custom permissions."""
from rest_framework import permissions
from .models import Employee


class IsOrganizationOwner(permissions.BasePermission):
    """Permission to check if user is organization owner."""
    
    message = "You must be the organization owner to perform this action."
    
    def has_object_permission(self, request, view, obj):
        """Check if user is the owner of the organization."""
        # For Organization model
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        
        # For models with organization FK
        if hasattr(obj, 'organization'):
            return obj.organization.owner == request.user
        
        return False


class IsOrganizationOwnerOrAdmin(permissions.BasePermission):
    """Permission to check if user is organization owner or admin."""
    
    message = "You must be an organization owner or admin to perform this action."
    
    def has_object_permission(self, request, view, obj):
        """Check if user is owner or admin of the organization."""
        user = request.user
        
        # For Organization model
        if hasattr(obj, 'owner'):
            organization = obj
        # For models with organization FK
        elif hasattr(obj, 'organization'):
            organization = obj.organization
        else:
            return False
        
        # Check if owner
        if organization.owner == user:
            return True
        
        # Check if admin
        return Employee.objects.filter(
            organization=organization,
            user=user,
            role__in=[Employee.Role.OWNER, Employee.Role.ADMIN],
            status=Employee.Status.ACTIVE
        ).exists()


class IsOrganizationMember(permissions.BasePermission):
    """Permission to check if user is member of the organization."""
    
    message = "You must be a member of this organization to perform this action."
    
    def has_object_permission(self, request, view, obj):
        """Check if user is a member (owner or employee) of the organization."""
        user = request.user
        
        # For Organization model
        if hasattr(obj, 'owner'):
            organization = obj
        # For models with organization FK
        elif hasattr(obj, 'organization'):
            organization = obj.organization
        else:
            return False
        
        # Check if owner
        if organization.owner == user:
            return True
        
        # Check if employee
        return Employee.objects.filter(
            organization=organization,
            user=user,
            status=Employee.Status.ACTIVE
        ).exists()


class CanManageEmployees(permissions.BasePermission):
    """Permission to check if user can manage employees."""
    
    message = "You don't have permission to manage employees."
    
    def has_object_permission(self, request, view, obj):
        """Check if user has permission to manage employees."""
        user = request.user
        
        # Get organization
        if hasattr(obj, 'organization'):
            organization = obj.organization
        else:
            return False
        
        # Owner can always manage
        if organization.owner == user:
            return True
        
        # Check if user is admin or manager
        return Employee.objects.filter(
            organization=organization,
            user=user,
            role__in=[Employee.Role.OWNER, Employee.Role.ADMIN, Employee.Role.MANAGER],
            status=Employee.Status.ACTIVE
        ).exists()


class CanManagePartners(permissions.BasePermission):
    """Permission to check if user can manage partners."""
    
    message = "You don't have permission to manage partners."
    
    def has_object_permission(self, request, view, obj):
        """Check if user has permission to manage partners."""
        user = request.user
        
        # Get organization
        if hasattr(obj, 'organization'):
            organization = obj.organization
        else:
            return False
        
        # Owner can always manage
        if organization.owner == user:
            return True
        
        # Check if user is admin or manager
        return Employee.objects.filter(
            organization=organization,
            user=user,
            role__in=[Employee.Role.OWNER, Employee.Role.ADMIN, Employee.Role.MANAGER],
            status=Employee.Status.ACTIVE
        ).exists()

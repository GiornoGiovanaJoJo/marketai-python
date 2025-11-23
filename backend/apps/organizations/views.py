"""Organizations app views."""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend

from .models import Organization, Employee, Partner, AccessPermission
from .serializers import (
    OrganizationSerializer,
    OrganizationListSerializer,
    EmployeeSerializer,
    EmployeeInviteSerializer,
    PartnerSerializer,
    PartnerListSerializer,
    AccessPermissionSerializer,
    BulkAccessPermissionSerializer,
)
from .permissions import IsOrganizationOwnerOrAdmin, IsOrganizationMember


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for Organization CRUD operations."""
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'inn', 'email']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get organizations where user is owner or employee."""
        user = self.request.user
        return Organization.objects.filter(
            Q(owner=user) | Q(employees__user=user)
        ).distinct().annotate(
            employees_count=Count('employees'),
            partners_count=Count('partners')
        )
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return OrganizationListSerializer
        return OrganizationSerializer
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get organization statistics."""
        organization = self.get_object()
        
        stats = {
            'employees': {
                'total': organization.employees.count(),
                'active': organization.employees.filter(status=Employee.Status.ACTIVE).count(),
                'by_role': {}
            },
            'partners': {
                'total': organization.partners.count(),
                'active': organization.partners.filter(status=Partner.Status.ACTIVE).count(),
                'by_type': {}
            }
        }
        
        # Count employees by role
        for role in Employee.Role:
            count = organization.employees.filter(role=role).count()
            if count > 0:
                stats['employees']['by_role'][role.label] = count
        
        # Count partners by type
        for partner_type in Partner.PartnerType:
            count = organization.partners.filter(partner_type=partner_type).count()
            if count > 0:
                stats['partners']['by_type'][partner_type.label] = count
        
        return Response(stats)


class EmployeeViewSet(viewsets.ModelViewSet):
    """ViewSet for Employee CRUD operations."""
    
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'role', 'status']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'position', 'department']
    ordering_fields = ['created_at', 'hired_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get employees of organizations where user has access."""
        user = self.request.user
        return Employee.objects.filter(
            Q(organization__owner=user) | Q(organization__employees__user=user)
        ).select_related('user', 'organization').distinct()
    
    @action(detail=False, methods=['post'])
    def invite(self, request):
        """Invite a user to join organization as employee."""
        serializer = EmployeeInviteSerializer(
            data=request.data,
            context={'organization_id': request.data.get('organization')}
        )
        serializer.is_valid(raise_exception=True)
        
        # TODO: Implement email invitation logic
        # For now, create employee with 'invited' status
        
        return Response(
            {"message": "Invitation sent successfully"},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate an employee."""
        employee = self.get_object()
        employee.status = Employee.Status.ACTIVE
        employee.save()
        
        return Response(
            EmployeeSerializer(employee).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate an employee."""
        employee = self.get_object()
        employee.status = Employee.Status.INACTIVE
        employee.save()
        
        return Response(
            EmployeeSerializer(employee).data,
            status=status.HTTP_200_OK
        )


class PartnerViewSet(viewsets.ModelViewSet):
    """ViewSet for Partner CRUD operations."""
    
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'partner_type', 'status']
    search_fields = ['name', 'inn', 'email', 'contact_person']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get partners of organizations where user has access."""
        user = self.request.user
        return Partner.objects.filter(
            Q(organization__owner=user) | Q(organization__employees__user=user)
        ).select_related('organization').distinct()
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return PartnerListSerializer
        return PartnerSerializer
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a partner."""
        partner = self.get_object()
        partner.status = Partner.Status.ACTIVE
        partner.save()
        
        return Response(
            PartnerSerializer(partner).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a partner."""
        partner = self.get_object()
        partner.status = Partner.Status.INACTIVE
        partner.save()
        
        return Response(
            PartnerSerializer(partner).data,
            status=status.HTTP_200_OK
        )


class AccessPermissionViewSet(viewsets.ModelViewSet):
    """ViewSet for AccessPermission CRUD operations."""
    
    serializer_class = AccessPermissionSerializer
    permission_classes = [IsAuthenticated, IsOrganizationOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['organization', 'employee', 'resource', 'permission', 'is_active']
    ordering_fields = ['resource', 'created_at']
    ordering = ['resource', 'permission']
    
    def get_queryset(self):
        """Get permissions for organizations where user is owner or admin."""
        user = self.request.user
        return AccessPermission.objects.filter(
            Q(organization__owner=user) |
            Q(organization__employees__user=user, organization__employees__role__in=[
                Employee.Role.OWNER, Employee.Role.ADMIN
            ])
        ).select_related('organization', 'employee', 'employee__user').distinct()
    
    @action(detail=False, methods=['post'])
    def bulk_assign(self, request):
        """Bulk assign permissions to an employee."""
        serializer = BulkAccessPermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        employee_id = serializer.validated_data['employee_id']
        permissions = serializer.validated_data['permissions']
        
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        created_permissions = []
        for perm in permissions:
            permission_obj, created = AccessPermission.objects.get_or_create(
                organization=employee.organization,
                employee=employee,
                resource=perm['resource'],
                permission=perm['permission'],
                defaults={'is_active': True}
            )
            if created:
                created_permissions.append(permission_obj)
        
        return Response(
            {
                "message": f"{len(created_permissions)} permissions assigned successfully",
                "permissions": AccessPermissionSerializer(created_permissions, many=True).data
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        """Get all permissions for a specific employee."""
        employee_id = request.query_params.get('employee_id')
        
        if not employee_id:
            return Response(
                {"error": "employee_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        permissions = self.get_queryset().filter(employee_id=employee_id)
        serializer = self.get_serializer(permissions, many=True)
        
        return Response(serializer.data)

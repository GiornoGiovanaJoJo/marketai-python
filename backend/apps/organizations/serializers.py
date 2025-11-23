"""Organizations app serializers."""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Organization, Employee, Partner, AccessPermission


User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model."""
    
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    employees_count = serializers.IntegerField(source='employees.count', read_only=True)
    partners_count = serializers.IntegerField(source='partners.count', read_only=True)
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'description', 'owner', 'owner_email',
            'status', 'inn', 'kpp', 'legal_address', 'phone', 'email',
            'website', 'employees_count', 'partners_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create organization with current user as owner."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['owner'] = request.user
        return super().create(validated_data)


class OrganizationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for organization list views."""
    
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'status', 'owner_email', 'created_at']
        read_only_fields = fields


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'organization', 'organization_name', 'user', 'user_email',
            'user_first_name', 'user_last_name', 'role', 'status',
            'position', 'department', 'phone', 'hired_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate employee creation/update."""
        # Prevent duplicate employee records
        organization = data.get('organization')
        user = data.get('user')
        
        if self.instance is None:  # Creating new employee
            if Employee.objects.filter(organization=organization, user=user).exists():
                raise serializers.ValidationError(
                    "This user is already an employee of this organization."
                )
        
        return data


class EmployeeInviteSerializer(serializers.Serializer):
    """Serializer for inviting employees via email."""
    
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(
        choices=Employee.Role.choices,
        default=Employee.Role.VIEWER
    )
    position = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Validate email doesn't already belong to an employee."""
        organization_id = self.context.get('organization_id')
        if organization_id:
            if Employee.objects.filter(
                organization_id=organization_id,
                user__email=value
            ).exists():
                raise serializers.ValidationError(
                    "User with this email is already an employee."
                )
        return value


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for Partner model."""
    
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = Partner
        fields = [
            'id', 'organization', 'organization_name', 'name', 'partner_type',
            'status', 'inn', 'kpp', 'contact_person', 'phone', 'email',
            'address', 'contract_number', 'contract_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PartnerListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for partner list views."""
    
    class Meta:
        model = Partner
        fields = ['id', 'name', 'partner_type', 'status', 'email', 'phone', 'created_at']
        read_only_fields = fields


class AccessPermissionSerializer(serializers.ModelSerializer):
    """Serializer for AccessPermission model."""
    
    employee_email = serializers.EmailField(source='employee.user.email', read_only=True)
    employee_role = serializers.CharField(source='employee.role', read_only=True)
    
    class Meta:
        model = AccessPermission
        fields = [
            'id', 'organization', 'employee', 'employee_email', 'employee_role',
            'resource', 'permission', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate permission assignment."""
        employee = data.get('employee')
        organization = data.get('organization')
        
        # Ensure employee belongs to the organization
        if employee and organization and employee.organization != organization:
            raise serializers.ValidationError(
                "Employee does not belong to this organization."
            )
        
        return data


class BulkAccessPermissionSerializer(serializers.Serializer):
    """Serializer for bulk permission assignment."""
    
    employee_id = serializers.IntegerField(required=True)
    permissions = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        required=True
    )
    
    def validate_permissions(self, value):
        """Validate permissions structure."""
        for perm in value:
            if 'resource' not in perm or 'permission' not in perm:
                raise serializers.ValidationError(
                    "Each permission must have 'resource' and 'permission' fields."
                )
            
            # Validate resource and permission choices
            if perm['resource'] not in dict(AccessPermission.Resource.choices):
                raise serializers.ValidationError(f"Invalid resource: {perm['resource']}")
            
            if perm['permission'] not in dict(AccessPermission.Permission.choices):
                raise serializers.ValidationError(f"Invalid permission: {perm['permission']}")
        
        return value

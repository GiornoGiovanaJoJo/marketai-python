"""Organizations app Django admin configuration."""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Organization, Employee, Partner, AccessPermission


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """Admin configuration for Organization model."""
    
    list_display = ['name', 'owner', 'status', 'inn', 'email', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'inn', 'kpp', 'email', 'owner__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'description', 'owner', 'status')
        }),
        (_('Legal Information'), {
            'fields': ('inn', 'kpp', 'legal_address')
        }),
        (_('Contact Information'), {
            'fields': ('phone', 'email', 'website')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('owner')


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """Admin configuration for Employee model."""
    
    list_display = [
        'user_email', 'organization', 'role', 'status',
        'position', 'department', 'hired_at'
    ]
    list_filter = ['role', 'status', 'department', 'hired_at', 'created_at']
    search_fields = [
        'user__email', 'user__first_name', 'user__last_name',
        'organization__name', 'position', 'department'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Organization & User'), {
            'fields': ('organization', 'user')
        }),
        (_('Role & Status'), {
            'fields': ('role', 'status')
        }),
        (_('Position Details'), {
            'fields': ('position', 'department', 'phone', 'hired_at')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        """Display user email."""
        return obj.user.email
    user_email.short_description = _('User Email')
    user_email.admin_order_field = 'user__email'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'organization')


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    """Admin configuration for Partner model."""
    
    list_display = [
        'name', 'organization', 'partner_type', 'status',
        'contact_person', 'email', 'phone', 'contract_number'
    ]
    list_filter = ['partner_type', 'status', 'contract_date', 'created_at']
    search_fields = [
        'name', 'inn', 'kpp', 'email', 'contact_person',
        'organization__name', 'contract_number'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('organization', 'name', 'partner_type', 'status')
        }),
        (_('Legal Information'), {
            'fields': ('inn', 'kpp', 'address')
        }),
        (_('Contact Information'), {
            'fields': ('contact_person', 'phone', 'email')
        }),
        (_('Contract Information'), {
            'fields': ('contract_number', 'contract_date')
        }),
        (_('Additional'), {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('organization')


@admin.register(AccessPermission)
class AccessPermissionAdmin(admin.ModelAdmin):
    """Admin configuration for AccessPermission model."""
    
    list_display = [
        'employee_email', 'organization', 'resource',
        'permission', 'is_active', 'created_at'
    ]
    list_filter = ['resource', 'permission', 'is_active', 'created_at']
    search_fields = [
        'employee__user__email', 'organization__name',
        'employee__user__first_name', 'employee__user__last_name'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Permission Details'), {
            'fields': ('organization', 'employee', 'resource', 'permission', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def employee_email(self, obj):
        """Display employee email."""
        return obj.employee.user.email
    employee_email.short_description = _('Employee Email')
    employee_email.admin_order_field = 'employee__user__email'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('organization', 'employee', 'employee__user')

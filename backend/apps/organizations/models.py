"""Organizations app models."""
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _


User = get_user_model()


class Organization(models.Model):
    """Organization model representing a company/business entity."""
    
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        SUSPENDED = 'suspended', _('Suspended')
    
    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_organizations',
        verbose_name=_('owner')
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    inn = models.CharField(_('INN'), max_length=12, blank=True, help_text=_('Tax identification number'))
    kpp = models.CharField(_('KPP'), max_length=9, blank=True, help_text=_('Tax registration reason code'))
    legal_address = models.TextField(_('legal address'), blank=True)
    phone = models.CharField(_('phone'), max_length=50, blank=True)
    email = models.EmailField(_('email'), blank=True)
    website = models.URLField(_('website'), blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'organizations'
        verbose_name = _('organization')
        verbose_name_plural = _('organizations')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['owner']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.name


class Employee(models.Model):
    """Employee model representing staff members of an organization."""
    
    class Role(models.TextChoices):
        OWNER = 'owner', _('Owner')
        ADMIN = 'admin', _('Administrator')
        MANAGER = 'manager', _('Manager')
        ANALYST = 'analyst', _('Analyst')
        VIEWER = 'viewer', _('Viewer')
    
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        INVITED = 'invited', _('Invited')
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='employees',
        verbose_name=_('organization')
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='employments',
        verbose_name=_('user')
    )
    role = models.CharField(
        _('role'),
        max_length=20,
        choices=Role.choices,
        default=Role.VIEWER
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    position = models.CharField(_('position'), max_length=100, blank=True)
    department = models.CharField(_('department'), max_length=100, blank=True)
    phone = models.CharField(_('phone'), max_length=50, blank=True)
    
    hired_at = models.DateField(_('hired at'), null=True, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'employees'
        verbose_name = _('employee')
        verbose_name_plural = _('employees')
        unique_together = [['organization', 'user']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'user']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.organization.name} ({self.role})"


class Partner(models.Model):
    """Partner model representing business partners/contractors."""
    
    class PartnerType(models.TextChoices):
        SUPPLIER = 'supplier', _('Supplier')
        CONTRACTOR = 'contractor', _('Contractor')
        DISTRIBUTOR = 'distributor', _('Distributor')
        AFFILIATE = 'affiliate', _('Affiliate')
        OTHER = 'other', _('Other')
    
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        PENDING = 'pending', _('Pending')
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='partners',
        verbose_name=_('organization')
    )
    name = models.CharField(_('name'), max_length=255)
    partner_type = models.CharField(
        _('partner type'),
        max_length=20,
        choices=PartnerType.choices,
        default=PartnerType.OTHER
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    
    inn = models.CharField(_('INN'), max_length=12, blank=True)
    kpp = models.CharField(_('KPP'), max_length=9, blank=True)
    contact_person = models.CharField(_('contact person'), max_length=255, blank=True)
    phone = models.CharField(_('phone'), max_length=50, blank=True)
    email = models.EmailField(_('email'), blank=True)
    address = models.TextField(_('address'), blank=True)
    
    contract_number = models.CharField(_('contract number'), max_length=100, blank=True)
    contract_date = models.DateField(_('contract date'), null=True, blank=True)
    
    notes = models.TextField(_('notes'), blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'partners'
        verbose_name = _('partner')
        verbose_name_plural = _('partners')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['name']),
            models.Index(fields=['partner_type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_partner_type_display()})"


class AccessPermission(models.Model):
    """Access permission model for role-based access control."""
    
    class Resource(models.TextChoices):
        CAMPAIGNS = 'campaigns', _('Campaigns')
        STATISTICS = 'statistics', _('Statistics')
        REPORTS = 'reports', _('Reports')
        FINANCES = 'finances', _('Finances')
        EMPLOYEES = 'employees', _('Employees')
        PARTNERS = 'partners', _('Partners')
        SETTINGS = 'settings', _('Settings')
        AUTOMATION = 'automation', _('Automation')
        INTEGRATIONS = 'integrations', _('Integrations')
    
    class Permission(models.TextChoices):
        VIEW = 'view', _('View')
        CREATE = 'create', _('Create')
        EDIT = 'edit', _('Edit')
        DELETE = 'delete', _('Delete')
        MANAGE = 'manage', _('Manage')
    
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='access_permissions',
        verbose_name=_('organization')
    )
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='permissions',
        verbose_name=_('employee')
    )
    resource = models.CharField(
        _('resource'),
        max_length=20,
        choices=Resource.choices
    )
    permission = models.CharField(
        _('permission'),
        max_length=20,
        choices=Permission.choices
    )
    
    is_active = models.BooleanField(_('is active'), default=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'access_permissions'
        verbose_name = _('access permission')
        verbose_name_plural = _('access permissions')
        unique_together = [['employee', 'resource', 'permission']]
        ordering = ['resource', 'permission']
        indexes = [
            models.Index(fields=['organization']),
            models.Index(fields=['employee']),
            models.Index(fields=['resource']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.employee.user.email} - {self.get_resource_display()}: {self.get_permission_display()}"

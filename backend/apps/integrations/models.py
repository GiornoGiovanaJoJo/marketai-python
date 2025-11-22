from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from encrypted_model_fields.fields import EncryptedCharField


class WildberriesAccount(models.Model):
    """
    Wildberries marketplace account
    Stores API credentials and account information
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wildberries_accounts',
        verbose_name=_('user'),
    )
    
    # Encrypted API key for security
    api_key = EncryptedCharField(
        _('API key'),
        max_length=500,
        help_text=_('Wildberries API key (encrypted)'),
    )
    
    shop_name = models.CharField(
        _('shop name'),
        max_length=255,
        blank=True,
        help_text=_('Seller shop name on Wildberries'),
    )
    
    seller_id = models.CharField(
        _('seller ID'),
        max_length=100,
        blank=True,
        help_text=_('Wildberries seller identifier'),
    )
    
    is_active = models.BooleanField(
        _('is active'),
        default=True,
        help_text=_('Account is active and can sync'),
    )
    
    last_sync = models.DateTimeField(
        _('last sync'),
        null=True,
        blank=True,
        help_text=_('Last successful synchronization timestamp'),
    )
    
    sync_frequency = models.IntegerField(
        _('sync frequency (minutes)'),
        default=60,
        validators=[MinValueValidator(15)],
        help_text=_('How often to sync data (minimum 15 minutes)'),
    )
    
    auto_sync_enabled = models.BooleanField(
        _('auto sync enabled'),
        default=True,
        help_text=_('Automatically sync data at specified frequency'),
    )
    
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
    )
    
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
    )
    
    class Meta:
        db_table = 'wildberries_accounts'
        verbose_name = _('Wildberries Account')
        verbose_name_plural = _('Wildberries Accounts')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['is_active', 'auto_sync_enabled']),
        ]
    
    def __str__(self):
        return f"{self.shop_name or self.seller_id} ({self.user.email})"


class WildberriesSyncLog(models.Model):
    """
    Log of Wildberries synchronization attempts
    Tracks success/failure and synced data
    """
    
    class SyncTypeChoices(models.TextChoices):
        CAMPAIGNS = 'campaigns', _('Campaigns')
        STATISTICS = 'statistics', _('Statistics')
        PRODUCTS = 'products', _('Products')
        FULL = 'full', _('Full Sync')
    
    class SyncStatusChoices(models.TextChoices):
        PENDING = 'pending', _('Pending')
        RUNNING = 'running', _('Running')
        SUCCESS = 'success', _('Success')
        FAILED = 'failed', _('Failed')
        PARTIAL = 'partial', _('Partial Success')
    
    account = models.ForeignKey(
        WildberriesAccount,
        on_delete=models.CASCADE,
        related_name='sync_logs',
        verbose_name=_('account'),
    )
    
    sync_type = models.CharField(
        _('sync type'),
        max_length=20,
        choices=SyncTypeChoices.choices,
    )
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=SyncStatusChoices.choices,
        default=SyncStatusChoices.PENDING,
    )
    
    started_at = models.DateTimeField(
        _('started at'),
        auto_now_add=True,
    )
    
    completed_at = models.DateTimeField(
        _('completed at'),
        null=True,
        blank=True,
    )
    
    # Statistics
    campaigns_synced = models.IntegerField(
        _('campaigns synced'),
        default=0,
    )
    
    statistics_synced = models.IntegerField(
        _('statistics records synced'),
        default=0,
    )
    
    products_synced = models.IntegerField(
        _('products synced'),
        default=0,
    )
    
    errors_count = models.IntegerField(
        _('errors count'),
        default=0,
    )
    
    error_message = models.TextField(
        _('error message'),
        blank=True,
        null=True,
    )
    
    error_details = models.JSONField(
        _('error details'),
        default=dict,
        blank=True,
        help_text=_('Detailed error information'),
    )
    
    sync_data = models.JSONField(
        _('sync data'),
        default=dict,
        blank=True,
        help_text=_('Summary of synced data'),
    )
    
    class Meta:
        db_table = 'wildberries_sync_logs'
        verbose_name = _('Wildberries Sync Log')
        verbose_name_plural = _('Wildberries Sync Logs')
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['account', 'status']),
            models.Index(fields=['status', 'started_at']),
            models.Index(fields=['sync_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.sync_type} - {self.status} ({self.started_at})"
    
    @property
    def duration(self):
        """Get sync duration in seconds"""
        if self.completed_at and self.started_at:
            delta = self.completed_at - self.started_at
            return delta.total_seconds()
        return None
    
    @property
    def is_completed(self):
        """Check if sync is completed"""
        return self.status in [
            self.SyncStatusChoices.SUCCESS,
            self.SyncStatusChoices.FAILED,
            self.SyncStatusChoices.PARTIAL,
        ]

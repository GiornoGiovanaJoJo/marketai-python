from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Campaign(models.Model):
    """
    Campaign model - migrated from Laravel
    Represents a marketing campaign on marketplaces
    """
    
    class MarketplaceChoices(models.TextChoices):
        WILDBERRIES = 'wildberries', 'Вайлдберриз'
        OZON = 'ozon', 'Ozon'
        YANDEX_MARKET = 'yandex_market', 'Яндекс.Маркет'
        OTHER = 'other', 'Другое'
    
    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Черновик'
        ACTIVE = 'active', 'Активна'
        PAUSED = 'paused', 'Приостановлена'
        COMPLETED = 'completed', 'Завершена'
        ARCHIVED = 'archived', 'Архив'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='campaigns',
        verbose_name=_('user'),
    )
    
    name = models.CharField(
        _('name'),
        max_length=255,
    )
    
    # Key field from Laravel (API key for marketplace integration)
    key = models.CharField(
        _('API key'),
        max_length=255,
        help_text=_('API key for marketplace integration'),
    )
    
    description = models.TextField(
        _('description'),
        blank=True,
        null=True,
    )
    
    marketplace = models.CharField(
        _('marketplace'),
        max_length=50,
        choices=MarketplaceChoices.choices,
        default=MarketplaceChoices.WILDBERRIES,
    )
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT,
    )
    
    budget = models.DecimalField(
        _('budget'),
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    
    spent = models.DecimalField(
        _('spent'),
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    
    start_date = models.DateField(
        _('start date'),
        null=True,
        blank=True,
    )
    
    end_date = models.DateField(
        _('end date'),
        null=True,
        blank=True,
    )
    
    # Metrics
    impressions = models.IntegerField(
        _('impressions'),
        default=0,
    )
    
    clicks = models.IntegerField(
        _('clicks'),
        default=0,
    )
    
    conversions = models.IntegerField(
        _('conversions'),
        default=0,
    )
    
    revenue = models.DecimalField(
        _('revenue'),
        max_digits=12,
        decimal_places=2,
        default=0,
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
        db_table = 'campaigns'
        verbose_name = _('Campaign')
        verbose_name_plural = _('Campaigns')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['marketplace', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_marketplace_display()}) - {self.get_status_display()}"
    
    @property
    def ctr(self):
        """Click-through rate"""
        if self.impressions > 0:
            return (self.clicks / self.impressions) * 100
        return 0
    
    @property
    def conversion_rate(self):
        """Conversion rate"""
        if self.clicks > 0:
            return (self.conversions / self.clicks) * 100
        return 0
    
    @property
    def roi(self):
        """Return on investment"""
        if float(self.spent) > 0:
            return ((float(self.revenue) - float(self.spent)) / float(self.spent)) * 100
        return 0

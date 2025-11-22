from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal


class CampaignStatistic(models.Model):
    """
    Daily statistics for campaigns
    Tracks detailed metrics for each campaign by date
    """
    
    campaign = models.ForeignKey(
        'campaigns.Campaign',
        on_delete=models.CASCADE,
        related_name='statistics',
        verbose_name=_('campaign'),
    )
    
    date = models.DateField(
        _('date'),
        db_index=True,
    )
    
    # Traffic metrics
    impressions = models.BigIntegerField(
        _('impressions'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    clicks = models.IntegerField(
        _('clicks'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    ctr = models.DecimalField(
        _('CTR (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text=_('Click-through rate'),
    )
    
    # Financial metrics
    spent = models.DecimalField(
        _('spent'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0'))],
    )
    
    cpc = models.DecimalField(
        _('CPC'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text=_('Cost per click'),
    )
    
    # Conversion metrics
    conversions = models.IntegerField(
        _('conversions'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    conversion_rate = models.DecimalField(
        _('conversion rate (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    
    revenue = models.DecimalField(
        _('revenue'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0'))],
    )
    
    roi = models.DecimalField(
        _('ROI (%)'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text=_('Return on investment'),
    )
    
    # Add to cart metrics
    add_to_cart = models.IntegerField(
        _('add to cart'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    cart_rate = models.DecimalField(
        _('cart rate (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
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
        db_table = 'campaign_statistics'
        verbose_name = _('Campaign Statistic')
        verbose_name_plural = _('Campaign Statistics')
        ordering = ['-date']
        unique_together = [['campaign', 'date']]
        indexes = [
            models.Index(fields=['campaign', 'date']),
            models.Index(fields=['date']),
            models.Index(fields=['campaign', '-date']),
        ]
    
    def __str__(self):
        return f"{self.campaign.name} - {self.date}"
    
    def save(self, *args, **kwargs):
        """Calculate derived metrics on save"""
        # Calculate CTR
        if self.impressions > 0:
            self.ctr = Decimal((self.clicks / self.impressions) * 100).quantize(Decimal('0.01'))
        
        # Calculate CPC
        if self.clicks > 0:
            self.cpc = (self.spent / Decimal(self.clicks)).quantize(Decimal('0.01'))
        
        # Calculate conversion rate
        if self.clicks > 0:
            self.conversion_rate = Decimal((self.conversions / self.clicks) * 100).quantize(Decimal('0.01'))
        
        # Calculate ROI
        if self.spent > 0:
            self.roi = Decimal(((self.revenue - self.spent) / self.spent) * 100).quantize(Decimal('0.01'))
        
        # Calculate cart rate
        if self.clicks > 0:
            self.cart_rate = Decimal((self.add_to_cart / self.clicks) * 100).quantize(Decimal('0.01'))
        
        super().save(*args, **kwargs)


class ProductStatistic(models.Model):
    """
    Product-level statistics
    Tracks performance of individual products within campaigns
    """
    
    campaign = models.ForeignKey(
        'campaigns.Campaign',
        on_delete=models.CASCADE,
        related_name='product_statistics',
        verbose_name=_('campaign'),
    )
    
    product_id = models.CharField(
        _('product ID'),
        max_length=100,
        help_text=_('Marketplace product identifier'),
    )
    
    product_name = models.CharField(
        _('product name'),
        max_length=500,
        blank=True,
    )
    
    date = models.DateField(
        _('date'),
        db_index=True,
    )
    
    # Traffic metrics
    views = models.BigIntegerField(
        _('views'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    clicks = models.IntegerField(
        _('clicks'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    # Engagement metrics
    add_to_cart = models.IntegerField(
        _('add to cart'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    add_to_favorites = models.IntegerField(
        _('add to favorites'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    # Sales metrics
    orders = models.IntegerField(
        _('orders'),
        default=0,
        validators=[MinValueValidator(0)],
    )
    
    revenue = models.DecimalField(
        _('revenue'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0'))],
    )
    
    # Cost metrics
    ad_spent = models.DecimalField(
        _('ad spent'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0'))],
    )
    
    # Calculated metrics
    conversion_rate = models.DecimalField(
        _('conversion rate (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    
    acos = models.DecimalField(
        _('ACoS (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text=_('Advertising Cost of Sales'),
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
        db_table = 'product_statistics'
        verbose_name = _('Product Statistic')
        verbose_name_plural = _('Product Statistics')
        ordering = ['-date', '-revenue']
        unique_together = [['campaign', 'product_id', 'date']]
        indexes = [
            models.Index(fields=['campaign', 'date']),
            models.Index(fields=['product_id', 'date']),
            models.Index(fields=['campaign', '-revenue']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.product_name or self.product_id} - {self.date}"
    
    def save(self, *args, **kwargs):
        """Calculate derived metrics on save"""
        # Calculate conversion rate
        if self.clicks > 0:
            self.conversion_rate = Decimal((self.orders / self.clicks) * 100).quantize(Decimal('0.01'))
        
        # Calculate ACoS (Advertising Cost of Sales)
        if self.revenue > 0:
            self.acos = Decimal((self.ad_spent / self.revenue) * 100).quantize(Decimal('0.01'))
        
        super().save(*args, **kwargs)


class DailyUserStatistic(models.Model):
    """
    Aggregated daily statistics per user
    Used for dashboard overview
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_statistics',
        verbose_name=_('user'),
    )
    
    date = models.DateField(
        _('date'),
        db_index=True,
    )
    
    # Aggregated metrics
    total_impressions = models.BigIntegerField(
        _('total impressions'),
        default=0,
    )
    
    total_clicks = models.IntegerField(
        _('total clicks'),
        default=0,
    )
    
    total_spent = models.DecimalField(
        _('total spent'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    
    total_revenue = models.DecimalField(
        _('total revenue'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    
    total_conversions = models.IntegerField(
        _('total conversions'),
        default=0,
    )
    
    active_campaigns = models.IntegerField(
        _('active campaigns'),
        default=0,
    )
    
    avg_ctr = models.DecimalField(
        _('average CTR (%)'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    
    avg_roi = models.DecimalField(
        _('average ROI (%)'),
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
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
        db_table = 'daily_user_statistics'
        verbose_name = _('Daily User Statistic')
        verbose_name_plural = _('Daily User Statistics')
        ordering = ['-date']
        unique_together = [['user', 'date']]
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.date}"

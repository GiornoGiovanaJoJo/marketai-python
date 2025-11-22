from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from .enums import CampaignStatus, Marketplace


class Campaign(models.Model):
    """
    Campaign model - exact migration from Laravel MarketAI backend
    
    Laravel Model: App\Models\Campaign
    Table: campaigns
    
    Key features:
    - No automatic timestamps (timestamps = false in Laravel)
    - Unique constraint on (user_id, key)
    - Foreign key to User with CASCADE delete
    - Dispatches events on create/delete (handled via Django signals)
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='campaigns',
        verbose_name=_('user'),
        db_index=True,
    )
    
    name = models.CharField(
        _('campaign name'),
        max_length=255,
    )
    
    key = models.CharField(
        _('API key'),
        max_length=2048,
        help_text=_('API key for marketplace integration (max 2048 chars)'),
    )
    
    status = models.IntegerField(
        _('status'),
        choices=CampaignStatus.choices,
        default=CampaignStatus.INACTIVE,
        help_text=_('Campaign status: Active (1), Inactive (2), Error (3)'),
    )
    
    marketplace = models.IntegerField(
        _('marketplace'),
        choices=Marketplace.choices,
        null=True,
        blank=True,
        help_text=_('Marketplace: Wildberries (1), Ozon (2), Yandex Market (3)'),
    )
    
    # Explicitly disable automatic timestamps (matching Laravel: $timestamps = false)
    # We keep the fields but don't auto-update them
    # created_at = models.DateTimeField(auto_now_add=True)  # Commented out
    # updated_at = models.DateTimeField(auto_now=True)      # Commented out
    
    class Meta:
        db_table = 'campaigns'
        verbose_name = _('Campaign')
        verbose_name_plural = _('Campaigns')
        ordering = ['-id']  # Order by ID descending since no created_at
        indexes = [
            models.Index(fields=['user']),  # Index on user_id (from Laravel migration)
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'key'],
                name='campaigns_user_id_key_unique',
                violation_error_message=_('This user already has a campaign with this key.'),
            )
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_marketplace_display() or 'No marketplace'}) - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        """
        Custom save method to ensure business logic
        """
        super().save(*args, **kwargs)

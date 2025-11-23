"""Referral app signals."""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Referral, ReferralSettings, ReferralLink
from .services import ReferralService


User = get_user_model()


@receiver(post_save, sender=User)
def create_referral_settings(sender, instance, created, **kwargs):
    """Create referral settings for new users."""
    if created:
        ReferralSettings.objects.create(user=instance)
        
        # Create initial referral link
        ReferralService.create_referral_link(user=instance)


@receiver(post_save, sender=Referral)
def handle_referral_activation(sender, instance, created, **kwargs):
    """Handle referral activation and income generation."""
    # TODO: Implement income generation logic when referral is activated
    pass

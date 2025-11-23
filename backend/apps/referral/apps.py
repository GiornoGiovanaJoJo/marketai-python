"""Referral app configuration."""
from django.apps import AppConfig


class ReferralConfig(AppConfig):
    """Configuration for Referral app."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.referral'
    verbose_name = 'Referral Program'
    
    def ready(self):
        """Import signals when app is ready."""
        try:
            import apps.referral.signals  # noqa: F401
        except ImportError:
            pass

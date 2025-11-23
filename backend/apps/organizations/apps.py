"""Organizations app configuration."""
from django.apps import AppConfig


class OrganizationsConfig(AppConfig):
    """Configuration for Organizations app."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.organizations'
    verbose_name = 'Organizations'
    
    def ready(self):
        """Import signals when app is ready."""
        try:
            import apps.organizations.signals  # noqa: F401
        except ImportError:
            pass

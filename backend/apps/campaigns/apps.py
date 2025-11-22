from django.apps import AppConfig


class CampaignsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.campaigns'
    verbose_name = 'Рекламные кампании'
    
    def ready(self):
        """
        Import signals when Django starts.
        This ensures signal handlers are connected.
        
        Equivalent to Laravel's $dispatchesEvents in the model.
        """
        import apps.campaigns.signals  # noqa: F401

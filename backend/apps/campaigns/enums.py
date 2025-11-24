"""
Campaign Enums - Django equivalent of Laravel Enums

Laravel Enums:
- App\\Enums\\CampaignStatus (int enum)
- App\\Enums\\Marketplace (int enum)

These are IntegerChoices in Django, stored as integers in the database.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _


class CampaignStatus(models.IntegerChoices):
    """
    Campaign status enum - migrated from Laravel App\\Enums\\CampaignStatus
    
    Values:
    - ACTIVE (1): Campaign is currently running
    - INACTIVE (2): Campaign is not active (paused state)
    - ERROR (3): Campaign has encountered an error
    - PAUSED (4): Campaign is manually paused
    - STOPPED (5): Campaign is stopped
    - DRAFT (6): Campaign is in draft state
    """
    ACTIVE = 1, _('Active')
    INACTIVE = 2, _('Inactive')
    ERROR = 3, _('Error')
    PAUSED = 4, _('Paused')
    STOPPED = 5, _('Stopped')
    DRAFT = 6, _('Draft')


class Marketplace(models.IntegerChoices):
    """
    Marketplace enum - migrated from Laravel App\\Enums\\Marketplace
    
    Values:
    - WILDBERRIES (1): Wildberries marketplace
    - OZON (2): Ozon marketplace
    - YANDEX_MARKET (3): Yandex Market marketplace
    """
    WILDBERRIES = 1, _('Wildberries')
    OZON = 2, _('Ozon')
    YANDEX_MARKET = 3, _('Yandex Market')

"""
Campaign Signals - Django equivalent of Laravel Events

Laravel Events:
- App\Events\CampaignCreated (dispatched on 'created' event)
- App\Events\CampaignDeleted (dispatched on 'deleted' event)

These signals can be used to trigger additional actions like:
- Sending to RabbitMQ queue
- Logging to analytics
- Updating related statistics
- Notifying external services
"""

import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Campaign

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Campaign)
def campaign_created(sender, instance, created, **kwargs):
    """
    Signal handler for Campaign creation
    
    Equivalent to Laravel: CampaignCreated event
    Dispatched when: new Campaign is created
    
    Args:
        sender: Campaign model class
        instance: The actual Campaign instance
        created: Boolean indicating if this is a new record
        **kwargs: Additional keyword arguments
    """
    if created:
        logger.info(
            f"Campaign created: ID={instance.id}, Name='{instance.name}', "
            f"User={instance.user.phone}, Status={instance.get_status_display()}, "
            f"Marketplace={instance.get_marketplace_display() or 'None'}"
        )
        
        # TODO: Add RabbitMQ message publishing here
        # Example:
        # publish_to_rabbitmq('campaign.created', {
        #     'campaign_id': instance.id,
        #     'user_id': instance.user.id,
        #     'name': instance.name,
        #     'status': instance.status,
        #     'marketplace': instance.marketplace,
        # })
        
        # TODO: Add other actions (analytics, notifications, etc.)


@receiver(post_delete, sender=Campaign)
def campaign_deleted(sender, instance, **kwargs):
    """
    Signal handler for Campaign deletion
    
    Equivalent to Laravel: CampaignDeleted event
    Dispatched when: Campaign is deleted
    
    Args:
        sender: Campaign model class
        instance: The Campaign instance being deleted
        **kwargs: Additional keyword arguments
    """
    logger.info(
        f"Campaign deleted: ID={instance.id}, Name='{instance.name}', "
        f"User={instance.user.phone}"
    )
    
    # TODO: Add RabbitMQ message publishing here
    # Example:
    # publish_to_rabbitmq('campaign.deleted', {
    #     'campaign_id': instance.id,
    #     'user_id': instance.user.id,
    #     'name': instance.name,
    # })
    
    # TODO: Cleanup related data if needed


@receiver(post_save, sender=Campaign)
def campaign_updated(sender, instance, created, **kwargs):
    """
    Signal handler for Campaign updates
    
    Note: This is NOT in Laravel (no update event dispatched there)
    But we add it for completeness in Django
    
    Args:
        sender: Campaign model class
        instance: The Campaign instance being updated
        created: Boolean indicating if this is a new record
        **kwargs: Additional keyword arguments
    """
    if not created:  # Only for updates, not creation
        logger.debug(
            f"Campaign updated: ID={instance.id}, Name='{instance.name}', "
            f"Status={instance.get_status_display()}"
        )
        
        # TODO: Add tracking for status changes, marketplace changes, etc.

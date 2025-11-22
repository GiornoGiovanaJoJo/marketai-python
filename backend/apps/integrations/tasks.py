from celery import shared_task
from django.contrib.auth import get_user_model
from .wildberries.service import WildberriesService
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(name='apps.integrations.tasks.sync_wildberries_data')
def sync_wildberries_data():
    """
    Synchronize data from Wildberries for all users
    Runs every hour (configured in celery.py)
    """
    logger.info('Starting Wildberries data synchronization')
    
    # Get users who have campaigns on Wildberries
    from apps.campaigns.models import Campaign
    
    user_ids = Campaign.objects.filter(
        marketplace=Campaign.MarketplaceChoices.WILDBERRIES
    ).values_list('user_id', flat=True).distinct()
    
    users = User.objects.filter(id__in=user_ids, is_active=True)
    
    synced_users = 0
    
    for user in users:
        try:
            service = WildberriesService(user)
            result = service.sync_campaigns()
            
            if result['status'] == 'success':
                synced_users += 1
                logger.info(f"Synced Wildberries data for user {user.email}")
            else:
                logger.warning(f"Failed to sync for user {user.email}: {result['message']}")
                
        except Exception as e:
            logger.error(f'Error syncing Wildberries data for user {user.email}: {str(e)}')
    
    logger.info(f'Completed Wildberries sync for {synced_users}/{users.count()} users')
    
    return {
        'status': 'completed',
        'total_users': users.count(),
        'synced_users': synced_users
    }

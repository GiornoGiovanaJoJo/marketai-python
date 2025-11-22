from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from .services import StatisticsService
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(name='apps.statistics.tasks.generate_daily_statistics')
def generate_daily_statistics():
    """
    Generate daily statistics for all users
    Runs every day at midnight (configured in celery.py)
    """
    logger.info('Starting daily statistics generation')
    
    users = User.objects.filter(is_active=True)
    
    for user in users:
        try:
            service = StatisticsService(user)
            report = service.get_financial_report()
            
            # Here you can save the report to database or send email
            logger.info(f'Generated statistics for user {user.email}')
            
        except Exception as e:
            logger.error(f'Error generating statistics for user {user.email}: {str(e)}')
    
    logger.info(f'Completed daily statistics generation for {users.count()} users')
    return {'status': 'completed', 'users_processed': users.count()}


@shared_task
def calculate_campaign_metrics(campaign_id):
    """
    Calculate and update campaign metrics
    Can be triggered after campaign data update
    """
    from apps.campaigns.models import Campaign
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
        
        # Metrics are calculated as properties in the model
        # This task can be used for more complex calculations
        # or to trigger notifications
        
        logger.info(f'Updated metrics for campaign {campaign.name}')
        return {'status': 'success', 'campaign_id': campaign_id}
        
    except Campaign.DoesNotExist:
        logger.error(f'Campaign {campaign_id} not found')
        return {'status': 'error', 'message': 'Campaign not found'}
    except Exception as e:
        logger.error(f'Error calculating metrics for campaign {campaign_id}: {str(e)}')
        return {'status': 'error', 'message': str(e)}

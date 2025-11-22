from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .services import StatisticsService
from .models import CampaignStatistic, ProductStatistic, DailyUserStatistic
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(name='apps.statistics.tasks.generate_daily_statistics')
def generate_daily_statistics():
    """
    Generate daily aggregated statistics for all users
    Runs every day at midnight (configured in celery.py)
    """
    logger.info('Starting daily statistics generation')
    
    # Process yesterday's data
    yesterday = timezone.now().date() - timedelta(days=1)
    
    users = User.objects.filter(is_active=True)
    processed_count = 0
    
    for user in users:
        try:
            service = StatisticsService(user)
            daily_stat = service.aggregate_daily_user_stats(date=yesterday)
            
            logger.info(f'Generated daily statistics for user {user.email} on {yesterday}')
            processed_count += 1
            
        except Exception as e:
            logger.error(f'Error generating statistics for user {user.email}: {str(e)}')
    
    logger.info(f'Completed daily statistics generation: {processed_count}/{users.count()} users')
    
    return {
        'status': 'completed',
        'date': yesterday.isoformat(),
        'users_processed': processed_count,
        'total_users': users.count()
    }


@shared_task(name='apps.statistics.tasks.aggregate_user_daily_stats')
def aggregate_user_daily_stats(user_id: int, date_str: str = None):
    """
    Aggregate daily statistics for a specific user
    
    Args:
        user_id: User ID
        date_str: Date in YYYY-MM-DD format (default: yesterday)
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error(f'User {user_id} not found')
        return {'status': 'error', 'message': 'User not found'}
    
    # Parse date
    if date_str:
        from datetime import datetime
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    else:
        date = timezone.now().date() - timedelta(days=1)
    
    try:
        service = StatisticsService(user)
        daily_stat = service.aggregate_daily_user_stats(date=date)
        
        logger.info(f'Aggregated daily statistics for user {user.email} on {date}')
        
        return {
            'status': 'success',
            'user_id': user_id,
            'date': date.isoformat(),
            'total_revenue': float(daily_stat.total_revenue),
            'total_spent': float(daily_stat.total_spent),
        }
        
    except Exception as e:
        logger.error(f'Error aggregating statistics for user {user_id}: {str(e)}')
        return {'status': 'error', 'message': str(e)}


@shared_task
def calculate_campaign_metrics(campaign_id):
    """
    Calculate and update campaign metrics
    Can be triggered after campaign data update
    """
    from apps.campaigns.models import Campaign
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
        
        # Aggregate statistics from CampaignStatistic model
        stats = CampaignStatistic.objects.filter(campaign=campaign).aggregate(
            total_impressions=models.Sum('impressions'),
            total_clicks=models.Sum('clicks'),
            total_conversions=models.Sum('conversions'),
            total_spent=models.Sum('spent'),
            total_revenue=models.Sum('revenue'),
        )
        
        # Update campaign with aggregated data
        if stats['total_impressions']:
            campaign.impressions = stats['total_impressions']
        if stats['total_clicks']:
            campaign.clicks = stats['total_clicks']
        if stats['total_conversions']:
            campaign.conversions = stats['total_conversions']
        if stats['total_spent']:
            campaign.spent = stats['total_spent']
        if stats['total_revenue']:
            campaign.revenue = stats['total_revenue']
        
        campaign.save()
        
        logger.info(f'Updated metrics for campaign {campaign.name}')
        return {'status': 'success', 'campaign_id': campaign_id}
        
    except Campaign.DoesNotExist:
        logger.error(f'Campaign {campaign_id} not found')
        return {'status': 'error', 'message': 'Campaign not found'}
    except Exception as e:
        logger.error(f'Error calculating metrics for campaign {campaign_id}: {str(e)}')
        return {'status': 'error', 'message': str(e)}


@shared_task(name='apps.statistics.tasks.cleanup_old_statistics')
def cleanup_old_statistics(days: int = 365):
    """
    Clean up old detailed statistics (older than specified days)
    Keep daily aggregated stats, remove granular data
    Runs monthly to prevent database bloat
    """
    cutoff_date = timezone.now().date() - timedelta(days=days)
    
    # Delete old CampaignStatistic records
    campaign_deleted, _ = CampaignStatistic.objects.filter(
        date__lt=cutoff_date
    ).delete()
    
    # Delete old ProductStatistic records
    product_deleted, _ = ProductStatistic.objects.filter(
        date__lt=cutoff_date
    ).delete()
    
    logger.info(
        f'Cleaned up old statistics: '
        f'{campaign_deleted} campaign stats, '
        f'{product_deleted} product stats '
        f'older than {days} days'
    )
    
    return {
        'status': 'completed',
        'cutoff_date': cutoff_date.isoformat(),
        'campaign_stats_deleted': campaign_deleted,
        'product_stats_deleted': product_deleted,
    }


@shared_task(name='apps.statistics.tasks.recalculate_all_campaigns')
def recalculate_all_campaigns():
    """
    Recalculate metrics for all campaigns
    Useful after bulk data import or migration
    """
    from apps.campaigns.models import Campaign
    
    campaigns = Campaign.objects.all()
    processed = 0
    
    for campaign in campaigns:
        try:
            calculate_campaign_metrics.delay(campaign.id)
            processed += 1
        except Exception as e:
            logger.error(f'Error queuing recalculation for campaign {campaign.id}: {str(e)}')
    
    logger.info(f'Queued recalculation for {processed}/{campaigns.count()} campaigns')
    
    return {
        'status': 'completed',
        'total_campaigns': campaigns.count(),
        'queued': processed
    }


@shared_task(name='apps.statistics.tasks.generate_weekly_report')
def generate_weekly_report():
    """
    Generate weekly reports for all users
    Can be used to send email summaries
    Runs every Monday at 9 AM
    """
    logger.info('Starting weekly report generation')
    
    from datetime import datetime
    
    # Get last 7 days
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=7)
    
    users = User.objects.filter(is_active=True)
    processed_count = 0
    
    for user in users:
        try:
            service = StatisticsService(user)
            report = service.get_financial_report(
                start_date=start_date,
                end_date=end_date
            )
            
            # Here you can:
            # 1. Save report to database
            # 2. Send email to user
            # 3. Create notification
            
            logger.info(f'Generated weekly report for user {user.email}')
            processed_count += 1
            
        except Exception as e:
            logger.error(f'Error generating weekly report for user {user.email}: {str(e)}')
    
    logger.info(f'Completed weekly report generation: {processed_count}/{users.count()} users')
    
    return {
        'status': 'completed',
        'period': f'{start_date} to {end_date}',
        'users_processed': processed_count,
        'total_users': users.count()
    }

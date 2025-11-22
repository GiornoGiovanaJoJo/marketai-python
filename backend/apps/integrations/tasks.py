from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from .wildberries.service import WildberriesService
from .models import WildberriesAccount, WildberriesSyncLog
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@shared_task(name='apps.integrations.tasks.sync_wildberries_data')
def sync_wildberries_data():
    """
    Synchronize data from Wildberries for all active accounts
    Runs every hour (configured in celery.py)
    """
    logger.info('Starting Wildberries data synchronization')
    
    # Get all active accounts with auto-sync enabled
    accounts = WildberriesAccount.objects.filter(
        is_active=True,
        auto_sync_enabled=True
    ).select_related('user')
    
    synced_count = 0
    failed_count = 0
    
    for account in accounts:
        try:
            # Create sync log
            sync_log = WildberriesSyncLog.objects.create(
                account=account,
                sync_type=WildberriesSyncLog.SyncTypeChoices.FULL,
                status=WildberriesSyncLog.SyncStatusChoices.RUNNING,
            )
            
            # Perform sync
            service = WildberriesService(account.user, account)
            result = service.sync_all_data()
            
            # Update sync log
            sync_log.status = WildberriesSyncLog.SyncStatusChoices.SUCCESS if result['status'] == 'success' else WildberriesSyncLog.SyncStatusChoices.FAILED
            sync_log.completed_at = timezone.now()
            sync_log.campaigns_synced = result.get('campaigns_synced', 0)
            sync_log.statistics_synced = result.get('statistics_synced', 0)
            sync_log.products_synced = result.get('products_synced', 0)
            sync_log.error_message = result.get('message', '')
            sync_log.sync_data = result
            sync_log.save()
            
            # Update account last_sync
            if result['status'] == 'success':
                account.last_sync = timezone.now()
                account.save(update_fields=['last_sync'])
                synced_count += 1
                logger.info(f"Synced Wildberries account {account.id} for user {account.user.email}")
            else:
                failed_count += 1
                logger.warning(f"Failed to sync account {account.id}: {result.get('message', 'Unknown error')}")
                
        except Exception as e:
            failed_count += 1
            logger.error(f'Error syncing Wildberries account {account.id}: {str(e)}')
            
            # Update sync log with error
            if 'sync_log' in locals():
                sync_log.status = WildberriesSyncLog.SyncStatusChoices.FAILED
                sync_log.completed_at = timezone.now()
                sync_log.error_message = str(e)
                sync_log.errors_count = 1
                sync_log.save()
    
    logger.info(f'Completed Wildberries sync: {synced_count} success, {failed_count} failed out of {accounts.count()} accounts')
    
    return {
        'status': 'completed',
        'total_accounts': accounts.count(),
        'synced': synced_count,
        'failed': failed_count
    }


@shared_task(name='apps.integrations.tasks.sync_wildberries_account')
def sync_wildberries_account(account_id: int):
    """
    Synchronize data for a specific Wildberries account
    Can be triggered manually or by schedule
    """
    try:
        account = WildberriesAccount.objects.select_related('user').get(id=account_id)
    except WildberriesAccount.DoesNotExist:
        logger.error(f'Wildberries account {account_id} not found')
        return {'status': 'error', 'message': 'Account not found'}
    
    if not account.is_active:
        logger.warning(f'Account {account_id} is not active')
        return {'status': 'error', 'message': 'Account is not active'}
    
    # Create sync log
    sync_log = WildberriesSyncLog.objects.create(
        account=account,
        sync_type=WildberriesSyncLog.SyncTypeChoices.FULL,
        status=WildberriesSyncLog.SyncStatusChoices.RUNNING,
    )
    
    try:
        # Perform sync
        service = WildberriesService(account.user, account)
        result = service.sync_all_data()
        
        # Update sync log
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.SUCCESS if result['status'] == 'success' else WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.campaigns_synced = result.get('campaigns_synced', 0)
        sync_log.statistics_synced = result.get('statistics_synced', 0)
        sync_log.products_synced = result.get('products_synced', 0)
        sync_log.error_message = result.get('message', '')
        sync_log.sync_data = result
        sync_log.save()
        
        # Update account last_sync
        if result['status'] == 'success':
            account.last_sync = timezone.now()
            account.save(update_fields=['last_sync'])
        
        return result
        
    except Exception as e:
        logger.error(f'Error syncing account {account_id}: {str(e)}')
        
        # Update sync log with error
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.error_message = str(e)
        sync_log.errors_count = 1
        sync_log.save()
        
        return {'status': 'error', 'message': str(e)}


@shared_task(name='apps.integrations.tasks.sync_wildberries_campaigns')
def sync_wildberries_campaigns(account_id: int):
    """
    Sync only campaigns for a specific account
    Faster than full sync
    """
    try:
        account = WildberriesAccount.objects.select_related('user').get(id=account_id)
    except WildberriesAccount.DoesNotExist:
        return {'status': 'error', 'message': 'Account not found'}
    
    sync_log = WildberriesSyncLog.objects.create(
        account=account,
        sync_type=WildberriesSyncLog.SyncTypeChoices.CAMPAIGNS,
        status=WildberriesSyncLog.SyncStatusChoices.RUNNING,
    )
    
    try:
        service = WildberriesService(account.user, account)
        result = service.sync_campaigns()
        
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.SUCCESS if result['status'] == 'success' else WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.campaigns_synced = result.get('campaigns_synced', 0)
        sync_log.error_message = result.get('message', '')
        sync_log.save()
        
        return result
        
    except Exception as e:
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.error_message = str(e)
        sync_log.save()
        return {'status': 'error', 'message': str(e)}


@shared_task(name='apps.integrations.tasks.sync_wildberries_statistics')
def sync_wildberries_statistics(account_id: int, days: int = 30):
    """
    Sync statistics for a specific account
    
    Args:
        account_id: Account ID
        days: Number of days to sync (default: 30)
    """
    try:
        account = WildberriesAccount.objects.select_related('user').get(id=account_id)
    except WildberriesAccount.DoesNotExist:
        return {'status': 'error', 'message': 'Account not found'}
    
    sync_log = WildberriesSyncLog.objects.create(
        account=account,
        sync_type=WildberriesSyncLog.SyncTypeChoices.STATISTICS,
        status=WildberriesSyncLog.SyncStatusChoices.RUNNING,
    )
    
    try:
        service = WildberriesService(account.user, account)
        result = service.sync_statistics(days=days)
        
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.SUCCESS if result['status'] == 'success' else WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.statistics_synced = result.get('statistics_synced', 0)
        sync_log.error_message = result.get('message', '')
        sync_log.save()
        
        return result
        
    except Exception as e:
        sync_log.status = WildberriesSyncLog.SyncStatusChoices.FAILED
        sync_log.completed_at = timezone.now()
        sync_log.error_message = str(e)
        sync_log.save()
        return {'status': 'error', 'message': str(e)}


@shared_task(name='apps.integrations.tasks.cleanup_old_sync_logs')
def cleanup_old_sync_logs(days: int = 90):
    """
    Clean up old sync logs (older than specified days)
    Runs daily to prevent database bloat
    """
    from datetime import timedelta
    
    cutoff_date = timezone.now() - timedelta(days=days)
    
    deleted_count, _ = WildberriesSyncLog.objects.filter(
        started_at__lt=cutoff_date
    ).delete()
    
    logger.info(f'Cleaned up {deleted_count} old sync logs older than {days} days')
    
    return {
        'status': 'completed',
        'deleted_count': deleted_count,
        'cutoff_date': cutoff_date.isoformat()
    }

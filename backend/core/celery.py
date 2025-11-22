import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('marketai')

# Load config from Django settings with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Celery Beat schedule (periodic tasks)
app.conf.beat_schedule = {
    # Wildberries synchronization - every hour
    'sync-wildberries-data-every-hour': {
        'task': 'apps.integrations.tasks.sync_wildberries_data',
        'schedule': crontab(minute=0),  # Every hour at :00
    },
    
    # Daily statistics generation - every day at midnight
    'generate-daily-statistics': {
        'task': 'apps.statistics.tasks.generate_daily_statistics',
        'schedule': crontab(hour=0, minute=0),  # 00:00 every day
    },
    
    # Weekly reports - every Monday at 9 AM
    'generate-weekly-reports': {
        'task': 'apps.statistics.tasks.generate_weekly_report',
        'schedule': crontab(hour=9, minute=0, day_of_week=1),  # Monday 09:00
    },
    
    # Cleanup old statistics - first day of month at 2 AM
    'cleanup-old-statistics': {
        'task': 'apps.statistics.tasks.cleanup_old_statistics',
        'schedule': crontab(hour=2, minute=0, day_of_month=1),  # 02:00 on 1st day
    },
    
    # Cleanup old sync logs - every Sunday at 3 AM
    'cleanup-old-sync-logs': {
        'task': 'apps.integrations.tasks.cleanup_old_sync_logs',
        'schedule': crontab(hour=3, minute=0, day_of_week=0),  # Sunday 03:00
    },
}

# Celery configuration
app.conf.update(
    # Task settings
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Moscow',  # MSK timezone
    enable_utc=True,
    
    # Task execution settings
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_time_limit=3600,  # 1 hour
    task_soft_time_limit=3000,  # 50 minutes
    
    # Result backend settings
    result_expires=86400,  # 24 hours
    
    # Worker settings
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for testing Celery"""
    print(f'Request: {self.request!r}')

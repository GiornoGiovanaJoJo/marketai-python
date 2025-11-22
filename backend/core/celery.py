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
    'sync-wildberries-data-every-hour': {
        'task': 'apps.integrations.tasks.sync_wildberries_data',
        'schedule': crontab(minute=0),  # Every hour
    },
    'generate-daily-statistics': {
        'task': 'apps.statistics.tasks.generate_daily_statistics',
        'schedule': crontab(hour=0, minute=0),  # Every day at midnight
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

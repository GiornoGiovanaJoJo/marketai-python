from django.urls import path
from . import views

app_name = 'integrations'

urlpatterns = [
    # Wildberries integration
    path('wildberries/sync/', views.sync_wildberries_campaigns, name='wb-sync'),
    path('wildberries/sync/statistics/', views.sync_campaign_statistics, name='wb-sync-stats'),
    path('wildberries/test/', views.test_wildberries_connection, name='wb-test'),
]

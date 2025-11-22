from django.urls import path
from . import views

app_name = 'statistics'

urlpatterns = [
    # Migrated from Laravel
    path('financial-report/', views.financial_report, name='financial-report'),
    
    # Additional endpoints
    path('campaign/<int:campaign_id>/performance/', views.campaign_performance, name='campaign-performance'),
    path('dashboard/', views.dashboard_stats, name='dashboard'),
]

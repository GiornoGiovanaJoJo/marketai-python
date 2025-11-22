from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'statistics'

# Create router for viewsets
router = DefaultRouter()
router.register(r'campaign-statistics', views.CampaignStatisticViewSet, basename='campaign-statistics')
router.register(r'product-statistics', views.ProductStatisticViewSet, basename='product-statistics')
router.register(r'daily-user-statistics', views.DailyUserStatisticViewSet, basename='daily-user-statistics')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Migrated from Laravel
    path('financial-report/', views.financial_report, name='financial-report'),
    
    # Dashboard
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    
    # Campaign performance
    path('campaigns/<int:campaign_id>/performance/', views.campaign_performance, name='campaign-performance'),
    path('campaigns/<int:campaign_id>/detailed/', views.campaign_detailed_stats, name='campaign-detailed-stats'),
    path('campaigns/<int:campaign_id>/chart/', views.campaign_chart_data, name='campaign-chart-data'),
    path('campaigns/<int:campaign_id>/top-products/', views.campaign_top_products, name='campaign-top-products'),
    
    # Top products
    path('top-products/', views.top_products, name='top-products'),
]

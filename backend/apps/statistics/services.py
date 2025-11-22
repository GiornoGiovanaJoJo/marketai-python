from django.db.models import Sum, Count, Avg, Q, F, Max
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from apps.campaigns.models import Campaign
from .models import CampaignStatistic, ProductStatistic, DailyUserStatistic
import logging

logger = logging.getLogger(__name__)


class StatisticsService:
    """
    Service for statistics calculations
    Migrated from Laravel StatisticService
    """
    
    def __init__(self, user):
        self.user = user
    
    def get_financial_report(self, start_date=None, end_date=None):
        """
        Generate financial report for user's campaigns
        Migrated from Laravel: GET /api/statistics/financial-report
        """
        # Get user's campaigns
        campaigns = Campaign.objects.filter(user=self.user)
        
        # Apply date filters if provided
        if start_date:
            campaigns = campaigns.filter(created_at__gte=start_date)
        if end_date:
            campaigns = campaigns.filter(created_at__lte=end_date)
        
        # Aggregate statistics
        stats = campaigns.aggregate(
            total_budget=Sum('budget'),
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            total_campaigns=Count('id'),
            active_campaigns=Count('id', filter=Q(status=Campaign.StatusChoices.ACTIVE)),
            avg_ctr=Avg('clicks') / Avg('impressions') * 100 if campaigns.exists() else 0,
        )
        
        # Calculate ROI
        total_spent = float(stats['total_spent'] or 0)
        total_revenue = float(stats['total_revenue'] or 0)
        
        if total_spent > 0:
            roi = ((total_revenue - total_spent) / total_spent) * 100
        else:
            roi = 0
        
        # Get campaigns by marketplace
        marketplace_stats = campaigns.values('marketplace').annotate(
            count=Count('id'),
            revenue=Sum('revenue'),
            spent=Sum('spent'),
        )
        
        # Get campaigns by status
        status_stats = campaigns.values('status').annotate(
            count=Count('id'),
        )
        
        return {
            'summary': {
                'total_campaigns': stats['total_campaigns'],
                'active_campaigns': stats['active_campaigns'],
                'total_budget': float(stats['total_budget'] or 0),
                'total_spent': total_spent,
                'total_revenue': total_revenue,
                'roi': round(roi, 2),
            },
            'by_marketplace': list(marketplace_stats),
            'by_status': list(status_stats),
            'period': {
                'start_date': start_date,
                'end_date': end_date,
            }
        }
    
    def get_campaign_performance(self, campaign_id):
        """
        Get detailed performance metrics for a campaign
        """
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=self.user)
        except Campaign.DoesNotExist:
            return None
        
        return {
            'campaign_id': campaign.id,
            'name': campaign.name,
            'metrics': {
                'impressions': campaign.impressions,
                'clicks': campaign.clicks,
                'conversions': campaign.conversions,
                'ctr': round(campaign.ctr, 2),
                'conversion_rate': round(campaign.conversion_rate, 2),
            },
            'financial': {
                'budget': float(campaign.budget or 0),
                'spent': float(campaign.spent),
                'revenue': float(campaign.revenue),
                'roi': round(campaign.roi, 2),
            }
        }
    
    def get_dashboard_stats(self):
        """
        Get statistics for dashboard
        """
        # Last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        campaigns = Campaign.objects.filter(
            user=self.user,
            created_at__gte=thirty_days_ago
        )
        
        # Current period stats
        current_stats = campaigns.aggregate(
            total_revenue=Sum('revenue'),
            total_spent=Sum('spent'),
            total_campaigns=Count('id'),
        )
        
        # Previous period for comparison
        sixty_days_ago = timezone.now() - timedelta(days=60)
        previous_campaigns = Campaign.objects.filter(
            user=self.user,
            created_at__gte=sixty_days_ago,
            created_at__lt=thirty_days_ago
        )
        
        previous_stats = previous_campaigns.aggregate(
            total_revenue=Sum('revenue'),
            total_spent=Sum('spent'),
        )
        
        # Calculate growth
        def calculate_growth(current, previous):
            if previous and previous > 0:
                return ((current - previous) / previous) * 100
            return 0
        
        current_revenue = float(current_stats['total_revenue'] or 0)
        previous_revenue = float(previous_stats['total_revenue'] or 0)
        current_spent = float(current_stats['total_spent'] or 0)
        previous_spent = float(previous_stats['total_spent'] or 0)
        
        return {
            'current_period': {
                'revenue': current_revenue,
                'spent': current_spent,
                'campaigns': current_stats['total_campaigns'],
            },
            'growth': {
                'revenue': round(calculate_growth(current_revenue, previous_revenue), 2),
                'spent': round(calculate_growth(current_spent, previous_spent), 2),
            },
            'period_days': 30,
        }
    
    def get_campaign_detailed_stats(self, campaign_id, start_date=None, end_date=None):
        """
        Get comprehensive statistics for a campaign
        """
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=self.user)
        except Campaign.DoesNotExist:
            return None
        
        # Filter daily statistics
        daily_stats = CampaignStatistic.objects.filter(campaign=campaign)
        
        if start_date:
            daily_stats = daily_stats.filter(date__gte=start_date)
        if end_date:
            daily_stats = daily_stats.filter(date__lte=end_date)
        
        daily_stats = daily_stats.order_by('date')
        
        # Calculate total metrics
        total_metrics = daily_stats.aggregate(
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_conversions=Sum('conversions'),
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            avg_ctr=Avg('ctr'),
            avg_roi=Avg('roi'),
        )
        
        # Get top products for this campaign
        top_products = self.get_campaign_top_products(campaign_id, limit=5)
        
        # Prepare chart data
        chart_data = []
        for stat in daily_stats:
            chart_data.append({
                'date': stat.date,
                'impressions': stat.impressions,
                'clicks': stat.clicks,
                'conversions': stat.conversions,
                'spent': stat.spent,
                'revenue': stat.revenue,
                'ctr': stat.ctr,
                'roi': stat.roi,
            })
        
        return {
            'campaign_info': {
                'id': campaign.id,
                'name': campaign.name,
                'marketplace': campaign.marketplace,
                'status': campaign.status,
            },
            'total_metrics': {
                'impressions': total_metrics['total_impressions'] or 0,
                'clicks': total_metrics['total_clicks'] or 0,
                'conversions': total_metrics['total_conversions'] or 0,
                'spent': float(total_metrics['total_spent'] or 0),
                'revenue': float(total_metrics['total_revenue'] or 0),
                'avg_ctr': float(total_metrics['avg_ctr'] or 0),
                'avg_roi': float(total_metrics['avg_roi'] or 0),
            },
            'daily_stats': daily_stats,
            'top_products': top_products or [],
            'chart_data': chart_data,
        }
    
    def get_campaign_chart_data(self, campaign_id, start_date=None, end_date=None):
        """
        Get time series data for campaign charts
        """
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=self.user)
        except Campaign.DoesNotExist:
            return None
        
        # Filter daily statistics
        daily_stats = CampaignStatistic.objects.filter(campaign=campaign)
        
        if start_date:
            daily_stats = daily_stats.filter(date__gte=start_date)
        if end_date:
            daily_stats = daily_stats.filter(date__lte=end_date)
        
        daily_stats = daily_stats.order_by('date')
        
        chart_data = []
        for stat in daily_stats:
            chart_data.append({
                'date': stat.date,
                'impressions': stat.impressions,
                'clicks': stat.clicks,
                'conversions': stat.conversions,
                'spent': stat.spent,
                'revenue': stat.revenue,
                'ctr': stat.ctr,
                'roi': stat.roi,
            })
        
        return chart_data
    
    def get_top_products(self, limit=10):
        """
        Get top performing products across all user's campaigns
        """
        campaign_ids = Campaign.objects.filter(user=self.user).values_list('id', flat=True)
        
        # Aggregate product statistics
        products = ProductStatistic.objects.filter(
            campaign_id__in=campaign_ids
        ).values('product_id', 'product_name').annotate(
            total_revenue=Sum('revenue'),
            total_orders=Sum('orders'),
            total_views=Sum('views'),
            avg_conversion_rate=Avg('conversion_rate'),
            avg_acos=Avg('acos'),
        ).order_by('-total_revenue')[:limit]
        
        return list(products)
    
    def get_campaign_top_products(self, campaign_id, limit=10):
        """
        Get top performing products for a specific campaign
        """
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=self.user)
        except Campaign.DoesNotExist:
            return None
        
        # Aggregate product statistics for this campaign
        products = ProductStatistic.objects.filter(
            campaign=campaign
        ).values('product_id', 'product_name').annotate(
            total_revenue=Sum('revenue'),
            total_orders=Sum('orders'),
            total_views=Sum('views'),
            avg_conversion_rate=Avg('conversion_rate'),
            avg_acos=Avg('acos'),
        ).order_by('-total_revenue')[:limit]
        
        return list(products)
    
    def aggregate_daily_user_stats(self, date=None):
        """
        Aggregate daily statistics for a user
        Called by Celery task daily
        """
        if date is None:
            date = timezone.now().date() - timedelta(days=1)  # Yesterday
        
        # Get all user's campaigns
        campaigns = Campaign.objects.filter(user=self.user)
        campaign_ids = list(campaigns.values_list('id', flat=True))
        
        # Aggregate daily statistics
        daily_stats = CampaignStatistic.objects.filter(
            campaign_id__in=campaign_ids,
            date=date
        ).aggregate(
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            total_conversions=Sum('conversions'),
            avg_ctr=Avg('ctr'),
            avg_roi=Avg('roi'),
        )
        
        # Count active campaigns
        active_campaigns = campaigns.filter(
            status=Campaign.StatusChoices.ACTIVE
        ).count()
        
        # Create or update DailyUserStatistic
        daily_user_stat, created = DailyUserStatistic.objects.update_or_create(
            user=self.user,
            date=date,
            defaults={
                'total_impressions': daily_stats['total_impressions'] or 0,
                'total_clicks': daily_stats['total_clicks'] or 0,
                'total_spent': daily_stats['total_spent'] or Decimal('0.00'),
                'total_revenue': daily_stats['total_revenue'] or Decimal('0.00'),
                'total_conversions': daily_stats['total_conversions'] or 0,
                'active_campaigns': active_campaigns,
                'avg_ctr': daily_stats['avg_ctr'] or Decimal('0.00'),
                'avg_roi': daily_stats['avg_roi'] or Decimal('0.00'),
            }
        )
        
        logger.info(
            f"{'Created' if created else 'Updated'} daily user statistics for {self.user.email} on {date}"
        )
        
        return daily_user_stat

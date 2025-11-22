from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from apps.campaigns.models import Campaign
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

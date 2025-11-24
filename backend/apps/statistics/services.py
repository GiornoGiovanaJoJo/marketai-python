"""
Statistics Service Layer
Migrated from Laravel StatisticService
Provides comprehensive statistics calculations for campaigns, products, and users
"""

from django.db.models import Sum, Count, Avg, Q, F, Max, Min
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from typing import Dict, Any, Optional, List
from apps.campaigns.models import Campaign
from apps.campaigns.enums import CampaignStatus
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

    def get_financial_report(
            self,
            start_date: Optional[datetime] = None,
            end_date: Optional[datetime] = None,
            marketplace: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get comprehensive financial report for user campaigns

        Args:
            start_date: Start date for the report period
            end_date: End date for the report period
            marketplace: Optional filter by marketplace

        Returns:
            Dict containing summary, period, by_marketplace, and by_status data
        """
        # Default date range: last 30 days
        if not start_date:
            start_date = timezone.now() - timedelta(days=30)
        if not end_date:
            end_date = timezone.now()

        # Base queryset
        campaigns = Campaign.objects.filter(user=self.user)

        # Optional marketplace filter
        if marketplace:
            campaigns = campaigns.filter(marketplace=marketplace)

        # Get statistics for campaigns
        stats_data = CampaignStatistic.objects.filter(
            campaign__user=self.user,
            date__gte=start_date,
            date__lte=end_date
        )

        # Optional marketplace filter on statistics
        if marketplace:
            stats_data = stats_data.filter(campaign__marketplace=marketplace)

        aggregated = stats_data.aggregate(
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
        )

        # Safe conversion to float
        total_spent = float(aggregated.get('total_spent') or 0)
        total_revenue = float(aggregated.get('total_revenue') or 0)
        total_impressions = int(aggregated.get('total_impressions') or 0)
        total_clicks = int(aggregated.get('total_clicks') or 0)

        # Calculate ROI
        if total_spent > 0:
            roi = ((total_revenue - total_spent) / total_spent) * 100
        else:
            roi = 0

        # Aggregate statistics by marketplace
        by_marketplace = self._aggregate_by_marketplace(
            start_date=start_date,
            end_date=end_date
        )

        # Aggregate statistics by status
        by_status = self._aggregate_by_status(
            start_date=start_date,
            end_date=end_date
        )

        return {
            'summary': {
                'total_campaigns': campaigns.count(),
                'active_campaigns': campaigns.filter(status=CampaignStatus.ACTIVE).count(),
                'paused_campaigns': campaigns.filter(status=CampaignStatus.PAUSED).count(),
                'total_spent': round(total_spent, 2),
                'total_revenue': round(total_revenue, 2),
                'roi': round(roi, 2),
                'total_impressions': total_impressions,
                'total_clicks': total_clicks,
                'ctr': round((total_clicks / total_impressions * 100) if total_impressions > 0 else 0, 2),
            },
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            },
            'by_marketplace': by_marketplace,
            'by_status': by_status,
        }

    def _aggregate_by_marketplace(
            self,
            start_date: datetime,
            end_date: datetime
    ) -> Dict[str, Dict[str, Any]]:
        """
        Aggregate statistics grouped by marketplace

        Args:
            start_date: Start date for aggregation
            end_date: End date for aggregation

        Returns:
            Dict with marketplace as key and stats as value
        """
        campaigns = Campaign.objects.filter(user=self.user)

        # Get unique marketplaces for this user
        marketplaces = campaigns.values_list('marketplace', flat=True).distinct()

        by_marketplace = {}

        for marketplace in marketplaces:
            if not marketplace:  # Skip None/empty marketplaces
                continue

            m_stats = CampaignStatistic.objects.filter(
                campaign__user=self.user,
                campaign__marketplace=marketplace,
                date__gte=start_date,
                date__lte=end_date
            ).aggregate(
                total_spent=Sum('spent'),
                total_revenue=Sum('revenue'),
                total_impressions=Sum('impressions'),
                total_clicks=Sum('clicks'),
            )

            spent = float(m_stats.get('total_spent') or 0)
            revenue = float(m_stats.get('total_revenue') or 0)
            impressions = int(m_stats.get('total_impressions') or 0)
            clicks = int(m_stats.get('total_clicks') or 0)

            # Calculate ROI per marketplace
            roi = ((revenue - spent) / spent * 100) if spent > 0 else 0

            by_marketplace[str(marketplace)] = {
                'total_spent': round(spent, 2),
                'total_revenue': round(revenue, 2),
                'roi': round(roi, 2),
                'total_impressions': impressions,
                'total_clicks': clicks,
                'ctr': round((clicks / impressions * 100) if impressions > 0 else 0, 2),
                'campaigns_count': campaigns.filter(marketplace=marketplace).count(),
            }

        return by_marketplace

    def _aggregate_by_status(
            self,
            start_date: datetime,
            end_date: datetime
    ) -> Dict[str, Dict[str, Any]]:
        """
        Aggregate statistics grouped by campaign status

        Args:
            start_date: Start date for aggregation
            end_date: End date for aggregation

        Returns:
            Dict with status as key and stats as value
        """
        by_status = {}

        # Iterate through all possible statuses
        for status_choice in CampaignStatus.choices:
            status_value = status_choice[0]  # Integer value (1, 2, 3, etc.)
            status_label = status_choice[1]  # Display name ("Active", "Paused", etc.)

            # Get campaigns with this status
            campaigns_with_status = Campaign.objects.filter(
                user=self.user,
                status=status_value
            )

            # Get statistics for campaigns with this status
            s_stats = CampaignStatistic.objects.filter(
                campaign__user=self.user,
                campaign__status=status_value,
                date__gte=start_date,
                date__lte=end_date
            ).aggregate(
                total_spent=Sum('spent'),
                total_revenue=Sum('revenue'),
                total_impressions=Sum('impressions'),
                total_clicks=Sum('clicks'),
            )

            spent = float(s_stats.get('total_spent') or 0)
            revenue = float(s_stats.get('total_revenue') or 0)
            impressions = int(s_stats.get('total_impressions') or 0)
            clicks = int(s_stats.get('total_clicks') or 0)

            # Calculate ROI per status
            roi = ((revenue - spent) / spent * 100) if spent > 0 else 0

            # Use string representation of status for JSON key
            status_key = str(status_label).lower()

            by_status[status_key] = {
                'total_spent': round(spent, 2),
                'total_revenue': round(revenue, 2),
                'roi': round(roi, 2),
                'total_impressions': impressions,
                'total_clicks': clicks,
                'ctr': round((clicks / impressions * 100) if impressions > 0 else 0, 2),
                'campaigns_count': campaigns_with_status.count(),
            }

        return by_status

    def get_campaign_statistics(
            self,
            campaign_id: int,
            start_date: Optional[datetime] = None,
            end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Get detailed statistics for a specific campaign

        Args:
            campaign_id: ID of the campaign
            start_date: Start date for stats
            end_date: End date for stats

        Returns:
            Dict with campaign statistics
        """
        if not start_date:
            start_date = timezone.now() - timedelta(days=7)
        if not end_date:
            end_date = timezone.now()

        try:
            campaign = Campaign.objects.get(id=campaign_id, user=self.user)
        except Campaign.DoesNotExist:
            logger.warning(f"Campaign {campaign_id} not found for user {self.user.id}")
            return {}

        stats = CampaignStatistic.objects.filter(
            campaign=campaign,
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            avg_cpm=Avg('cpm'),
            avg_cpc=Avg('cpc'),
        )

        spent = float(stats.get('total_spent') or 0)
        revenue = float(stats.get('total_revenue') or 0)
        impressions = int(stats.get('total_impressions') or 0)
        clicks = int(stats.get('total_clicks') or 0)

        return {
            'campaign': {
                'id': campaign.id,
                'name': campaign.name,
                'marketplace': campaign.marketplace,
                'status': campaign.status,
            },
            'stats': {
                'total_spent': round(spent, 2),
                'total_revenue': round(revenue, 2),
                'roi': round(((revenue - spent) / spent * 100) if spent > 0 else 0, 2),
                'total_impressions': impressions,
                'total_clicks': clicks,
                'ctr': round((clicks / impressions * 100) if impressions > 0 else 0, 2),
                'avg_cpm': round(float(stats.get('avg_cpm') or 0), 2),
                'avg_cpc': round(float(stats.get('avg_cpc') or 0), 2),
            },
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            }
        }

    def get_product_statistics(
            self,
            product_id: Optional[int] = None,
            start_date: Optional[datetime] = None,
            end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get product-level statistics

        Args:
            product_id: Optional specific product ID
            start_date: Start date
            end_date: End date

        Returns:
            List of product statistics
        """
        if not start_date:
            start_date = timezone.now() - timedelta(days=7)
        if not end_date:
            end_date = timezone.now()

        queryset = ProductStatistic.objects.filter(
            campaign__user=self.user,
            date__gte=start_date,
            date__lte=end_date
        )

        if product_id:
            queryset = queryset.filter(product_id=product_id)

        # Group by product and aggregate
        products = queryset.values('product_id', 'product_name').annotate(
            total_spent=Sum('spent'),
            total_revenue=Sum('revenue'),
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_orders=Sum('orders'),
        ).order_by('-total_revenue')

        result = []
        for product in products:
            spent = float(product.get('total_spent') or 0)
            revenue = float(product.get('total_revenue') or 0)
            impressions = int(product.get('total_impressions') or 0)
            clicks = int(product.get('total_clicks') or 0)

            result.append({
                'product_id': product['product_id'],
                'product_name': product['product_name'],
                'total_spent': round(spent, 2),
                'total_revenue': round(revenue, 2),
                'roi': round(((revenue - spent) / spent * 100) if spent > 0 else 0, 2),
                'total_impressions': impressions,
                'total_clicks': clicks,
                'total_orders': product.get('total_orders') or 0,
                'ctr': round((clicks / impressions * 100) if impressions > 0 else 0, 2),
            })

        return result

    def get_daily_user_statistics(
            self,
            start_date: Optional[datetime] = None,
            end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get daily aggregated user statistics

        Args:
            start_date: Start date
            end_date: End date

        Returns:
            List of daily stats
        """
        if not start_date:
            start_date = timezone.now() - timedelta(days=30)
        if not end_date:
            end_date = timezone.now()

        daily_stats = DailyUserStatistic.objects.filter(
            user=self.user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')

        result = []
        for stat in daily_stats:
            result.append({
                'date': stat.date.isoformat(),
                'total_spent': float(stat.total_spent or 0),
                'total_revenue': float(stat.total_revenue or 0),
                'total_impressions': stat.total_impressions or 0,
                'total_clicks': stat.total_clicks or 0,
                'total_orders': stat.total_orders or 0,
                'active_campaigns': stat.active_campaigns or 0,
            })

        return result

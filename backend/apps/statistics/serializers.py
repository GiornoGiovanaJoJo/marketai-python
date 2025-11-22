from rest_framework import serializers
from .models import CampaignStatistic, ProductStatistic, DailyUserStatistic


class CampaignStatisticSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed campaign statistics
    """
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    campaign_marketplace = serializers.CharField(source='campaign.marketplace', read_only=True)
    
    class Meta:
        model = CampaignStatistic
        fields = [
            'id',
            'campaign',
            'campaign_name',
            'campaign_marketplace',
            'date',
            'impressions',
            'clicks',
            'ctr',
            'spent',
            'cpc',
            'conversions',
            'conversion_rate',
            'revenue',
            'roi',
            'add_to_cart',
            'cart_rate',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'ctr', 'cpc', 'conversion_rate', 'roi', 'cart_rate']


class CampaignStatisticCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating campaign statistics (minimal fields)
    """
    
    class Meta:
        model = CampaignStatistic
        fields = [
            'campaign',
            'date',
            'impressions',
            'clicks',
            'spent',
            'conversions',
            'revenue',
            'add_to_cart',
        ]


class ProductStatisticSerializer(serializers.ModelSerializer):
    """
    Serializer for product-level statistics
    """
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = ProductStatistic
        fields = [
            'id',
            'campaign',
            'campaign_name',
            'product_id',
            'product_name',
            'date',
            'views',
            'clicks',
            'add_to_cart',
            'add_to_favorites',
            'orders',
            'revenue',
            'ad_spent',
            'conversion_rate',
            'acos',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'conversion_rate', 'acos']


class ProductStatisticCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating product statistics
    """
    
    class Meta:
        model = ProductStatistic
        fields = [
            'campaign',
            'product_id',
            'product_name',
            'date',
            'views',
            'clicks',
            'add_to_cart',
            'add_to_favorites',
            'orders',
            'revenue',
            'ad_spent',
        ]


class DailyUserStatisticSerializer(serializers.ModelSerializer):
    """
    Serializer for daily user statistics
    """
    
    class Meta:
        model = DailyUserStatistic
        fields = [
            'id',
            'date',
            'total_impressions',
            'total_clicks',
            'total_spent',
            'total_revenue',
            'total_conversions',
            'active_campaigns',
            'avg_ctr',
            'avg_roi',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinancialReportSerializer(serializers.Serializer):
    """
    Serializer for financial report response
    """
    summary = serializers.DictField()
    by_marketplace = serializers.ListField()
    by_status = serializers.ListField()
    period = serializers.DictField()


class CampaignPerformanceSerializer(serializers.Serializer):
    """
    Serializer for campaign performance
    """
    campaign_id = serializers.IntegerField()
    name = serializers.CharField()
    metrics = serializers.DictField()
    financial = serializers.DictField()


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    current_period = serializers.DictField()
    growth = serializers.DictField()
    period_days = serializers.IntegerField()


class CampaignChartDataSerializer(serializers.Serializer):
    """
    Serializer for campaign chart data (time series)
    """
    date = serializers.DateField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    conversions = serializers.IntegerField()
    spent = serializers.DecimalField(max_digits=12, decimal_places=2)
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    ctr = serializers.DecimalField(max_digits=5, decimal_places=2)
    roi = serializers.DecimalField(max_digits=10, decimal_places=2)


class TopProductSerializer(serializers.Serializer):
    """
    Serializer for top performing products
    """
    product_id = serializers.CharField()
    product_name = serializers.CharField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_views = serializers.IntegerField()
    avg_conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    avg_acos = serializers.DecimalField(max_digits=5, decimal_places=2)


class StatisticsQuerySerializer(serializers.Serializer):
    """
    Serializer for statistics query parameters
    """
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)
    
    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {'end_date': 'End date must be after start date.'}
            )
        
        return attrs


class CampaignDetailedStatsSerializer(serializers.Serializer):
    """
    Serializer for detailed campaign statistics response
    """
    campaign_info = serializers.DictField()
    total_metrics = serializers.DictField()
    daily_stats = CampaignStatisticSerializer(many=True)
    top_products = TopProductSerializer(many=True)
    chart_data = CampaignChartDataSerializer(many=True)

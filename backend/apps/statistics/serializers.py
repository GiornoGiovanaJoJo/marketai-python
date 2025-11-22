from rest_framework import serializers


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

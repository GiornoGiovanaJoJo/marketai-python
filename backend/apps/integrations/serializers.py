from rest_framework import serializers


class WildberriesSyncRequestSerializer(serializers.Serializer):
    """
    Serializer for Wildberries sync request
    """
    api_key = serializers.CharField(required=False, allow_blank=True)


class WildberriesSyncResponseSerializer(serializers.Serializer):
    """
    Serializer for sync response
    """
    status = serializers.CharField()
    message = serializers.CharField()
    synced = serializers.IntegerField(required=False)


class CampaignStatsSyncSerializer(serializers.Serializer):
    """
    Serializer for campaign statistics sync request
    """
    campaign_id = serializers.IntegerField()
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    api_key = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['date_from'] > attrs['date_to']:
            raise serializers.ValidationError(
                {'date_to': 'End date must be after start date.'}
            )
        return attrs

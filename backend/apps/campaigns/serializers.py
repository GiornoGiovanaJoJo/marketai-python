from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for Campaign model
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    marketplace_display = serializers.CharField(source='get_marketplace_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    ctr = serializers.FloatField(read_only=True)
    conversion_rate = serializers.FloatField(read_only=True)
    roi = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Campaign
        fields = (
            'id',
            'user',
            'user_email',
            'name',
            'description',
            'marketplace',
            'marketplace_display',
            'status',
            'status_display',
            'budget',
            'spent',
            'start_date',
            'end_date',
            'impressions',
            'clicks',
            'conversions',
            'revenue',
            'ctr',
            'conversion_rate',
            'roi',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class CampaignCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating campaigns
    """
    class Meta:
        model = Campaign
        fields = (
            'name',
            'description',
            'marketplace',
            'status',
            'budget',
            'start_date',
            'end_date',
        )
    
    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {'end_date': 'End date must be after start date.'}
            )
        
        return attrs


class CampaignListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for campaign lists
    """
    marketplace_display = serializers.CharField(source='get_marketplace_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Campaign
        fields = (
            'id',
            'name',
            'marketplace',
            'marketplace_display',
            'status',
            'status_display',
            'budget',
            'spent',
            'revenue',
            'created_at',
        )

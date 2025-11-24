from rest_framework import serializers
from .models import Campaign
from .enums import CampaignStatus
import logging

logger = logging.getLogger(__name__)


class CampaignSerializer(serializers.ModelSerializer):
    """
    Main serializer for Campaign with all fields
    Supports both full and partial updates
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    marketplace_display = serializers.CharField(source='get_marketplace_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Campaign
        fields = (
            'id',
            'user',
            'user_email',
            'name',
            'key',
            'marketplace',
            'marketplace_display',
            'status',
            'status_display',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'user_email', 'created_at', 'updated_at')
        extra_kwargs = {
            # Разрешаем частичные обновления — поля необязательны при PUT/PATCH
            'name': {'required': False},
            'key': {'required': False},
            'marketplace': {'required': False},
            'status': {'required': False},
        }

    def validate_status(self, value):
        """
        Allow both integer and string status values
        Convert string to integer if needed
        """
        if isinstance(value, str):
            status_map = {
                'active': CampaignStatus.ACTIVE,
                'inactive': CampaignStatus.INACTIVE,
                'paused': CampaignStatus.PAUSED,
                'stopped': CampaignStatus.STOPPED,
                'draft': CampaignStatus.DRAFT,
                'error': CampaignStatus.ERROR,
            }
            value = status_map.get(value.lower())
            if value is None:
                raise serializers.ValidationError("Invalid status value")
        return value


class CampaignCreateSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for creating new campaigns
    All required fields must be present
    """

    class Meta:
        model = Campaign
        fields = (
            'name',
            'key',
            'marketplace',
        )
        # При создании — все поля обязательны
        extra_kwargs = {
            'name': {'required': True},
            'key': {'required': True},
            'marketplace': {'required': True},
        }


class CampaignUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating campaigns (partial updates allowed)
    """

    class Meta:
        model = Campaign
        fields = (
            'name',
            'key',
            'marketplace',
            'status',
        )
        # При обновлении — все поля необязательны
        extra_kwargs = {
            'name': {'required': False},
            'key': {'required': False},
            'marketplace': {'required': False},
            'status': {'required': False},
        }

    def validate_status(self, value):
        """Support both int and string status"""
        if isinstance(value, str):
            status_map = {
                'active': CampaignStatus.ACTIVE,
                'inactive': CampaignStatus.INACTIVE,
                'paused': CampaignStatus.PAUSED,
                'stopped': CampaignStatus.STOPPED,
                'draft': CampaignStatus.DRAFT,
                'error': CampaignStatus.ERROR,
            }
            value = status_map.get(value.lower())
            if value is None:
                raise serializers.ValidationError("Invalid status value")
        return value


class CampaignListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for list views
    """
    marketplace_display = serializers.CharField(source='get_marketplace_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Campaign
        fields = (
            'id',
            'name',
            'key',
            'marketplace',
            'marketplace_display',
            'status',
            'status_display',
            'created_at',
        )

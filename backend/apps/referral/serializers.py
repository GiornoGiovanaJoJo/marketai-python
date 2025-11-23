"""Referral app serializers."""
from decimal import Decimal
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import (
    ReferralLink,
    Referral,
    ReferralIncome,
    ReferralPayment,
    ReferralSettings,
)


User = get_user_model()


class ReferralLinkSerializer(serializers.ModelSerializer):
    """Serializer for ReferralLink model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    is_active = serializers.SerializerMethodField()
    conversion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralLink
        fields = [
            'id', 'uuid', 'user', 'user_email', 'code', 'status',
            'commission_percent', 'total_clicks', 'total_registrations',
            'total_conversions', 'is_active', 'conversion_rate',
            'expires_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'uuid', 'user', 'total_clicks', 'total_registrations',
            'total_conversions', 'created_at', 'updated_at'
        ]
    
    def get_is_active(self, obj) -> bool:
        """Check if link is currently active."""
        return obj.is_active()
    
    def get_conversion_rate(self, obj) -> float:
        """Calculate conversion rate."""
        if obj.total_clicks == 0:
            return 0.0
        return round((obj.total_conversions / obj.total_clicks) * 100, 2)
    
    def create(self, validated_data):
        """Create referral link with current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)


class ReferralLinkStatsSerializer(serializers.ModelSerializer):
    """Lightweight serializer for referral link statistics."""
    
    conversion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralLink
        fields = [
            'id', 'code', 'total_clicks', 'total_registrations',
            'total_conversions', 'conversion_rate'
        ]
    
    def get_conversion_rate(self, obj) -> float:
        if obj.total_clicks == 0:
            return 0.0
        return round((obj.total_conversions / obj.total_clicks) * 100, 2)


class ReferralSerializer(serializers.ModelSerializer):
    """Serializer for Referral model."""
    
    referrer_email = serializers.EmailField(source='referrer.email', read_only=True)
    referred_email = serializers.EmailField(source='referred.email', read_only=True)
    referral_code = serializers.CharField(source='referral_link.code', read_only=True)
    
    class Meta:
        model = Referral
        fields = [
            'id', 'referrer', 'referrer_email', 'referred', 'referred_email',
            'referral_link', 'referral_code', 'status', 'level',
            'registered_at', 'activated_at', 'completed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'registered_at', 'activated_at', 'completed_at',
            'created_at', 'updated_at'
        ]
    
    def validate(self, data):
        """Validate referral creation."""
        referrer = data.get('referrer')
        referred = data.get('referred')
        
        # Cannot refer yourself
        if referrer == referred:
            raise serializers.ValidationError("You cannot refer yourself.")
        
        # Check for existing referral
        if Referral.objects.filter(referrer=referrer, referred=referred).exists():
            raise serializers.ValidationError("This referral already exists.")
        
        return data


class ReferralNetworkSerializer(serializers.Serializer):
    """Serializer for referral network tree structure."""
    
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    level = serializers.IntegerField()
    status = serializers.CharField()
    total_referred = serializers.IntegerField()
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    registered_at = serializers.DateTimeField()
    children = serializers.ListField(child=serializers.DictField(), required=False)


class ReferralIncomeSerializer(serializers.ModelSerializer):
    """Serializer for ReferralIncome model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    referral_info = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralIncome
        fields = [
            'id', 'user', 'user_email', 'referral', 'referral_info',
            'income_type', 'status', 'amount', 'currency',
            'commission_percent', 'transaction_id', 'description',
            'earned_at', 'approved_at', 'paid_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'earned_at', 'approved_at', 'paid_at',
            'created_at', 'updated_at'
        ]
    
    def get_referral_info(self, obj) -> dict:
        """Get referral information."""
        if obj.referral:
            return {
                'id': obj.referral.id,
                'referred_email': obj.referral.referred.email,
                'level': obj.referral.level
            }
        return None


class ReferralIncomeStatsSerializer(serializers.Serializer):
    """Serializer for income statistics."""
    
    total_earned = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_pending = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_approved = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_paid = serializers.DecimalField(max_digits=12, decimal_places=2)
    available_for_withdrawal = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField()


class ReferralPaymentSerializer(serializers.ModelSerializer):
    """Serializer for ReferralPayment model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    income_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ReferralIncome.objects.all(),
        source='incomes',
        required=False
    )
    
    class Meta:
        model = ReferralPayment
        fields = [
            'id', 'user', 'user_email', 'status', 'payment_method',
            'amount', 'currency', 'fee', 'net_amount',
            'recipient_details', 'transaction_id', 'notes',
            'income_ids', 'requested_at', 'processed_at', 'completed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'net_amount', 'requested_at', 'processed_at',
            'completed_at', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        """Create payment with current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        
        # Calculate net amount
        amount = validated_data.get('amount', Decimal('0'))
        fee = validated_data.get('fee', Decimal('0'))
        validated_data['net_amount'] = amount - fee
        
        return super().create(validated_data)
    
    def validate_amount(self, value):
        """Validate withdrawal amount."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Check minimum withdrawal amount
            try:
                settings = ReferralSettings.objects.get(user=request.user)
                if value < settings.min_withdrawal_amount:
                    raise serializers.ValidationError(
                        f"Minimum withdrawal amount is {settings.min_withdrawal_amount}"
                    )
            except ReferralSettings.DoesNotExist:
                pass
        
        return value


class ReferralPaymentRequestSerializer(serializers.Serializer):
    """Serializer for payment withdrawal request."""
    
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal('0.01')
    )
    payment_method = serializers.ChoiceField(choices=ReferralPayment.PaymentMethod.choices)
    recipient_details = serializers.JSONField()
    notes = serializers.CharField(required=False, allow_blank=True)


class ReferralSettingsSerializer(serializers.ModelSerializer):
    """Serializer for ReferralSettings model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ReferralSettings
        fields = [
            'id', 'user', 'user_email', 'default_commission_percent',
            'max_referral_levels', 'min_withdrawal_amount',
            'auto_approve_payments', 'notify_new_referral',
            'notify_income', 'notify_payment',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Create settings with current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)


class ReferralOverviewSerializer(serializers.Serializer):
    """Serializer for referral program overview/dashboard."""
    
    total_referrals = serializers.IntegerField()
    active_referrals = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    total_registrations = serializers.IntegerField()
    total_conversions = serializers.IntegerField()
    
    total_earned = serializers.DecimalField(max_digits=12, decimal_places=2)
    pending_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    paid_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    available_for_withdrawal = serializers.DecimalField(max_digits=12, decimal_places=2)
    
    conversion_rate = serializers.FloatField()
    referral_code = serializers.CharField()
    commission_percent = serializers.DecimalField(max_digits=5, decimal_places=2)

"""Referral app Django admin configuration."""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.db.models import Sum

from .models import (
    ReferralLink,
    Referral,
    ReferralIncome,
    ReferralPayment,
    ReferralSettings,
)


@admin.register(ReferralLink)
class ReferralLinkAdmin(admin.ModelAdmin):
    """Admin configuration for ReferralLink model."""
    
    list_display = [
        'code', 'user_email', 'status', 'commission_percent',
        'total_clicks', 'total_registrations', 'total_conversions',
        'conversion_rate', 'created_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['code', 'user__email']
    readonly_fields = [
        'uuid', 'total_clicks', 'total_registrations',
        'total_conversions', 'created_at', 'updated_at'
    ]
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('uuid', 'user', 'code', 'status')
        }),
        (_('Commission Settings'), {
            'fields': ('commission_percent',)
        }),
        (_('Statistics'), {
            'fields': (
                'total_clicks', 'total_registrations',
                'total_conversions'
            ),
            'classes': ('collapse',)
        }),
        (_('Dates'), {
            'fields': ('expires_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User Email')
    user_email.admin_order_field = 'user__email'
    
    def conversion_rate(self, obj):
        if obj.total_clicks == 0:
            return "0%"
        rate = (obj.total_conversions / obj.total_clicks) * 100
        return f"{rate:.2f}%"
    conversion_rate.short_description = _('Conversion Rate')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    """Admin configuration for Referral model."""
    
    list_display = [
        'referrer_email', 'referred_email', 'referral_code',
        'status', 'level', 'registered_at'
    ]
    list_filter = ['status', 'level', 'registered_at']
    search_fields = [
        'referrer__email', 'referred__email',
        'referral_link__code'
    ]
    readonly_fields = [
        'registered_at', 'activated_at', 'completed_at',
        'created_at', 'updated_at'
    ]
    
    fieldsets = (
        (_('Referral Relationship'), {
            'fields': ('referrer', 'referred', 'referral_link', 'level')
        }),
        (_('Status'), {
            'fields': ('status',)
        }),
        (_('Dates'), {
            'fields': (
                'registered_at', 'activated_at', 'completed_at',
                'created_at', 'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def referrer_email(self, obj):
        return obj.referrer.email
    referrer_email.short_description = _('Referrer')
    referrer_email.admin_order_field = 'referrer__email'
    
    def referred_email(self, obj):
        return obj.referred.email
    referred_email.short_description = _('Referred')
    referred_email.admin_order_field = 'referred__email'
    
    def referral_code(self, obj):
        return obj.referral_link.code if obj.referral_link else '-'
    referral_code.short_description = _('Referral Code')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('referrer', 'referred', 'referral_link')


@admin.register(ReferralIncome)
class ReferralIncomeAdmin(admin.ModelAdmin):
    """Admin configuration for ReferralIncome model."""
    
    list_display = [
        'user_email', 'amount', 'currency', 'income_type',
        'status', 'earned_at'
    ]
    list_filter = ['income_type', 'status', 'earned_at']
    search_fields = ['user__email', 'transaction_id', 'description']
    readonly_fields = ['earned_at', 'approved_at', 'paid_at', 'created_at', 'updated_at']
    
    fieldsets = (
        (_('User & Referral'), {
            'fields': ('user', 'referral')
        }),
        (_('Income Details'), {
            'fields': (
                'income_type', 'status', 'amount', 'currency',
                'commission_percent', 'transaction_id', 'description'
            )
        }),
        (_('Dates'), {
            'fields': ('earned_at', 'approved_at', 'paid_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_income', 'mark_as_paid']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User')
    user_email.admin_order_field = 'user__email'
    
    def approve_income(self, request, queryset):
        updated = queryset.update(status=ReferralIncome.Status.APPROVED)
        self.message_user(request, f"{updated} income(s) approved.")
    approve_income.short_description = _('Approve selected incomes')
    
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status=ReferralIncome.Status.PAID)
        self.message_user(request, f"{updated} income(s) marked as paid.")
    mark_as_paid.short_description = _('Mark selected incomes as paid')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'referral')


@admin.register(ReferralPayment)
class ReferralPaymentAdmin(admin.ModelAdmin):
    """Admin configuration for ReferralPayment model."""
    
    list_display = [
        'user_email', 'amount', 'net_amount', 'currency',
        'payment_method', 'status', 'requested_at'
    ]
    list_filter = ['status', 'payment_method', 'requested_at']
    search_fields = ['user__email', 'transaction_id']
    readonly_fields = [
        'requested_at', 'processed_at', 'completed_at',
        'created_at', 'updated_at'
    ]
    
    fieldsets = (
        (_('User & Amount'), {
            'fields': ('user', 'amount', 'fee', 'net_amount', 'currency')
        }),
        (_('Payment Details'), {
            'fields': (
                'status', 'payment_method', 'recipient_details',
                'transaction_id', 'notes'
            )
        }),
        (_('Dates'), {
            'fields': (
                'requested_at', 'processed_at', 'completed_at',
                'created_at', 'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['process_payments', 'complete_payments']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User')
    user_email.admin_order_field = 'user__email'
    
    def process_payments(self, request, queryset):
        updated = queryset.update(status=ReferralPayment.Status.PROCESSING)
        self.message_user(request, f"{updated} payment(s) set to processing.")
    process_payments.short_description = _('Process selected payments')
    
    def complete_payments(self, request, queryset):
        updated = queryset.update(status=ReferralPayment.Status.COMPLETED)
        self.message_user(request, f"{updated} payment(s) completed.")
    complete_payments.short_description = _('Complete selected payments')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')


@admin.register(ReferralSettings)
class ReferralSettingsAdmin(admin.ModelAdmin):
    """Admin configuration for ReferralSettings model."""
    
    list_display = [
        'user_email', 'default_commission_percent',
        'max_referral_levels', 'min_withdrawal_amount',
        'auto_approve_payments'
    ]
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('User'), {
            'fields': ('user',)
        }),
        (_('Commission Settings'), {
            'fields': ('default_commission_percent', 'max_referral_levels')
        }),
        (_('Payment Settings'), {
            'fields': ('min_withdrawal_amount', 'auto_approve_payments')
        }),
        (_('Notification Settings'), {
            'fields': (
                'notify_new_referral', 'notify_income', 'notify_payment'
            )
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _('User')
    user_email.admin_order_field = 'user__email'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')

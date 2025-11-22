from django.contrib import admin
from .models import CampaignStatistic, ProductStatistic, DailyUserStatistic


@admin.register(CampaignStatistic)
class CampaignStatisticAdmin(admin.ModelAdmin):
    """
    Admin for Campaign Statistics
    """
    list_display = [
        'campaign',
        'date',
        'impressions',
        'clicks',
        'ctr',
        'conversions',
        'spent',
        'revenue',
        'roi',
    ]
    list_filter = [
        'date',
        'campaign__marketplace',
        'campaign__status',
    ]
    search_fields = [
        'campaign__name',
        'campaign__user__email',
    ]
    readonly_fields = [
        'ctr',
        'cpc',
        'conversion_rate',
        'roi',
        'cart_rate',
        'created_at',
        'updated_at',
    ]
    date_hierarchy = 'date'
    ordering = ['-date', '-revenue']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('campaign', 'date')
        }),
        ('Traffic Metrics', {
            'fields': ('impressions', 'clicks', 'ctr')
        }),
        ('Financial Metrics', {
            'fields': ('spent', 'cpc', 'revenue', 'roi')
        }),
        ('Conversion Metrics', {
            'fields': ('conversions', 'conversion_rate', 'add_to_cart', 'cart_rate')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductStatistic)
class ProductStatisticAdmin(admin.ModelAdmin):
    """
    Admin for Product Statistics
    """
    list_display = [
        'product_name',
        'product_id',
        'campaign',
        'date',
        'views',
        'clicks',
        'orders',
        'revenue',
        'conversion_rate',
    ]
    list_filter = [
        'date',
        'campaign',
    ]
    search_fields = [
        'product_id',
        'product_name',
        'campaign__name',
    ]
    readonly_fields = [
        'conversion_rate',
        'acos',
        'created_at',
        'updated_at',
    ]
    date_hierarchy = 'date'
    ordering = ['-date', '-revenue']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('campaign', 'product_id', 'product_name', 'date')
        }),
        ('Traffic Metrics', {
            'fields': ('views', 'clicks')
        }),
        ('Engagement Metrics', {
            'fields': ('add_to_cart', 'add_to_favorites')
        }),
        ('Sales Metrics', {
            'fields': ('orders', 'revenue', 'conversion_rate')
        }),
        ('Cost Metrics', {
            'fields': ('ad_spent', 'acos')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DailyUserStatistic)
class DailyUserStatisticAdmin(admin.ModelAdmin):
    """
    Admin for Daily User Statistics
    """
    list_display = [
        'user',
        'date',
        'total_revenue',
        'total_spent',
        'total_conversions',
        'active_campaigns',
        'avg_ctr',
        'avg_roi',
    ]
    list_filter = [
        'date',
        'user',
    ]
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
    ]
    date_hierarchy = 'date'
    ordering = ['-date', '-total_revenue']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'date')
        }),
        ('Aggregated Metrics', {
            'fields': (
                'total_impressions',
                'total_clicks',
                'total_spent',
                'total_revenue',
                'total_conversions',
                'active_campaigns',
            )
        }),
        ('Average Metrics', {
            'fields': ('avg_ctr', 'avg_roi')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

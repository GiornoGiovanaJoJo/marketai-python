from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'user',
        'marketplace',
        'status',
        'budget',
        'spent',
        'revenue',
        'created_at',
    )
    list_filter = ('marketplace', 'status', 'created_at')
    search_fields = ('name', 'description', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'ctr', 'conversion_rate', 'roi')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'description', 'marketplace', 'status')
        }),
        ('Budget & Dates', {
            'fields': ('budget', 'spent', 'start_date', 'end_date')
        }),
        ('Metrics', {
            'fields': ('impressions', 'clicks', 'conversions', 'revenue')
        }),
        ('Calculated Metrics', {
            'fields': ('ctr', 'conversion_rate', 'roi'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'user',
        'marketplace',
        'status',
    )
    list_filter = ('marketplace', 'status')
    search_fields = ('name', 'user__phone', 'user__email', 'user__first_name')
    readonly_fields = ('id',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'name', 'key', 'marketplace', 'status')
        }),
    )

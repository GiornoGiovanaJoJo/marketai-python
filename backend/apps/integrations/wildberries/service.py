from .client import WildberriesAPIClient
from apps.campaigns.models import Campaign
import logging

logger = logging.getLogger(__name__)


class WildberriesService:
    """
    Service for Wildberries integration
    Handles data synchronization between MarketAI and Wildberries
    """
    
    def __init__(self, user, api_key=None):
        self.user = user
        self.client = WildberriesAPIClient(api_key)
    
    def sync_campaigns(self):
        """
        Synchronize campaigns from Wildberries to local database
        """
        try:
            # Get campaigns from Wildberries
            wb_campaigns = self.client.get_campaigns()
            
            synced_count = 0
            
            for wb_campaign in wb_campaigns:
                # Update or create local campaign
                campaign, created = Campaign.objects.update_or_create(
                    user=self.user,
                    name=wb_campaign.get('name'),
                    marketplace=Campaign.MarketplaceChoices.WILDBERRIES,
                    defaults={
                        'status': self._map_wb_status(wb_campaign.get('status')),
                        'budget': wb_campaign.get('budget', 0),
                        'spent': wb_campaign.get('spent', 0),
                    }
                )
                
                synced_count += 1
                action = 'created' if created else 'updated'
                logger.info(f'Campaign {campaign.name} {action}')
            
            return {
                'status': 'success',
                'synced': synced_count,
                'message': f'Successfully synced {synced_count} campaigns'
            }
            
        except Exception as e:
            logger.error(f'Error syncing Wildberries campaigns: {str(e)}')
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def sync_campaign_statistics(self, campaign_id, date_from, date_to):
        """
        Sync statistics for specific campaign
        """
        try:
            campaign = Campaign.objects.get(
                id=campaign_id,
                user=self.user,
                marketplace=Campaign.MarketplaceChoices.WILDBERRIES
            )
            
            # Get statistics from Wildberries
            stats = self.client.get_campaign_statistics(
                campaign_id=campaign_id,
                date_from=date_from,
                date_to=date_to
            )
            
            # Update campaign metrics
            campaign.impressions = stats.get('views', 0)
            campaign.clicks = stats.get('clicks', 0)
            campaign.conversions = stats.get('orders', 0)
            campaign.revenue = stats.get('sum', 0)
            campaign.spent = stats.get('spent', 0)
            campaign.save()
            
            logger.info(f'Updated statistics for campaign {campaign.name}')
            
            return {
                'status': 'success',
                'campaign_id': campaign_id,
                'message': 'Statistics updated successfully'
            }
            
        except Campaign.DoesNotExist:
            return {
                'status': 'error',
                'message': 'Campaign not found'
            }
        except Exception as e:
            logger.error(f'Error syncing campaign statistics: {str(e)}')
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def _map_wb_status(self, wb_status):
        """
        Map Wildberries status to local status
        """
        status_map = {
            'active': CampaignStatus.ACTIVE,
            'paused': CampaignStatus.PAUSED,
            'stopped': CampaignStatus.COMPLETED,
            'archived': CampaignStatus.ARCHIVED,
        }
        return status_map.get(wb_status, CampaignStatus.DRAFT)

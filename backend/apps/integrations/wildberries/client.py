import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class WildberriesAPIClient:
    """
    Wildberries API Client
    Migrated from Laravel App\Services\Wildberries
    """
    
    def __init__(self, api_key=None):
        self.api_key = api_key or settings.WILDBERRIES_API_KEY
        self.base_url = settings.WILDBERRIES_API_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': self.api_key,
            'Content-Type': 'application/json',
        })
    
    def _make_request(self, method, endpoint, **kwargs):
        """
        Make HTTP request to Wildberries API
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            logger.error(f'Wildberries API HTTP error: {e}')
            raise
        except requests.exceptions.RequestException as e:
            logger.error(f'Wildberries API request error: {e}')
            raise
        except ValueError as e:
            logger.error(f'Wildberries API JSON parse error: {e}')
            raise
    
    def get_campaigns(self):
        """
        Get list of advertising campaigns from Wildberries
        """
        return self._make_request('GET', '/api/v2/adv/list')
    
    def get_campaign_statistics(self, campaign_id, date_from, date_to):
        """
        Get campaign statistics
        """
        params = {
            'id': campaign_id,
            'dateFrom': date_from,
            'dateTo': date_to,
        }
        return self._make_request('GET', '/api/v2/adv/stat', params=params)
    
    def create_campaign(self, campaign_data):
        """
        Create new advertising campaign
        """
        return self._make_request('POST', '/api/v2/adv/create', json=campaign_data)
    
    def update_campaign(self, campaign_id, campaign_data):
        """
        Update existing campaign
        """
        return self._make_request(
            'POST',
            f'/api/v2/adv/{campaign_id}/update',
            json=campaign_data
        )
    
    def pause_campaign(self, campaign_id):
        """
        Pause campaign
        """
        return self._make_request('POST', f'/api/v2/adv/{campaign_id}/pause')
    
    def resume_campaign(self, campaign_id):
        """
        Resume paused campaign
        """
        return self._make_request('POST', f'/api/v2/adv/{campaign_id}/resume')
    
    def get_products(self):
        """
        Get seller's products
        """
        return self._make_request('GET', '/api/v2/products')
    
    def get_product_statistics(self, nm_id, date_from, date_to):
        """
        Get product statistics
        """
        params = {
            'nmId': nm_id,
            'dateFrom': date_from,
            'dateTo': date_to,
        }
        return self._make_request('GET', '/api/v2/product/stat', params=params)

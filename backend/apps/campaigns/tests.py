from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from .models import Campaign

User = get_user_model()


class CampaignModelTests(TestCase):
    """Test Campaign model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.campaign = Campaign.objects.create(
            user=self.user,
            name='Test Campaign',
            marketplace=Campaign.MarketplaceChoices.WILDBERRIES,
            status=CampaignStatus.ACTIVE,
            budget=Decimal('10000.00'),
            spent=Decimal('5000.00'),
            impressions=10000,
            clicks=500,
            conversions=50,
            revenue=Decimal('15000.00')
        )
    
    def test_create_campaign(self):
        """Test creating a campaign"""
        self.assertEqual(self.campaign.name, 'Test Campaign')
        self.assertEqual(self.campaign.user, self.user)
    
    def test_ctr_calculation(self):
        """Test CTR calculation"""
        expected_ctr = (500 / 10000) * 100
        self.assertEqual(self.campaign.ctr, expected_ctr)
    
    def test_conversion_rate_calculation(self):
        """Test conversion rate calculation"""
        expected_rate = (50 / 500) * 100
        self.assertEqual(self.campaign.conversion_rate, expected_rate)
    
    def test_roi_calculation(self):
        """Test ROI calculation"""
        expected_roi = ((15000 - 5000) / 5000) * 100
        self.assertEqual(self.campaign.roi, expected_roi)


class CampaignAPITests(TestCase):
    """Test Campaign API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_campaign(self):
        """Test creating a campaign via API"""
        data = {
            'name': 'API Test Campaign',
            'marketplace': 'wildberries',
            'status': 'draft',
            'budget': '10000.00'
        }
        response = self.client.post('/api/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
    
    def test_list_user_campaigns(self):
        """Test listing user's campaigns"""
        Campaign.objects.create(
            user=self.user,
            name='Test Campaign',
            marketplace=Campaign.MarketplaceChoices.WILDBERRIES
        )
        response = self.client.get('/api/campaigns/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

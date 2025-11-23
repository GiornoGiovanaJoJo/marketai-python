"""Test organizations serializers."""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory

from apps.organizations.models import Organization, Employee
from apps.organizations.serializers import (
    OrganizationSerializer,
    EmployeeSerializer
)


User = get_user_model()


class OrganizationSerializerTest(TestCase):
    """Test OrganizationSerializer."""
    
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123'
        )
        self.org = Organization.objects.create(
            name='Test Org',
            owner=self.user,
            description='Test description'
        )
    
    def test_serialize_organization(self):
        """Test serializing an organization."""
        serializer = OrganizationSerializer(instance=self.org)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Test Org')
        self.assertEqual(data['owner_email'], 'owner@test.com')
        self.assertIn('created_at', data)

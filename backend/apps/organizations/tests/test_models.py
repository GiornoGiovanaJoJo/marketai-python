"""Test organizations models."""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from apps.organizations.models import (
    Organization,
    Employee,
    Partner,
    AccessPermission
)


User = get_user_model()


class OrganizationModelTest(TestCase):
    """Test Organization model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123'
        )
    
    def test_create_organization(self):
        """Test creating an organization."""
        org = Organization.objects.create(
            name='Test Org',
            owner=self.user,
            description='Test description'
        )
        
        self.assertEqual(org.name, 'Test Org')
        self.assertEqual(org.owner, self.user)
        self.assertEqual(org.status, Organization.Status.ACTIVE)
    
    def test_organization_str(self):
        """Test organization string representation."""
        org = Organization.objects.create(
            name='Test Org',
            owner=self.user
        )
        self.assertEqual(str(org), 'Test Org')


class EmployeeModelTest(TestCase):
    """Test Employee model."""
    
    def setUp(self):
        self.owner = User.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123'
        )
        self.user = User.objects.create_user(
            email='employee@test.com',
            username='employee',
            password='testpass123'
        )
        self.org = Organization.objects.create(
            name='Test Org',
            owner=self.owner
        )
    
    def test_create_employee(self):
        """Test creating an employee."""
        employee = Employee.objects.create(
            organization=self.org,
            user=self.user,
            role=Employee.Role.MANAGER,
            position='Manager'
        )
        
        self.assertEqual(employee.organization, self.org)
        self.assertEqual(employee.user, self.user)
        self.assertEqual(employee.role, Employee.Role.MANAGER)
        self.assertEqual(employee.status, Employee.Status.ACTIVE)
    
    def test_unique_together_constraint(self):
        """Test unique together constraint for organization and user."""
        Employee.objects.create(
            organization=self.org,
            user=self.user,
            role=Employee.Role.VIEWER
        )
        
        # Creating duplicate should raise error
        with self.assertRaises(Exception):
            Employee.objects.create(
                organization=self.org,
                user=self.user,
                role=Employee.Role.MANAGER
            )

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.campaigns.models import Campaign
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Create test data for development'

    def handle(self, *args, **options):
        self.stdout.write('Creating test data...')
        
        # Create test users
        users = []
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                email=f'user{i}@example.com',
                username=f'user{i}',
                defaults={
                    'first_name': f'Test',
                    'last_name': f'User{i}',
                    'company': f'Company {i}',
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))
            users.append(user)
        
        # Create test campaigns
        marketplaces = [choice[0] for choice in Campaign.MarketplaceChoices.choices]
        statuses = [choice[0] for choice in CampaignStatus.choices]
        
        for user in users:
            for i in range(5):
                campaign, created = Campaign.objects.get_or_create(
                    user=user,
                    name=f'{user.username} Campaign {i+1}',
                    defaults={
                        'description': f'Test campaign {i+1} for {user.username}',
                        'marketplace': random.choice(marketplaces),
                        'status': random.choice(statuses),
                        'budget': Decimal(random.randint(10000, 100000)),
                        'spent': Decimal(random.randint(1000, 50000)),
                        'impressions': random.randint(1000, 100000),
                        'clicks': random.randint(100, 10000),
                        'conversions': random.randint(10, 1000),
                        'revenue': Decimal(random.randint(5000, 150000)),
                    }
                )
                if created:
                    self.stdout.write(f'Created campaign: {campaign.name}')
        
        self.stdout.write(self.style.SUCCESS('Test data created successfully!'))

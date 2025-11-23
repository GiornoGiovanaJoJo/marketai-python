"""Referral app business logic services."""
import secrets
import string
from typing import List, Dict, Optional
from decimal import Decimal
from django.db import transaction
from django.contrib.auth import get_user_model
from django.db.models import Sum

from .models import (
    ReferralLink,
    Referral,
    ReferralIncome,
    ReferralPayment,
    ReferralSettings,
)


User = get_user_model()


class ReferralService:
    """Service for referral-related business logic."""
    
    @staticmethod
    def generate_unique_code(length: int = 8) -> str:
        """Generate unique referral code."""
        characters = string.ascii_uppercase + string.digits
        
        while True:
            code = ''.join(secrets.choice(characters) for _ in range(length))
            if not ReferralLink.objects.filter(code=code).exists():
                return code
    
    @staticmethod
    @transaction.atomic
    def create_referral_link(
        user: User,
        commission_percent: Optional[Decimal] = None,
        **kwargs
    ) -> ReferralLink:
        """Create a new referral link for user."""
        # Get or create user settings
        settings, _ = ReferralSettings.objects.get_or_create(user=user)
        
        # Use default commission if not specified
        if commission_percent is None:
            commission_percent = settings.default_commission_percent
        
        # Generate unique code
        code = ReferralService.generate_unique_code()
        
        # Create link
        link = ReferralLink.objects.create(
            user=user,
            code=code,
            commission_percent=commission_percent,
            **kwargs
        )
        
        return link
    
    @staticmethod
    @transaction.atomic
    def register_referral(
        referral_link: ReferralLink,
        referred_user: User,
        level: int = 1
    ) -> Referral:
        """Register a new referral from a link."""
        # Create referral
        referral = Referral.objects.create(
            referrer=referral_link.user,
            referred=referred_user,
            referral_link=referral_link,
            level=level,
            status=Referral.Status.PENDING
        )
        
        # Update link statistics
        referral_link.increment_registrations()
        
        return referral
    
    @staticmethod
    def get_referral_by_code(code: str) -> Optional[ReferralLink]:
        """Get active referral link by code."""
        try:
            link = ReferralLink.objects.get(code=code)
            if link.is_active():
                return link
        except ReferralLink.DoesNotExist:
            pass
        
        return None


class ReferralIncomeService:
    """Service for referral income management."""
    
    @staticmethod
    @transaction.atomic
    def create_income(
        user: User,
        amount: Decimal,
        referral: Optional[Referral] = None,
        income_type: str = ReferralIncome.IncomeType.COMMISSION,
        **kwargs
    ) -> ReferralIncome:
        """Create referral income."""
        income = ReferralIncome.objects.create(
            user=user,
            referral=referral,
            amount=amount,
            income_type=income_type,
            **kwargs
        )
        
        return income
    
    @staticmethod
    def get_total_earned(user: User) -> Decimal:
        """Get total earned amount for user."""
        total = ReferralIncome.objects.filter(
            user=user
        ).aggregate(total=Sum('amount'))['total']
        
        return total or Decimal('0')
    
    @staticmethod
    def get_available_balance(user: User) -> Decimal:
        """Get available balance for withdrawal."""
        approved = ReferralIncome.objects.filter(
            user=user,
            status=ReferralIncome.Status.APPROVED
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        return approved
    
    @staticmethod
    def get_pending_income(user: User) -> Decimal:
        """Get pending income amount."""
        pending = ReferralIncome.objects.filter(
            user=user,
            status=ReferralIncome.Status.PENDING
        ).aggregate(total=Sum('amount'))['total']
        
        return pending or Decimal('0')
    
    @staticmethod
    def get_paid_income(user: User) -> Decimal:
        """Get total paid income."""
        paid = ReferralIncome.objects.filter(
            user=user,
            status=ReferralIncome.Status.PAID
        ).aggregate(total=Sum('amount'))['total']
        
        return paid or Decimal('0')


class ReferralNetworkService:
    """Service for referral network operations."""
    
    @staticmethod
    def get_direct_referrals(user: User) -> List[Referral]:
        """Get direct referrals (level 1) for user."""
        return list(Referral.objects.filter(
            referrer=user,
            level=1
        ).select_related('referred'))
    
    @staticmethod
    def get_all_referrals(user: User, max_level: Optional[int] = None) -> List[Referral]:
        """Get all referrals up to max level."""
        queryset = Referral.objects.filter(referrer=user)
        
        if max_level:
            queryset = queryset.filter(level__lte=max_level)
        
        return list(queryset.select_related('referred'))
    
    @staticmethod
    def build_network_tree(user: User) -> Dict:
        """Build referral network tree structure."""
        def build_tree_recursive(current_user: User, level: int = 1) -> Dict:
            """Recursively build tree for user."""
            # Get direct referrals
            referrals = Referral.objects.filter(
                referrer=current_user,
                level=level
            ).select_related('referred')
            
            # Get income for this user
            total_income = ReferralIncomeService.get_total_earned(current_user)
            
            node = {
                'user_id': current_user.id,
                'email': current_user.email,
                'level': level,
                'status': 'active',
                'total_referred': referrals.count(),
                'total_income': total_income,
                'registered_at': current_user.date_joined,
                'children': []
            }
            
            # Build children nodes
            for referral in referrals:
                child_node = build_tree_recursive(referral.referred, level + 1)
                node['children'].append(child_node)
            
            return node
        
        return build_tree_recursive(user)
    
    @staticmethod
    def get_network_stats(user: User) -> Dict:
        """Get network statistics for user."""
        referrals = Referral.objects.filter(referrer=user)
        
        stats = {
            'total_referrals': referrals.count(),
            'by_level': {},
            'by_status': {},
            'total_income': ReferralIncomeService.get_total_earned(user)
        }
        
        # Count by level
        for level in range(1, 11):
            count = referrals.filter(level=level).count()
            if count > 0:
                stats['by_level'][f'level_{level}'] = count
        
        # Count by status
        for ref_status in Referral.Status:
            count = referrals.filter(status=ref_status).count()
            if count > 0:
                stats['by_status'][ref_status.value] = count
        
        return stats


class ReferralPaymentService:
    """Service for payment processing."""
    
    @staticmethod
    @transaction.atomic
    def request_payment(
        user: User,
        amount: Decimal,
        payment_method: str,
        recipient_details: dict,
        **kwargs
    ) -> ReferralPayment:
        """Request a payment withdrawal."""
        # Check available balance
        available = ReferralIncomeService.get_available_balance(user)
        
        if amount > available:
            raise ValueError(f"Insufficient balance. Available: {available}")
        
        # Check minimum withdrawal amount
        try:
            settings = ReferralSettings.objects.get(user=user)
            if amount < settings.min_withdrawal_amount:
                raise ValueError(
                    f"Amount below minimum withdrawal: {settings.min_withdrawal_amount}"
                )
        except ReferralSettings.DoesNotExist:
            pass
        
        # Calculate fee (TODO: implement fee calculation logic)
        fee = Decimal('0')
        
        # Create payment
        payment = ReferralPayment.objects.create(
            user=user,
            amount=amount,
            payment_method=payment_method,
            recipient_details=recipient_details,
            fee=fee,
            net_amount=amount - fee,
            **kwargs
        )
        
        # Link approved incomes to payment
        approved_incomes = ReferralIncome.objects.filter(
            user=user,
            status=ReferralIncome.Status.APPROVED
        )
        
        payment.incomes.add(*approved_incomes)
        
        return payment
    
    @staticmethod
    def get_payment_history(user: User) -> List[ReferralPayment]:
        """Get payment history for user."""
        return list(ReferralPayment.objects.filter(
            user=user
        ).order_by('-requested_at'))
    
    @staticmethod
    def get_total_withdrawn(user: User) -> Decimal:
        """Get total withdrawn amount."""
        total = ReferralPayment.objects.filter(
            user=user,
            status=ReferralPayment.Status.COMPLETED
        ).aggregate(total=Sum('amount'))['total']
        
        return total or Decimal('0')

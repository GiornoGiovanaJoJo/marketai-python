"""Referral app views."""
from decimal import Decimal
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Sum, Count
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import (
    ReferralLink,
    Referral,
    ReferralIncome,
    ReferralPayment,
    ReferralSettings,
)
from .serializers import (
    ReferralLinkSerializer,
    ReferralLinkStatsSerializer,
    ReferralSerializer,
    ReferralNetworkSerializer,
    ReferralIncomeSerializer,
    ReferralIncomeStatsSerializer,
    ReferralPaymentSerializer,
    ReferralPaymentRequestSerializer,
    ReferralSettingsSerializer,
    ReferralOverviewSerializer,
)
from .services import ReferralService, ReferralIncomeService, ReferralNetworkService


class ReferralLinkViewSet(viewsets.ModelViewSet):
    """ViewSet for ReferralLink CRUD operations."""
    
    serializer_class = ReferralLinkSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['code']
    ordering_fields = ['created_at', 'total_clicks', 'total_conversions']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Get referral links for current user."""
        return ReferralLink.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get aggregated statistics for all user's referral links."""
        links = self.get_queryset()
        
        stats = links.aggregate(
            total_links=Count('id'),
            total_clicks=Sum('total_clicks'),
            total_registrations=Sum('total_registrations'),
            total_conversions=Sum('total_conversions')
        )
        
        # Calculate conversion rate
        total_clicks = stats.get('total_clicks', 0) or 0
        total_conversions = stats.get('total_conversions', 0) or 0
        
        stats['conversion_rate'] = (
            round((total_conversions / total_clicks) * 100, 2)
            if total_clicks > 0 else 0.0
        )
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def track_click(self, request, pk=None):
        """Track a click on referral link."""
        link = self.get_object()
        
        if not link.is_active():
            return Response(
                {"error": "Referral link is not active"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        link.increment_clicks()
        
        return Response(
            {"message": "Click tracked", "total_clicks": link.total_clicks},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate referral link."""
        link = self.get_object()
        link.status = ReferralLink.Status.INACTIVE
        link.save()
        
        return Response(
            ReferralLinkSerializer(link).data,
            status=status.HTTP_200_OK
        )


class ReferralViewSet(viewsets.ModelViewSet):
    """ViewSet for Referral CRUD operations."""
    
    serializer_class = ReferralSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'level']
    search_fields = ['referred__email', 'referred__first_name', 'referred__last_name']
    ordering_fields = ['registered_at', 'level']
    ordering = ['-registered_at']
    
    def get_queryset(self):
        """Get referrals where user is referrer."""
        return Referral.objects.filter(
            referrer=self.request.user
        ).select_related('referrer', 'referred', 'referral_link')
    
    @action(detail=False, methods=['get'])
    def network(self, request):
        """Get referral network tree structure."""
        network = ReferralNetworkService.build_network_tree(request.user)
        serializer = ReferralNetworkSerializer(network)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get referral statistics."""
        referrals = self.get_queryset()
        
        stats = {
            'total': referrals.count(),
            'by_status': {},
            'by_level': {}
        }
        
        # Count by status
        for ref_status in Referral.Status:
            count = referrals.filter(status=ref_status).count()
            if count > 0:
                stats['by_status'][ref_status.label] = count
        
        # Count by level
        level_stats = referrals.values('level').annotate(
            count=Count('id')
        ).order_by('level')
        
        for item in level_stats:
            stats['by_level'][f"Level {item['level']}"] = item['count']
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a referral."""
        referral = self.get_object()
        referral.activate()
        
        return Response(
            ReferralSerializer(referral).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark referral as completed."""
        referral = self.get_object()
        referral.complete()
        
        return Response(
            ReferralSerializer(referral).data,
            status=status.HTTP_200_OK
        )


class ReferralIncomeViewSet(viewsets.ModelViewSet):
    """ViewSet for ReferralIncome CRUD operations."""
    
    serializer_class = ReferralIncomeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'income_type']
    ordering_fields = ['earned_at', 'amount']
    ordering = ['-earned_at']
    
    def get_queryset(self):
        """Get incomes for current user."""
        return ReferralIncome.objects.filter(
            user=self.request.user
        ).select_related('user', 'referral')
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get income statistics."""
        incomes = self.get_queryset()
        
        total_earned = incomes.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0')
        
        pending = incomes.filter(
            status=ReferralIncome.Status.PENDING
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        approved = incomes.filter(
            status=ReferralIncome.Status.APPROVED
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        paid = incomes.filter(
            status=ReferralIncome.Status.PAID
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        # Available for withdrawal = approved but not paid
        available = approved
        
        stats = {
            'total_earned': total_earned,
            'total_pending': pending,
            'total_approved': approved,
            'total_paid': paid,
            'available_for_withdrawal': available,
            'currency': 'RUB'
        }
        
        serializer = ReferralIncomeStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve income (admin only)."""
        # TODO: Add admin permission check
        income = self.get_object()
        income.approve()
        
        return Response(
            ReferralIncomeSerializer(income).data,
            status=status.HTTP_200_OK
        )


class ReferralPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for ReferralPayment CRUD operations."""
    
    serializer_class = ReferralPaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method']
    ordering_fields = ['requested_at', 'amount']
    ordering = ['-requested_at']
    
    def get_queryset(self):
        """Get payments for current user."""
        return ReferralPayment.objects.filter(
            user=self.request.user
        ).prefetch_related('incomes')
    
    @action(detail=False, methods=['post'])
    def request_withdrawal(self, request):
        """Request a payment withdrawal."""
        serializer = ReferralPaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check available balance
        available = ReferralIncomeService.get_available_balance(request.user)
        requested_amount = serializer.validated_data['amount']
        
        if requested_amount > available:
            return Response(
                {"error": f"Insufficient balance. Available: {available}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create payment
        payment = ReferralPayment.objects.create(
            user=request.user,
            amount=requested_amount,
            payment_method=serializer.validated_data['payment_method'],
            recipient_details=serializer.validated_data['recipient_details'],
            notes=serializer.validated_data.get('notes', ''),
            fee=Decimal('0'),  # TODO: Calculate fee
            net_amount=requested_amount
        )
        
        # Link approved incomes to this payment
        approved_incomes = ReferralIncome.objects.filter(
            user=request.user,
            status=ReferralIncome.Status.APPROVED
        )[:100]  # Limit to prevent huge queries
        
        payment.incomes.add(*approved_incomes)
        
        return Response(
            ReferralPaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process a payment (admin only)."""
        # TODO: Add admin permission check
        payment = self.get_object()
        payment.process()
        
        return Response(
            ReferralPaymentSerializer(payment).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a payment (admin only)."""
        # TODO: Add admin permission check
        payment = self.get_object()
        payment.complete()
        
        return Response(
            ReferralPaymentSerializer(payment).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a payment."""
        payment = self.get_object()
        
        if payment.status in [ReferralPayment.Status.COMPLETED]:
            return Response(
                {"error": "Cannot cancel completed payment"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment.status = ReferralPayment.Status.CANCELLED
        payment.save()
        
        return Response(
            ReferralPaymentSerializer(payment).data,
            status=status.HTTP_200_OK
        )


class ReferralSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for ReferralSettings CRUD operations."""
    
    serializer_class = ReferralSettingsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch']  # No create/delete
    
    def get_queryset(self):
        """Get settings for current user."""
        return ReferralSettings.objects.filter(user=self.request.user)
    
    def get_object(self):
        """Get or create settings for current user."""
        settings, created = ReferralSettings.objects.get_or_create(
            user=self.request.user
        )
        return settings
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's settings."""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


class ReferralDashboardViewSet(viewsets.ViewSet):
    """ViewSet for referral program overview/dashboard."""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get comprehensive referral program overview."""
        user = request.user
        
        # Referral statistics
        referrals = Referral.objects.filter(referrer=user)
        total_referrals = referrals.count()
        active_referrals = referrals.filter(status=Referral.Status.ACTIVE).count()
        
        # Link statistics
        links = ReferralLink.objects.filter(user=user)
        link_stats = links.aggregate(
            total_clicks=Sum('total_clicks'),
            total_registrations=Sum('total_registrations'),
            total_conversions=Sum('total_conversions')
        )
        
        # Income statistics
        incomes = ReferralIncome.objects.filter(user=user)
        income_stats = {
            'total_earned': incomes.aggregate(total=Sum('amount'))['total'] or Decimal('0'),
            'pending': incomes.filter(status=ReferralIncome.Status.PENDING).aggregate(
                total=Sum('amount'))['total'] or Decimal('0'),
            'paid': incomes.filter(status=ReferralIncome.Status.PAID).aggregate(
                total=Sum('amount'))['total'] or Decimal('0'),
            'available': incomes.filter(status=ReferralIncome.Status.APPROVED).aggregate(
                total=Sum('amount'))['total'] or Decimal('0')
        }
        
        # Get primary referral link
        primary_link = links.filter(status=ReferralLink.Status.ACTIVE).first()
        
        # Calculate conversion rate
        total_clicks = link_stats.get('total_clicks', 0) or 0
        total_conversions = link_stats.get('total_conversions', 0) or 0
        conversion_rate = (
            round((total_conversions / total_clicks) * 100, 2)
            if total_clicks > 0 else 0.0
        )
        
        overview = {
            'total_referrals': total_referrals,
            'active_referrals': active_referrals,
            'total_clicks': link_stats.get('total_clicks', 0) or 0,
            'total_registrations': link_stats.get('total_registrations', 0) or 0,
            'total_conversions': total_conversions,
            'total_earned': income_stats['total_earned'],
            'pending_income': income_stats['pending'],
            'paid_income': income_stats['paid'],
            'available_for_withdrawal': income_stats['available'],
            'conversion_rate': conversion_rate,
            'referral_code': primary_link.code if primary_link else '',
            'commission_percent': primary_link.commission_percent if primary_link else Decimal('10.00')
        }
        
        serializer = ReferralOverviewSerializer(overview)
        return Response(serializer.data)

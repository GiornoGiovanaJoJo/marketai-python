"""Referral app URL configuration."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ReferralLinkViewSet,
    ReferralViewSet,
    ReferralIncomeViewSet,
    ReferralPaymentViewSet,
    ReferralSettingsViewSet,
    ReferralDashboardViewSet,
)


app_name = 'referral'

router = DefaultRouter()
router.register(r'links', ReferralLinkViewSet, basename='referral-link')
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'income', ReferralIncomeViewSet, basename='referral-income')
router.register(r'payments', ReferralPaymentViewSet, basename='referral-payment')
router.register(r'settings', ReferralSettingsViewSet, basename='referral-settings')
router.register(r'dashboard', ReferralDashboardViewSet, basename='referral-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]

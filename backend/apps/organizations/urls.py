"""Organizations app URL configuration."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    OrganizationViewSet,
    EmployeeViewSet,
    PartnerViewSet,
    AccessPermissionViewSet,
)


app_name = 'organizations'

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'access-permissions', AccessPermissionViewSet, basename='access-permission')

urlpatterns = [
    path('', include(router.urls)),
]

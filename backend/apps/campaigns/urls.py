from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet

router = DefaultRouter()
router.register('', CampaignViewSet, basename='campaign')

app_name = 'campaigns'

urlpatterns = [
    path('', include(router.urls)),
]

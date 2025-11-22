from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Campaign
from .serializers import (
    CampaignSerializer,
    CampaignCreateUpdateSerializer,
    CampaignListSerializer,
)


class CampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Campaign CRUD operations
    Migrated from Laravel CampaignController
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['marketplace', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name', 'budget', 'spent', 'revenue']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter campaigns by current user
        """
        return Campaign.objects.filter(user=self.request.user).select_related('user')
    
    def get_serializer_class(self):
        """
        Use different serializers for different actions
        """
        if self.action == 'list':
            return CampaignListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CampaignCreateUpdateSerializer
        return CampaignSerializer
    
    def perform_create(self, serializer):
        """
        Set current user as campaign owner
        Migrated from Laravel: POST /api/campaigns
        """
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """
        List all campaigns for current user
        Migrated from Laravel: GET /api/campaigns
        """
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """
        Get single campaign details
        Migrated from Laravel: GET /api/campaigns/{id}
        """
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """
        Create new campaign
        Migrated from Laravel: POST /api/campaigns
        """
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Update campaign
        Migrated from Laravel: PUT/PATCH /api/campaigns/{id}
        """
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete campaign
        Migrated from Laravel: DELETE /api/campaigns/{id}
        """
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Activate campaign
        """
        campaign = self.get_object()
        campaign.status = Campaign.StatusChoices.ACTIVE
        campaign.save()
        return Response(
            CampaignSerializer(campaign).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """
        Pause campaign
        """
        campaign = self.get_object()
        campaign.status = Campaign.StatusChoices.PAUSED
        campaign.save()
        return Response(
            CampaignSerializer(campaign).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """
        Archive campaign
        """
        campaign = self.get_object()
        campaign.status = Campaign.StatusChoices.ARCHIVED
        campaign.save()
        return Response(
            CampaignSerializer(campaign).data,
            status=status.HTTP_200_OK
        )

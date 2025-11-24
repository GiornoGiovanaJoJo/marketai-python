from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Campaign
from .enums import CampaignStatus
from .serializers import (
    CampaignSerializer,
    CampaignCreateSerializer,
    CampaignUpdateSerializer,
    CampaignListSerializer,
)


class CampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Campaign CRUD operations
    Migrated from Laravel CampaignController
    
    Endpoints:
    - GET    /api/campaigns/          - List campaigns
    - POST   /api/campaigns/          - Create campaign
    - GET    /api/campaigns/{id}/     - Get campaign details
    - PUT    /api/campaigns/{id}/     - Full update
    - PATCH  /api/campaigns/{id}/     - Partial update
    - DELETE /api/campaigns/{id}/     - Delete campaign
    - POST   /api/campaigns/{id}/activate/  - Activate campaign
    - POST   /api/campaigns/{id}/pause/     - Pause campaign
    - POST   /api/campaigns/{id}/archive/   - Archive campaign
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['marketplace', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter campaigns by current user
        """
        return Campaign.objects.filter(user=self.request.user).select_related('user')
    
    def get_serializer_class(self):
        """
        Use different serializers for different actions
        - list: Lightweight serializer
        - create: Strict validation
        - update/partial_update: Flexible validation
        - default: Full serializer
        """
        if self.action == 'list':
            return CampaignListSerializer
        elif self.action == 'create':
            return CampaignCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CampaignUpdateSerializer
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
        Full update campaign (PUT)
        Migrated from Laravel: PUT /api/campaigns/{id}
        """
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Partial update campaign (PATCH)
        Migrated from Laravel: PATCH /api/campaigns/{id}
        """
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete campaign
        Migrated from Laravel: DELETE /api/campaigns/{id}
        """
        return super().destroy(request, *args, **kwargs)
    
    # NEW: Campaign action endpoints (from Laravel backend)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Activate campaign
        POST /api/campaigns/{id}/activate/
        
        Migrated from Laravel: POST /api/campaigns/{id}/activate
        """
        campaign = self.get_object()
        campaign.status = CampaignStatus.ACTIVE
        campaign.save()
        serializer = CampaignSerializer(campaign)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """
        Pause campaign
        POST /api/campaigns/{id}/pause/
        
        Migrated from Laravel: POST /api/campaigns/{id}/pause
        """
        campaign = self.get_object()
        campaign.status = CampaignStatus.PAUSED
        campaign.save()
        serializer = CampaignSerializer(campaign)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """
        Archive campaign
        POST /api/campaigns/{id}/archive/
        
        Migrated from Laravel: POST /api/campaigns/{id}/archive
        """
        campaign = self.get_object()
        # Note: If ARCHIVED status doesn't exist in CampaignStatus enum,
        # use INACTIVE or add ARCHIVED to enums.py
        campaign.status = CampaignStatus.INACTIVE  # Or ARCHIVED if it exists
        campaign.save()
        serializer = CampaignSerializer(campaign)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
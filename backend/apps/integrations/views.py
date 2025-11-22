from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .wildberries.service import WildberriesService
from .serializers import (
    WildberriesSyncRequestSerializer,
    WildberriesSyncResponseSerializer,
    CampaignStatsSyncSerializer,
)


@extend_schema(
    request=WildberriesSyncRequestSerializer,
    responses={
        200: WildberriesSyncResponseSerializer,
    },
    tags=['Integrations']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_wildberries_campaigns(request):
    """
    Synchronize campaigns from Wildberries
    """
    serializer = WildberriesSyncRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    api_key = serializer.validated_data.get('api_key')
    
    service = WildberriesService(request.user, api_key)
    result = service.sync_campaigns()
    
    return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    request=CampaignStatsSyncSerializer,
    responses={
        200: WildberriesSyncResponseSerializer,
    },
    tags=['Integrations']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_campaign_statistics(request):
    """
    Synchronize statistics for specific campaign
    """
    serializer = CampaignStatsSyncSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    api_key = serializer.validated_data.get('api_key')
    
    service = WildberriesService(request.user, api_key)
    result = service.sync_campaign_statistics(
        campaign_id=serializer.validated_data['campaign_id'],
        date_from=serializer.validated_data['date_from'],
        date_to=serializer.validated_data['date_to'],
    )
    
    return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    responses={
        200: {'description': 'API connection test successful'},
    },
    tags=['Integrations']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_wildberries_connection(request):
    """
    Test Wildberries API connection
    """
    try:
        service = WildberriesService(request.user)
        # Try to get campaigns as a connection test
        service.client.get_campaigns()
        
        return Response({
            'status': 'success',
            'message': 'Wildberries API connection successful'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

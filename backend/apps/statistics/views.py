from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .services import StatisticsService
from .serializers import (
    FinancialReportSerializer,
    CampaignPerformanceSerializer,
    DashboardStatsSerializer,
    StatisticsQuerySerializer,
)


@extend_schema(
    parameters=[
        OpenApiParameter(name='start_date', type=str, description='Start date (YYYY-MM-DD)'),
        OpenApiParameter(name='end_date', type=str, description='End date (YYYY-MM-DD)'),
    ],
    responses={
        200: FinancialReportSerializer,
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_report(request):
    """
    Get financial report for user's campaigns
    Migrated from Laravel: GET /api/statistics/financial-report
    """
    # Validate query parameters
    query_serializer = StatisticsQuerySerializer(data=request.query_params)
    query_serializer.is_valid(raise_exception=True)
    
    # Get statistics
    service = StatisticsService(request.user)
    report = service.get_financial_report(
        start_date=query_serializer.validated_data.get('start_date'),
        end_date=query_serializer.validated_data.get('end_date'),
    )
    
    serializer = FinancialReportSerializer(report)
    return Response(serializer.data)


@extend_schema(
    responses={
        200: CampaignPerformanceSerializer,
        404: {'description': 'Campaign not found'},
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_performance(request, campaign_id):
    """
    Get detailed performance metrics for a specific campaign
    """
    service = StatisticsService(request.user)
    performance = service.get_campaign_performance(campaign_id)
    
    if not performance:
        return Response(
            {'error': 'Campaign not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CampaignPerformanceSerializer(performance)
    return Response(serializer.data)


@extend_schema(
    responses={
        200: DashboardStatsSerializer,
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get statistics for dashboard (last 30 days)
    """
    service = StatisticsService(request.user)
    stats = service.get_dashboard_stats()
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)

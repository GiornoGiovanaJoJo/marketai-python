from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .services import StatisticsService
from .serializers import (
    FinancialReportSerializer,
    CampaignPerformanceSerializer,
    DashboardStatsSerializer,
    StatisticsQuerySerializer,
    CampaignStatisticSerializer,
    ProductStatisticSerializer,
    DailyUserStatisticSerializer,
    CampaignDetailedStatsSerializer,
    TopProductSerializer,
    CampaignChartDataSerializer,
)
from .models import CampaignStatistic, ProductStatistic, DailyUserStatistic


class CampaignStatisticViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for campaign statistics
    Provides read-only access to campaign performance data
    """
    serializer_class = CampaignStatisticSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter statistics by user's campaigns"""
        return CampaignStatistic.objects.filter(
            campaign__user=self.request.user
        ).select_related('campaign')


class ProductStatisticViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for product statistics
    Provides read-only access to product performance data
    """
    serializer_class = ProductStatisticSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter statistics by user's campaigns"""
        return ProductStatistic.objects.filter(
            campaign__user=self.request.user
        ).select_related('campaign')


class DailyUserStatisticViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for daily user statistics
    Provides aggregated daily stats
    """
    serializer_class = DailyUserStatisticSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter statistics by current user"""
        return DailyUserStatistic.objects.filter(user=self.request.user)


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


@extend_schema(
    parameters=[
        OpenApiParameter(name='start_date', type=str, description='Start date (YYYY-MM-DD)'),
        OpenApiParameter(name='end_date', type=str, description='End date (YYYY-MM-DD)'),
    ],
    responses={
        200: CampaignDetailedStatsSerializer,
        404: {'description': 'Campaign not found'},
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_detailed_stats(request, campaign_id):
    """
    Get comprehensive statistics for a campaign
    Includes: daily stats, top products, chart data
    """
    # Validate query parameters
    query_serializer = StatisticsQuerySerializer(data=request.query_params)
    query_serializer.is_valid(raise_exception=True)
    
    service = StatisticsService(request.user)
    detailed_stats = service.get_campaign_detailed_stats(
        campaign_id=campaign_id,
        start_date=query_serializer.validated_data.get('start_date'),
        end_date=query_serializer.validated_data.get('end_date'),
    )
    
    if not detailed_stats:
        return Response(
            {'error': 'Campaign not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CampaignDetailedStatsSerializer(detailed_stats)
    return Response(serializer.data)


@extend_schema(
    parameters=[
        OpenApiParameter(name='start_date', type=str, description='Start date (YYYY-MM-DD)'),
        OpenApiParameter(name='end_date', type=str, description='End date (YYYY-MM-DD)'),
    ],
    responses={
        200: CampaignChartDataSerializer(many=True),
        404: {'description': 'Campaign not found'},
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_chart_data(request, campaign_id):
    """
    Get time series data for campaign charts
    Used for rendering performance graphs
    """
    # Validate query parameters
    query_serializer = StatisticsQuerySerializer(data=request.query_params)
    query_serializer.is_valid(raise_exception=True)
    
    service = StatisticsService(request.user)
    chart_data = service.get_campaign_chart_data(
        campaign_id=campaign_id,
        start_date=query_serializer.validated_data.get('start_date'),
        end_date=query_serializer.validated_data.get('end_date'),
    )
    
    if chart_data is None:
        return Response(
            {'error': 'Campaign not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CampaignChartDataSerializer(chart_data, many=True)
    return Response(serializer.data)


@extend_schema(
    parameters=[
        OpenApiParameter(name='limit', type=int, description='Number of products to return (default: 10)'),
    ],
    responses={
        200: TopProductSerializer(many=True),
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_products(request):
    """
    Get top performing products across all user's campaigns
    """
    limit = request.query_params.get('limit', 10)
    try:
        limit = int(limit)
        if limit < 1 or limit > 100:
            limit = 10
    except (ValueError, TypeError):
        limit = 10
    
    service = StatisticsService(request.user)
    products = service.get_top_products(limit=limit)
    
    serializer = TopProductSerializer(products, many=True)
    return Response(serializer.data)


@extend_schema(
    parameters=[
        OpenApiParameter(name='campaign_id', type=int, description='Campaign ID (optional)'),
        OpenApiParameter(name='limit', type=int, description='Number of products to return (default: 10)'),
    ],
    responses={
        200: TopProductSerializer(many=True),
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_top_products(request, campaign_id):
    """
    Get top performing products for a specific campaign
    """
    limit = request.query_params.get('limit', 10)
    try:
        limit = int(limit)
        if limit < 1 or limit > 100:
            limit = 10
    except (ValueError, TypeError):
        limit = 10
    
    service = StatisticsService(request.user)
    products = service.get_campaign_top_products(
        campaign_id=campaign_id,
        limit=limit
    )
    
    if products is None:
        return Response(
            {'error': 'Campaign not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = TopProductSerializer(products, many=True)
    return Response(serializer.data)

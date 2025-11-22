"""
Custom exception handler for DRF
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Standardize error response format
        custom_response_data = {
            'error': True,
            'message': str(exc),
            'detail': response.data,
            'status_code': response.status_code,
        }
        
        # Log error
        logger.error(
            f"API Error: {exc} | "
            f"View: {context.get('view').__class__.__name__} | "
            f"Request: {context.get('request').method} {context.get('request').path}"
        )
        
        response.data = custom_response_data
    else:
        # Handle unexpected errors
        logger.exception(f"Unhandled exception: {exc}")
        response = Response(
            {
                'error': True,
                'message': 'Internal server error',
                'detail': str(exc) if settings.DEBUG else 'An error occurred',
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response

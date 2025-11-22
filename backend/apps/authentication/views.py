from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    TokenResponseSerializer,
    LogoutSerializer,
)
from apps.users.serializers import UserSerializer


def get_tokens_for_user(user):
    """
    Generate JWT tokens for user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@extend_schema(
    request=RegisterSerializer,
    responses={
        201: TokenResponseSerializer,
        400: OpenApiResponse(description='Bad Request'),
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    Migrated from Laravel: POST /api/auth/register
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=LoginSerializer,
    responses={
        200: TokenResponseSerializer,
        400: OpenApiResponse(description='Bad Request'),
        401: OpenApiResponse(description='Unauthorized'),
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens
    Migrated from Laravel: POST /api/auth/login
    """
    serializer = LoginSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        }, status=status.HTTP_200_OK)
    
    return Response(
        serializer.errors,
        status=status.HTTP_401_UNAUTHORIZED
    )


@extend_schema(
    responses={
        200: UserSerializer,
    },
    tags=['Authentication']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Get current authenticated user
    Migrated from Laravel: GET /api/auth/me
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@extend_schema(
    request=LogoutSerializer,
    responses={
        200: OpenApiResponse(description='Successfully logged out'),
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user and blacklist refresh token
    Migrated from Laravel: POST /api/auth/logout
    """
    serializer = LogoutSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )
    
    return Response(
        {'message': 'Successfully logged out'},
        status=status.HTTP_200_OK
    )

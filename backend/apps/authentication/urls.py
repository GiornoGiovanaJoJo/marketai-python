from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Migrated from Laravel routes
    path('register/', views.register, name='register'),  # POST /api/auth/register
    path('login/', views.login, name='login'),           # POST /api/auth/login
    path('me/', views.me, name='me'),                    # GET /api/auth/me
    path('logout/', views.logout, name='logout'),        # POST /api/auth/logout
    
    # JWT token refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

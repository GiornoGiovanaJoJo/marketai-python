from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model - migrated from Laravel MarketAI backend
    
    Key differences from default Django User:
    - Phone is the primary unique identifier (not username)
    - Email is optional but unique
    - Both email and phone can be verified independently
    - Removed company and avatar fields (not in Laravel)
    """
    
    # Override email to make it nullable but unique when present
    email = models.EmailField(
        _('email address'),
        unique=True,
        null=True,
        blank=True,
        error_messages={
            'unique': _('A user with that email already exists.'),
        },
    )
    
    # Phone is required and unique (primary auth field)
    phone = models.CharField(
        _('phone number'),
        max_length=20,
        unique=True,
        error_messages={
            'unique': _('A user with that phone number already exists.'),
        },
    )
    
    # Verification timestamps (matching Laravel structure)
    email_verified_at = models.DateTimeField(
        _('email verified at'),
        null=True,
        blank=True,
    )
    
    phone_verified_at = models.DateTimeField(
        _('phone verified at'),
        null=True,
        blank=True,
    )
    
    # Override username to not be required (we use phone instead)
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        null=True,
        blank=True,
    )
    
    # Use first_name as 'name' field (matching Laravel)
    first_name = models.CharField(_('name'), max_length=150)
    
    # We don't use last_name in Laravel version
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    
    # Authentication configuration
    USERNAME_FIELD = 'phone'  # Login with phone
    REQUIRED_FIELDS = ['first_name']  # Required when creating superuser

    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f"{self.phone} - {self.first_name}"

    @property
    def name(self):
        """Alias for first_name to match Laravel API"""
        return self.first_name
    
    @property
    def is_email_verified(self):
        """Check if email is verified"""
        return self.email_verified_at is not None
    
    @property
    def is_phone_verified(self):
        """Check if phone is verified"""
        return self.phone_verified_at is not None

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom user manager for phone-based authentication
    """
    
    def create_user(self, phone, password=None, first_name='', **extra_fields):
        """
        Create and save a regular user with the given phone and password.
        first_name is optional (default empty string).
        """
        if not phone:
            raise ValueError(_('The Phone number must be set'))
        
        # Generate username from phone if not provided
        if 'username' not in extra_fields or not extra_fields.get('username'):
            extra_fields['username'] = phone
        
        user = self.model(phone=phone, first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone, first_name, password=None, **extra_fields):
        """
        Create and save a superuser with the given phone and password.
        first_name is required for superuser.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        if not first_name:
            raise ValueError(_('Superuser must have a first_name'))
        
        return self.create_user(phone, password, first_name, **extra_fields)


class User(AbstractUser):
    """
    Custom User model - migrated from Laravel MarketAI backend
    
    Key differences from default Django User:
    - Phone is the primary unique identifier (not username)
    - Email is optional but unique
    - Both email and phone can be verified independently
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
    
    # Use first_name as 'name' field (matching Laravel) - now optional
    first_name = models.CharField(_('name'), max_length=150, blank=True)
    
    # We don't use last_name in Laravel version
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    
    # Use custom manager
    objects = UserManager()
    
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
        return f"{self.phone} - {self.first_name or 'No name'}"

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

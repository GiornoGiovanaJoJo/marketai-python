from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model - migrated from Laravel
    """
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _('A user with that email already exists.'),
        },
    )
    
    phone = models.CharField(
        _('phone number'),
        max_length=20,
        blank=True,
        null=True,
    )
    
    company = models.CharField(
        _('company name'),
        max_length=255,
        blank=True,
        null=True,
    )
    
    avatar = models.ImageField(
        _('avatar'),
        upload_to='avatars/',
        blank=True,
        null=True,
    )
    
    is_email_verified = models.BooleanField(
        _('email verified'),
        default=False,
    )
    
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
    )
    
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
    )

    # Make email the unique identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - {self.get_full_name() or self.username}"

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()

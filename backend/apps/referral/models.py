"""Referral app models."""
import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


User = get_user_model()


class ReferralLink(models.Model):
    """Referral link model for tracking user referrals."""
    
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        EXPIRED = 'expired', _('Expired')
    
    uuid = models.UUIDField(_('UUID'), default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_links',
        verbose_name=_('user')
    )
    code = models.CharField(_('referral code'), max_length=50, unique=True)
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    
    # Commission settings
    commission_percent = models.DecimalField(
        _('commission percent'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('10.00'),
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))]
    )
    
    # Usage statistics
    total_clicks = models.IntegerField(_('total clicks'), default=0)
    total_registrations = models.IntegerField(_('total registrations'), default=0)
    total_conversions = models.IntegerField(_('total conversions'), default=0)
    
    # Metadata
    expires_at = models.DateTimeField(_('expires at'), null=True, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'referral_links'
        verbose_name = _('referral link')
        verbose_name_plural = _('referral links')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['code']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.code}"
    
    def is_active(self) -> bool:
        """Check if link is active."""
        if self.status != self.Status.ACTIVE:
            return False
        
        if self.expires_at and self.expires_at < timezone.now():
            self.status = self.Status.EXPIRED
            self.save()
            return False
        
        return True
    
    def increment_clicks(self):
        """Increment click counter."""
        self.total_clicks += 1
        self.save(update_fields=['total_clicks'])
    
    def increment_registrations(self):
        """Increment registration counter."""
        self.total_registrations += 1
        self.save(update_fields=['total_registrations'])
    
    def increment_conversions(self):
        """Increment conversion counter."""
        self.total_conversions += 1
        self.save(update_fields=['total_conversions'])


class Referral(models.Model):
    """Referral relationship between users."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        ACTIVE = 'active', _('Active')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')
    
    referrer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referrals_made',
        verbose_name=_('referrer')
    )
    referred = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referrals_received',
        verbose_name=_('referred user')
    )
    referral_link = models.ForeignKey(
        ReferralLink,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='referrals',
        verbose_name=_('referral link')
    )
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Level in referral network (1 = direct, 2 = second level, etc.)
    level = models.IntegerField(
        _('level'),
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    
    # Metadata
    registered_at = models.DateTimeField(_('registered at'), auto_now_add=True)
    activated_at = models.DateTimeField(_('activated at'), null=True, blank=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'referrals'
        verbose_name = _('referral')
        verbose_name_plural = _('referrals')
        unique_together = [['referrer', 'referred']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['referrer']),
            models.Index(fields=['referred']),
            models.Index(fields=['status']),
            models.Index(fields=['level']),
        ]
    
    def __str__(self):
        return f"{self.referrer.email} -> {self.referred.email} (Level {self.level})"
    
    def activate(self):
        """Activate referral."""
        self.status = self.Status.ACTIVE
        self.activated_at = timezone.now()
        self.save()
    
    def complete(self):
        """Mark referral as completed."""
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save()


class ReferralIncome(models.Model):
    """Income/earnings from referral program."""
    
    class IncomeType(models.TextChoices):
        COMMISSION = 'commission', _('Commission')
        BONUS = 'bonus', _('Bonus')
        REWARD = 'reward', _('Reward')
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        APPROVED = 'approved', _('Approved')
        PAID = 'paid', _('Paid')
        CANCELLED = 'cancelled', _('Cancelled')
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_incomes',
        verbose_name=_('user')
    )
    referral = models.ForeignKey(
        Referral,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='incomes',
        verbose_name=_('referral')
    )
    
    income_type = models.CharField(
        _('income type'),
        max_length=20,
        choices=IncomeType.choices,
        default=IncomeType.COMMISSION
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Financial data
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    currency = models.CharField(_('currency'), max_length=3, default='RUB')
    commission_percent = models.DecimalField(
        _('commission percent'),
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Reference to transaction/order
    transaction_id = models.CharField(_('transaction ID'), max_length=100, blank=True)
    description = models.TextField(_('description'), blank=True)
    
    # Dates
    earned_at = models.DateTimeField(_('earned at'), auto_now_add=True)
    approved_at = models.DateTimeField(_('approved at'), null=True, blank=True)
    paid_at = models.DateTimeField(_('paid at'), null=True, blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'referral_incomes'
        verbose_name = _('referral income')
        verbose_name_plural = _('referral incomes')
        ordering = ['-earned_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['referral']),
            models.Index(fields=['status']),
            models.Index(fields=['income_type']),
            models.Index(fields=['earned_at']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} {self.currency} ({self.get_status_display()})"
    
    def approve(self):
        """Approve income."""
        self.status = self.Status.APPROVED
        self.approved_at = timezone.now()
        self.save()
    
    def mark_as_paid(self):
        """Mark income as paid."""
        self.status = self.Status.PAID
        self.paid_at = timezone.now()
        self.save()


class ReferralPayment(models.Model):
    """Payment/withdrawal from referral earnings."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        PROCESSING = 'processing', _('Processing')
        COMPLETED = 'completed', _('Completed')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')
    
    class PaymentMethod(models.TextChoices):
        BANK_TRANSFER = 'bank_transfer', _('Bank Transfer')
        CARD = 'card', _('Card')
        WALLET = 'wallet', _('Wallet')
        CRYPTO = 'crypto', _('Cryptocurrency')
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='referral_payments',
        verbose_name=_('user')
    )
    
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    payment_method = models.CharField(
        _('payment method'),
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.BANK_TRANSFER
    )
    
    # Financial data
    amount = models.DecimalField(
        _('amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    currency = models.CharField(_('currency'), max_length=3, default='RUB')
    fee = models.DecimalField(
        _('fee'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))]
    )
    net_amount = models.DecimalField(
        _('net amount'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    
    # Payment details
    recipient_details = models.JSONField(_('recipient details'), default=dict)
    transaction_id = models.CharField(_('transaction ID'), max_length=100, blank=True)
    notes = models.TextField(_('notes'), blank=True)
    
    # Related incomes
    incomes = models.ManyToManyField(
        ReferralIncome,
        related_name='payments',
        verbose_name=_('incomes'),
        blank=True
    )
    
    # Dates
    requested_at = models.DateTimeField(_('requested at'), auto_now_add=True)
    processed_at = models.DateTimeField(_('processed at'), null=True, blank=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'referral_payments'
        verbose_name = _('referral payment')
        verbose_name_plural = _('referral payments')
        ordering = ['-requested_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['requested_at']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} {self.currency} ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        """Calculate net amount before saving."""
        if not self.net_amount:
            self.net_amount = self.amount - self.fee
        super().save(*args, **kwargs)
    
    def process(self):
        """Start processing payment."""
        self.status = self.Status.PROCESSING
        self.processed_at = timezone.now()
        self.save()
    
    def complete(self):
        """Mark payment as completed."""
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save()
        
        # Mark related incomes as paid
        self.incomes.update(status=ReferralIncome.Status.PAID, paid_at=timezone.now())


class ReferralSettings(models.Model):
    """User-specific referral program settings."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='referral_settings',
        verbose_name=_('user')
    )
    
    # Commission settings
    default_commission_percent = models.DecimalField(
        _('default commission percent'),
        max_digits=5,
        decimal_places=2,
        default=Decimal('10.00'),
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('100'))]
    )
    
    # Network settings
    max_referral_levels = models.IntegerField(
        _('max referral levels'),
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    
    # Payment settings
    min_withdrawal_amount = models.DecimalField(
        _('minimum withdrawal amount'),
        max_digits=12,
        decimal_places=2,
        default=Decimal('1000.00'),
        validators=[MinValueValidator(Decimal('0'))]
    )
    auto_approve_payments = models.BooleanField(_('auto approve payments'), default=False)
    
    # Notification settings
    notify_new_referral = models.BooleanField(_('notify on new referral'), default=True)
    notify_income = models.BooleanField(_('notify on income'), default=True)
    notify_payment = models.BooleanField(_('notify on payment'), default=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        db_table = 'referral_settings'
        verbose_name = _('referral settings')
        verbose_name_plural = _('referral settings')
    
    def __str__(self):
        return f"Settings for {self.user.email}"

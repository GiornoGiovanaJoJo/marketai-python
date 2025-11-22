# Models Migration Documentation

## Overview

This document describes the migration of Laravel models to Django for the MarketAI project.

## Migration Status

### ✅ Completed Models

#### 1. User Model
- **Laravel**: `App\Models\User`
- **Django**: `apps.users.models.User`
- **Status**: ✅ Migrated

**Key Changes:**
- Extends `AbstractUser` instead of `Authenticatable`
- Phone-based authentication (`USERNAME_FIELD = 'phone'`)
- Email is optional but unique when present
- Added verification timestamps: `email_verified_at`, `phone_verified_at`
- Removed: `company`, `avatar` (not in Laravel version)

**Database Fields:**
```python
id: BigAutoField (primary key)
username: CharField(max_length=150, unique=True, null=True, blank=True)
first_name: CharField(max_length=150)  # Used as 'name' in Laravel
last_name: CharField(max_length=150, blank=True)
email: EmailField(unique=True, null=True, blank=True)
phone: CharField(max_length=20, unique=True)  # PRIMARY AUTH FIELD
password: CharField(max_length=128)
email_verified_at: DateTimeField(null=True, blank=True)
phone_verified_at: DateTimeField(null=True, blank=True)
date_joined: DateTimeField(auto_now_add=True)
last_login: DateTimeField(null=True, blank=True)
is_active: BooleanField(default=True)
is_staff: BooleanField(default=False)
is_superuser: BooleanField(default=False)
```

**Properties:**
- `name`: Alias for `first_name` (Laravel compatibility)
- `is_email_verified`: Boolean property based on `email_verified_at`
- `is_phone_verified`: Boolean property based on `phone_verified_at`

---

#### 2. Campaign Model
- **Laravel**: `App\Models\Campaign`
- **Django**: `apps.campaigns.models.Campaign`
- **Status**: ✅ Migrated

**Key Changes:**
- NO automatic timestamps (matching Laravel `$timestamps = false`)
- IntegerChoices enums instead of PHP backed enums
- Django signals instead of Laravel event dispatching
- Unique constraint on `(user, key)` combination

**Database Fields:**
```python
id: BigAutoField (primary key)
user_id: ForeignKey(User, CASCADE, related_name='campaigns')
name: CharField(max_length=255)
key: CharField(max_length=2048)  # API key for marketplace
status: IntegerField(choices=CampaignStatus.choices, default=INACTIVE)
marketplace: IntegerField(choices=Marketplace.choices, null=True, blank=True)
# NO created_at / updated_at (timestamps = false in Laravel)
```

**Enums:**

`CampaignStatus` (IntegerChoices):
- `ACTIVE = 1` - Campaign is running
- `INACTIVE = 2` - Campaign is not active (default)
- `ERROR = 3` - Campaign has errors

`Marketplace` (IntegerChoices):
- `WILDBERRIES = 1` - Wildberries marketplace
- `OZON = 2` - Ozon marketplace  
- `YANDEX_MARKET = 3` - Yandex Market

**Constraints:**
- Index on `user_id`
- Unique constraint on `(user_id, key)`
- Foreign key CASCADE delete on user

**Signals (Events):**
- `campaign_created` → `CampaignCreated` event in Laravel
- `campaign_deleted` → `CampaignDeleted` event in Laravel
- `campaign_updated` (Django-specific, not in Laravel)

---

## Enums Migration

### Laravel PHP 8.1+ Backed Enums → Django IntegerChoices

**Laravel:**
```php
enum CampaignStatus: int
{
    case Active = 1;
    case Inactive = 2;
    case Error = 3;
}
```

**Django Equivalent:**
```python
class CampaignStatus(models.IntegerChoices):
    ACTIVE = 1, _('Active')
    INACTIVE = 2, _('Inactive')
    ERROR = 3, _('Error')
```

**Storage:** Both store as integers in database (TINYINT in MySQL, SmallInt in PostgreSQL)

---

## Events & Signals

### Laravel Events → Django Signals

**Laravel:**
```php
protected $dispatchesEvents = [
    'created' => CampaignCreated::class,
    'deleted' => CampaignDeleted::class,
];
```

**Django Equivalent:**
```python
# apps/campaigns/signals.py
from django.db.models.signals import post_save, post_delete

@receiver(post_save, sender=Campaign)
def campaign_created(sender, instance, created, **kwargs):
    if created:
        # Handle campaign creation
        pass

@receiver(post_delete, sender=Campaign)
def campaign_deleted(sender, instance, **kwargs):
    # Handle campaign deletion
    pass
```

**Registration:**
```python
# apps/campaigns/apps.py
class CampaignsConfig(AppConfig):
    def ready(self):
        import apps.campaigns.signals  # Register signals
```

---

## Relationships

### One-to-Many: User → Campaigns

**Laravel:**
```php
// User model
public function campaigns(): HasMany
{
    return $this->hasMany(Campaign::class);
}

// Campaign model
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

**Django:**
```python
# User model - automatic reverse relation via related_name
user.campaigns.all()  # Access campaigns

# Campaign model
class Campaign(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='campaigns'
    )
```

---

## Authentication

### Laravel Sanctum → Django REST Framework JWT

**Laravel:**
- Uses `HasApiTokens` trait
- Sanctum token authentication
- `personal_access_tokens` table

**Django:**
- Uses `djangorestframework-simplejwt`
- JWT token authentication
- No database table needed (stateless)

**Configuration:**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

---

## Database Constraints Comparison

| Constraint | Laravel | Django |
|------------|---------|--------|
| Primary Key | `$table->id()` | `id = models.BigAutoField(primary_key=True)` |
| Foreign Key | `$table->foreignId('user_id')->constrained()` | `models.ForeignKey(User, on_delete=CASCADE)` |
| Unique | `$table->string('email')->unique()` | `unique=True` |
| Composite Unique | `$table->unique(['user_id', 'key'])` | `models.UniqueConstraint(fields=['user', 'key'])` |
| Index | `$table->index('user_id')` | `db_index=True` or `models.Index(fields=['user'])` |
| Nullable | `->nullable()` | `null=True, blank=True` |
| Default | `->default(value)` | `default=value` |
| Cascade Delete | `->cascadeOnDelete()` | `on_delete=models.CASCADE` |

---

## Timestamps Handling

### Laravel `$timestamps = false` → Django

**Laravel:**
```php
public $timestamps = false;  // Disable automatic timestamps
```

**Django:**
```python
# Comment out or don't add timestamp fields
# created_at = models.DateTimeField(auto_now_add=True)  # Commented out
# updated_at = models.DateTimeField(auto_now=True)      # Commented out
```

**With Timestamps (default in Laravel):**
```python
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

---

## Next Steps

### TODO: Models to Migrate

- [ ] Create database migrations
- [ ] Update serializers to match new model structure
- [ ] Update ViewSets/APIViews
- [ ] Migrate authentication views
- [ ] Add RabbitMQ integration to signals
- [ ] Add Redis caching layer
- [ ] Migrate statistics models (if any)
- [ ] Add comprehensive tests

---

## Testing Migration

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Test in Django shell
python manage.py shell

# Create test user
from apps.users.models import User
user = User.objects.create_user(
    phone='+79991234567',
    first_name='Test User',
    password='testpass123'
)

# Create test campaign
from apps.campaigns.models import Campaign, CampaignStatus, Marketplace
campaign = Campaign.objects.create(
    user=user,
    name='Test Campaign',
    key='test_api_key_123',
    status=CampaignStatus.ACTIVE,
    marketplace=Marketplace.WILDBERRIES
)

# Verify relationships
user.campaigns.all()
campaign.user

# Check signals fired
# Should see log messages in console
```

---

## References

- [Django Models Documentation](https://docs.djangoproject.com/en/5.1/topics/db/models/)
- [Django Signals](https://docs.djangoproject.com/en/5.1/topics/signals/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Laravel Eloquent Models](https://laravel.com/docs/12.x/eloquent)
- [Laravel Events](https://laravel.com/docs/12.x/events)

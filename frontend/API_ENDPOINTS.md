# API Endpoints Mapping: Laravel → Django

Этот документ описывает маппинг API эндпоинтов между старым Laravel backend и новым Django backend.

## 🔐 Authentication Endpoints

### Laravel (старый)
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/user
POST /api/auth/refresh
```

### Django (новый)
```
POST /api/auth/login/          # Login with email/password
POST /api/auth/register/       # Register new user
POST /api/auth/logout/         # Logout (blacklist refresh token)
GET  /api/auth/me/             # Get current user info
POST /api/auth/token/refresh/  # Refresh access token
```

**Ключевые изменения:**
- ✅ Все эндпоинты теперь заканчиваются на `/`
- ✅ `/api/auth/user` → `/api/auth/me/`
- ✅ `/api/auth/refresh` → `/api/auth/token/refresh/`
- ✅ Response format: `{ access, refresh, user }` (Django JWT)

**Response формат (login/register):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

## 📊 Campaigns Endpoints

### Django REST Framework ViewSet (автоматические routes)

```
GET    /api/campaigns/              # List all campaigns (with pagination)
POST   /api/campaigns/              # Create new campaign
GET    /api/campaigns/{id}/         # Retrieve campaign by ID
PUT    /api/campaigns/{id}/         # Full update (all fields required)
PATCH  /api/campaigns/{id}/         # Partial update (only specified fields)
DELETE /api/campaigns/{id}/         # Delete campaign
```

**Custom actions:**
```
GET /api/campaigns/{id}/statistics/  # Get campaign statistics
```

**Query параметры (GET /api/campaigns/):**
- `page` - Номер страницы (default: 1)
- `page_size` - Количество на странице (default: 10, max: 100)
- `search` - Поиск по названию
- `ordering` - Сортировка (например: `-created_at`, `name`)

**Paginated response format:**
```json
{
  "count": 42,
  "next": "http://api.example.com/campaigns/?page=2",
  "previous": null,
  "results": [
    { "id": 1, "name": "Campaign 1", ... },
    { "id": 2, "name": "Campaign 2", ... }
  ]
}
```

---

## 📈 Statistics Endpoints

### Django (новый)

**Dashboard:**
```
GET /api/statistics/dashboard/
```
Response: `{ total_campaigns, active_campaigns, total_revenue, ... }`

**Financial Report:**
```
GET /api/statistics/financial-report/?start_date=2024-01-01&end_date=2024-12-31
```

**Campaign Performance:**
```
GET /api/statistics/campaigns/{id}/performance/
GET /api/statistics/campaigns/{id}/detailed/
GET /api/statistics/campaigns/{id}/chart/
GET /api/statistics/campaigns/{id}/top-products/
```

**Top Products:**
```
GET /api/statistics/top-products/?limit=10&start_date=2024-01-01
```

**ViewSet endpoints (paginated):**
```
GET /api/statistics/campaign-statistics/
GET /api/statistics/product-statistics/
GET /api/statistics/daily-user-statistics/
```

---

## 🔄 HTTP Headers

### Authorization

**Laravel (Sanctum):**
```
Authorization: Bearer {token}
```

**Django (JWT):**
```
Authorization: Bearer {access_token}
```

✅ **Формат идентичный** - изменений в frontend не требуется!

---

## ❌ Error Handling

### Django REST Framework error format

**Validation errors (400 Bad Request):**
```json
{
  "email": ["This field is required."],
  "password": ["This field may not be blank."]
}
```

**Authentication errors (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Permission errors (403 Forbidden):**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

**Not found errors (404 Not Found):**
```json
{
  "detail": "Not found."
}
```

**Server errors (500 Internal Server Error):**
```json
{
  "detail": "A server error occurred."
}
```

---

## 🔧 Frontend Changes Required

### 1. API Base URL

**Проверьте `.env` файл:**
```bash
VITE_API_URL=http://localhost:8000/api
```

### 2. Token Refresh Interceptor

✅ **Уже обновлено** в `frontend/src/lib/api.ts`:
- Использует `/api/auth/token/refresh/`
- Автоматически обновляет access token при 401

### 3. Services

✅ **Все сервисы обновлены:**
- `auth.service.ts` - Django JWT endpoints
- `campaigns.service.ts` - DRF ViewSet patterns
- `statistics.service.ts` - Django statistics endpoints

### 4. Response Handling

**Pagination handling:**
```typescript
// Старый Laravel (array)
const campaigns = response.data

// Новый Django (paginated object)
const campaigns = Array.isArray(response.data) 
  ? response.data 
  : response.data.results
```

✅ **Уже реализовано** в `campaigns.service.ts`

---

## 🧪 Testing

### Проверка эндпоинтов

```bash
# 1. Запустить Django backend
cd backend
python manage.py runserver

# 2. Открыть Swagger UI
http://localhost:8000/api/docs/

# 3. Протестировать каждый endpoint через Swagger
```

### Тестирование через curl

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get campaigns (with auth):**
```bash
curl -X GET http://localhost:8000/api/campaigns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 API Documentation

### Swagger UI
```
http://localhost:8000/api/docs/
```

### ReDoc
```
http://localhost:8000/api/redoc/
```

### OpenAPI Schema (JSON)
```
http://localhost:8000/api/schema/
```

---

## ✅ Migration Checklist

- [x] API base URL configured (`VITE_API_URL`)
- [x] Token refresh interceptor updated
- [x] Auth service endpoints updated
- [x] Campaigns service endpoints updated
- [x] Statistics service endpoints updated
- [x] Pagination handling implemented
- [ ] All 26 pages tested with new API
- [ ] Error handling tested
- [ ] Token refresh flow tested
- [ ] Production environment variables configured

---

## 🔗 Полезные ссылки

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [DRF Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [DRF Spectacular (Swagger)](https://drf-spectacular.readthedocs.io/)
- [Django Pagination](https://www.django-rest-framework.org/api-guide/pagination/)

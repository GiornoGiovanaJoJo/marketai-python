# MarketAI API Documentation

## 🔑 Аутентификация

### Регистрация

```http
POST /api/auth/register/
```

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "first_name": "Имя",
  "last_name": "Фамилия",
  "password": "securepassword123",
  "password_confirm": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Вход

```http
POST /api/auth/login/
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {...},
  "access": "...",
  "refresh": "..."
}
```

### Текущий пользователь

```http
GET /api/auth/me/
Authorization: Bearer {access_token}
```

### Выход

```http
POST /api/auth/logout/
Authorization: Bearer {access_token}
```

## 🎯 Кампании

### Список кампаний

```http
GET /api/campaigns/
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `marketplace`: Фильтр по маркетплейсу
- `status`: Фильтр по статусу
- `search`: Поиск по названию
- `ordering`: Сортировка

### Создание кампании

```http
POST /api/campaigns/
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "name": "Название кампании",
  "description": "Описание",
  "marketplace": "wildberries",
  "status": "active",
  "budget": "50000.00",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

### Детали кампании

```http
GET /api/campaigns/{id}/
Authorization: Bearer {access_token}
```

### Обновление кампании

```http
PATCH /api/campaigns/{id}/
Authorization: Bearer {access_token}
```

### Удаление кампании

```http
DELETE /api/campaigns/{id}/
Authorization: Bearer {access_token}
```

### Активация кампании

```http
POST /api/campaigns/{id}/activate/
Authorization: Bearer {access_token}
```

## 📊 Статистика

### Финансовый отчет

```http
GET /api/statistics/financial-report/?start_date=2025-01-01&end_date=2025-12-31
Authorization: Bearer {access_token}
```

### Статистика дашборда

```http
GET /api/statistics/dashboard/
Authorization: Bearer {access_token}
```

### Производительность кампании

```http
GET /api/statistics/campaign/{campaign_id}/performance/
Authorization: Bearer {access_token}
```

## 🔗 Интеграции

### Синхронизация с Wildberries

```http
POST /api/integrations/wildberries/sync/
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "api_key": "wb_api_key_optional"
}
```

### Синхронизация статистики

```http
POST /api/integrations/wildberries/sync/statistics/
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "campaign_id": 1,
  "date_from": "2025-01-01",
  "date_to": "2025-01-31"
}
```

### Тест подключения

```http
GET /api/integrations/wildberries/test/
Authorization: Bearer {access_token}
```

## 📋 Пагинация

Все списковые эндпоинты поддерживают пагинацию:

```json
{
  "count": 100,
  "next": "http://api.example.com/api/campaigns/?page=2",
  "previous": null,
  "results": [...]
}
```

## 🚫 Обработка ошибок

Все ошибки возвращаются в едином формате:

```json
{
  "error": true,
  "message": "Описание ошибки",
  "detail": {...},
  "status_code": 400
}
```

## 🔍 Полная документация

Интерактивная API документация:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

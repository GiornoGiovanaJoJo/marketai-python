# Django REST Framework Response Formats

Документация по форматам ответов Django REST Framework для frontend разработчиков.

## 📋 Общие принципы

### 1. Content-Type
Все ответы возвращаются в формате JSON:
```
Content-Type: application/json
```

### 2. HTTP Status Codes

| Code | Значение | Когда используется |
|------|----------|--------------------|
| 200 | OK | Успешный GET/PUT/PATCH |
| 201 | Created | Успешный POST (создание) |
| 204 | No Content | Успешный DELETE |
| 400 | Bad Request | Ошибки валидации |
| 401 | Unauthorized | Не авторизован |
| 403 | Forbidden | Нет прав доступа |
| 404 | Not Found | Ресурс не найден |
| 500 | Server Error | Внутренняя ошибка сервера |

---

## ✅ Success Responses

### Single Object Response

**Example: GET /api/campaigns/1/**
```json
{
  "id": 1,
  "name": "Summer Sale 2024",
  "status": "active",
  "budget": "50000.00",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z"
}
```

### List Response (Non-Paginated)

**Example: GET /api/campaigns/** (если пагинация отключена)
```json
[
  {
    "id": 1,
    "name": "Campaign 1",
    "status": "active"
  },
  {
    "id": 2,
    "name": "Campaign 2",
    "status": "paused"
  }
]
```

### Paginated List Response

**Example: GET /api/campaigns/?page=1&page_size=10**
```json
{
  "count": 42,
  "next": "http://localhost:8000/api/campaigns/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Campaign 1",
      "status": "active"
    },
    {
      "id": 2,
      "name": "Campaign 2",
      "status": "paused"
    }
  ]
}
```

**Поля пагинации:**
- `count` - Общее количество объектов
- `next` - URL следующей страницы (null если последняя)
- `previous` - URL предыдущей страницы (null если первая)
- `results` - Массив объектов на текущей странице

### Create Response (201 Created)

**Example: POST /api/campaigns/**
```json
{
  "id": 3,
  "name": "New Campaign",
  "status": "draft",
  "budget": "10000.00",
  "created_at": "2024-01-21T09:00:00Z",
  "updated_at": "2024-01-21T09:00:00Z"
}
```

### Delete Response (204 No Content)

**Example: DELETE /api/campaigns/1/**

Ответ пустой (no body), только HTTP status 204.

---

## ❌ Error Responses

### Validation Errors (400 Bad Request)

**Field-level errors:**
```json
{
  "email": [
    "This field is required."
  ],
  "password": [
    "This field may not be blank.",
    "Ensure this field has at least 8 characters."
  ]
}
```

**Non-field errors:**
```json
{
  "non_field_errors": [
    "The fields email and username must make a unique set."
  ]
}
```

**Frontend handling:**
```typescript
if (error.response?.status === 400) {
  const errors = error.response.data
  
  // Field errors
  Object.keys(errors).forEach(field => {
    if (field !== 'non_field_errors') {
      // Show error for specific field
      console.log(`${field}: ${errors[field].join(', ')}`)
    }
  })
  
  // Non-field errors
  if (errors.non_field_errors) {
    console.log(errors.non_field_errors.join(', '))
  }
}
```

### Authentication Errors (401 Unauthorized)

**Missing token:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Invalid token:**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

**Frontend handling:**
```typescript
if (error.response?.status === 401) {
  // Token expired, try refresh
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    try {
      const { access } = await refreshAccessToken(refreshToken)
      // Retry original request
    } catch {
      // Refresh failed, logout user
      logout()
    }
  }
}
```

### Permission Errors (403 Forbidden)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### Not Found Errors (404 Not Found)

```json
{
  "detail": "Not found."
}
```

### Server Errors (500 Internal Server Error)

```json
{
  "detail": "A server error occurred."
}
```

---

## 🔐 Authentication Response

### Login/Register Success

**POST /api/auth/login/** или **POST /api/auth/register/**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2MzU4MDAwLCJqdGkiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MX0.abc123",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwNjQ0NDQwMCwianRpIjoiMDk4NzY1NDMyMSIsInVzZXJfaWQiOjF9.xyz789",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "date_joined": "2024-01-15T10:30:00Z"
  }
}
```

**Token lifetimes:**
- `access` - 5 минут (300 секунд)
- `refresh` - 1 день (86400 секунд)

### Token Refresh

**POST /api/auth/token/refresh/**

Request:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Current User

**GET /api/auth/me/**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "date_joined": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-21T09:00:00Z"
}
```

---

## 📊 Statistics Response Formats

### Dashboard Stats

**GET /api/statistics/dashboard/**
```json
{
  "total_campaigns": 42,
  "active_campaigns": 15,
  "paused_campaigns": 10,
  "total_revenue": "125000.50",
  "total_spend": "85000.00",
  "roi": 1.47,
  "avg_ctr": 2.35,
  "total_clicks": 15234,
  "total_views": 648000
}
```

### Campaign Performance

**GET /api/statistics/campaigns/1/performance/**
```json
{
  "campaign_id": 1,
  "campaign_name": "Summer Sale 2024",
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": {
    "revenue": "15000.00",
    "spend": "10000.00",
    "profit": "5000.00",
    "roi": 1.5,
    "clicks": 1250,
    "views": 50000,
    "ctr": 2.5,
    "conversions": 125,
    "conversion_rate": 10.0
  },
  "trends": {
    "revenue_change": "+15.5%",
    "clicks_change": "+8.2%",
    "ctr_change": "-2.1%"
  }
}
```

### Chart Data

**GET /api/statistics/campaigns/1/chart/?period=day**
```json
{
  "labels": [
    "2024-01-01",
    "2024-01-02",
    "2024-01-03"
  ],
  "datasets": [
    {
      "label": "Views",
      "data": [1500, 1800, 2100]
    },
    {
      "label": "Clicks",
      "data": [45, 52, 63]
    },
    {
      "label": "Conversions",
      "data": [5, 7, 8]
    }
  ]
}
```

---

## 🔄 Frontend Utils

### Generic Error Handler

```typescript
export function handleApiError(error: any): string {
  if (error.response) {
    const { status, data } = error.response
    
    if (status === 400) {
      // Validation errors
      const messages = Object.entries(data)
        .map(([field, errors]: [string, any]) => {
          if (field === 'non_field_errors') {
            return errors.join(', ')
          }
          return `${field}: ${errors.join(', ')}`
        })
      return messages.join('\n')
    }
    
    if (status === 401) {
      return 'Unauthorized. Please login again.'
    }
    
    if (status === 403) {
      return 'You do not have permission for this action.'
    }
    
    if (status === 404) {
      return 'Resource not found.'
    }
    
    if (data.detail) {
      return data.detail
    }
  }
  
  return 'An unexpected error occurred.'
}
```

### Pagination Helper

```typescript
export function extractResults<T>(response: T[] | { results: T[] }): T[] {
  return Array.isArray(response) ? response : response.results
}

export function isPaginated<T>(response: any): response is { results: T[] } {
  return response && typeof response === 'object' && 'results' in response
}
```

### Usage in Service

```typescript
async getAll(): Promise<Campaign[]> {
  const response = await api.get('/campaigns/')
  return extractResults(response.data)
}
```

---

## 📝 Date/Time Formats

Все даты возвращаются в формате **ISO 8601**:

```
2024-01-21T09:00:00Z        # UTC
2024-01-21T12:00:00+03:00   # С timezone
```

**Frontend parsing:**
```typescript
import { parseISO, format } from 'date-fns'

const dateStr = '2024-01-21T09:00:00Z'
const date = parseISO(dateStr)
const formatted = format(date, 'dd.MM.yyyy HH:mm')
// Output: 21.01.2024 09:00
```

---

## 🧪 Testing with curl

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get campaigns with auth
curl -X GET http://localhost:8000/api/campaigns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create campaign
curl -X POST http://localhost:8000/api/campaigns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","budget":"5000.00","status":"draft"}'
```

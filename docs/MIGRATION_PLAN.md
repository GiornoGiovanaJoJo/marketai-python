# 📋 План миграции MarketAI: Laravel → Django 5.1

Дата начала: 23 ноября 2025
Статус: В процессе

## 🎯 Цель
Полная миграция backend с PHP Laravel на Python Django 5.1 + интеграция React frontend в единый репозиторий.

---

## 📊 Текущее состояние

### ✅ Выполнено
- [x] Создана базовая структура Django проекта
- [x] Настроен Docker-compose (PostgreSQL, Redis)
- [x] Созданы Django apps: authentication, campaigns, integrations, statistics, users
- [x] Базовая конфигурация settings.py

### 🔄 В работе
- [ ] Миграция моделей
- [ ] Миграция API endpoints
- [ ] Интеграция frontend

---

## 📦 Этап 1: Миграция моделей (Backend)

### 1.1 User Model
**Laravel → Django**

**Файл:** `backend/apps/users/models.py`

```python
# Поля для миграции из Laravel:
# - name: string
# - email: string (unique)
# - password: hashed
# - phone: string (nullable)
# - email_verified_at: datetime (nullable)
# - phone_verified_at: datetime (nullable)
# - remember_token: string (nullable)

# Django реализация:
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    phone_verified_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'users'
```

### 1.2 Campaign Model
**Файл:** `backend/apps/campaigns/models.py`

```python
# Поля из Laravel:
# - user_id: foreignKey
# - name: string
# - key: string
# - status: enum (CampaignStatus)
# - marketplace: enum (Marketplace)

from django.db import models
from django.conf import settings

class CampaignStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    PAUSED = 'paused', 'Paused'
    COMPLETED = 'completed', 'Completed'

class Marketplace(models.TextChoices):
    WILDBERRIES = 'wildberries', 'Wildberries'
    OZON = 'ozon', 'Ozon'
    YANDEX_MARKET = 'yandex_market', 'Yandex Market'

class Campaign(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='campaigns'
    )
    name = models.CharField(max_length=255)
    key = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=CampaignStatus.choices,
        default=CampaignStatus.ACTIVE
    )
    marketplace = models.CharField(
        max_length=50,
        choices=Marketplace.choices
    )
    
    class Meta:
        db_table = 'campaigns'
```

### 1.3 Миграции Django
**Команды:**
```bash
cd backend
python manage.py makemigrations users
python manage.py makemigrations campaigns
python manage.py migrate
```

---

## 🔌 Этап 2: API Endpoints (Django REST Framework)

### 2.1 Authentication API
**Файл:** `backend/apps/authentication/views.py`

**Endpoints:**
- `POST /api/auth/register` → RegisterView
- `POST /api/auth/login` → LoginView  
- `GET /api/auth/me` → MeView
- `POST /api/auth/logout` → LogoutView

**Зависимости:**
```python
# requirements.txt
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
```

**Serializers:**
```python
# backend/apps/authentication/serializers.py
from rest_framework import serializers
from apps.users.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'password']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'email_verified_at']
```

### 2.2 Campaigns API
**Файл:** `backend/apps/campaigns/views.py`

**Endpoints:**
- `GET /api/campaigns/` → CampaignListView
- `POST /api/campaigns/` → CampaignCreateView
- `GET /api/campaigns/{id}/` → CampaignDetailView
- `PUT /api/campaigns/{id}/` → CampaignUpdateView
- `DELETE /api/campaigns/{id}/` → CampaignDeleteView

**ViewSet:**
```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class CampaignViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)
```

### 2.3 Statistics API
**Файл:** `backend/apps/statistics/views.py`

**Endpoints:**
- `GET /api/statistics/financial-report` → FinancialReportView

### 2.4 Users API
**Файл:** `backend/apps/users/views.py`

**Endpoints:**
- `GET /api/users/` → UserListView

---

## 🎨 Этап 3: Интеграция Frontend

### 3.1 Структура директорий
```
marketai-python/
├── backend/          # Django
│   ├── apps/
│   ├── core/
│   └── manage.py
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── store/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

### 3.2 Миграция React компонентов

**Скопировать из marketai-front:**
- ✅ `src/components/` → `frontend/src/components/`
- ✅ `src/pages/` → `frontend/src/pages/`
- ✅ `src/services/` → `frontend/src/services/`
- ✅ `src/hooks/` → `frontend/src/hooks/`
- ✅ `src/contexts/` → `frontend/src/contexts/`
- ✅ `src/store/` → `frontend/src/store/`
- ✅ `src/types/` → `frontend/src/types/`

### 3.3 Обновление конфигурации

**Frontend package.json:**
```json
{
  "name": "marketai-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.0"
  }
}
```

**Vite proxy для API:**
```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🐳 Этап 4: Docker Configuration

### 4.1 Обновленный docker-compose.yml

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: marketai
      POSTGRES_USER: marketai
      POSTGRES_PASSWORD: marketai_secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Django Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://marketai:marketai_secret@db:5432/marketai
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    command: npm run dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4.2 Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

---

## 🔧 Этап 5: Services & Business Logic

### 5.1 AuthService (Django)
**Файл:** `backend/apps/authentication/services.py`

```python
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class AuthService:
    @staticmethod
    def register(validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('name', '')
        )
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        }
    
    @staticmethod
    def login(email, password):
        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return {
                'user': user,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            }
        return None
```

### 5.2 CampaignService (Django)
**Файл:** `backend/apps/campaigns/services.py`

```python
from django.db import transaction
from .models import Campaign
from .signals import campaign_created, campaign_deleted

class CampaignService:
    @staticmethod
    @transaction.atomic
    def create_campaign(user, validated_data):
        campaign = Campaign.objects.create(
            user=user,
            **validated_data
        )
        campaign_created.send(sender=Campaign, instance=campaign)
        return campaign
    
    @staticmethod
    @transaction.atomic
    def delete_campaign(campaign):
        campaign_deleted.send(sender=Campaign, instance=campaign)
        campaign.delete()
```

---

## 📱 Этап 6: Frontend Services

### 6.1 API Client
**Файл:** `frontend/src/services/api.ts`

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor для JWT токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### 6.2 Auth Service
**Файл:** `frontend/src/services/authService.ts`

```typescript
import api from './api'

export interface RegisterData {
  email: string
  name: string
  password: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/api/auth/register', data)
    localStorage.setItem('access_token', response.data.token)
    return response.data
  },
  
  login: async (data: LoginData) => {
    const response = await api.post('/api/auth/login', data)
    localStorage.setItem('access_token', response.data.token)
    return response.data
  },
  
  logout: async () => {
    await api.post('/api/auth/logout')
    localStorage.removeItem('access_token')
  },
  
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}
```

### 6.3 Campaign Service
**Файл:** `frontend/src/services/campaignService.ts`

```typescript
import api from './api'

export interface Campaign {
  id: number
  name: string
  key: string
  status: 'active' | 'paused' | 'completed'
  marketplace: 'wildberries' | 'ozon' | 'yandex_market'
}

export const campaignService = {
  getAll: async () => {
    const response = await api.get<Campaign[]>('/api/campaigns/')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get<Campaign>(`/api/campaigns/${id}/`)
    return response.data
  },
  
  create: async (data: Omit<Campaign, 'id'>) => {
    const response = await api.post<Campaign>('/api/campaigns/', data)
    return response.data
  },
  
  update: async (id: number, data: Partial<Campaign>) => {
    const response = await api.put<Campaign>(`/api/campaigns/${id}/`, data)
    return response.data
  },
  
  delete: async (id: number) => {
    await api.delete(`/api/campaigns/${id}/`)
  },
}
```

---

## ✅ Чеклист миграции

### Backend
- [ ] Модели Django
  - [ ] User model
  - [ ] Campaign model
  - [ ] Миграции БД
- [ ] API Endpoints
  - [ ] Authentication API
  - [ ] Campaigns API
  - [ ] Statistics API
  - [ ] Users API
- [ ] Services
  - [ ] AuthService
  - [ ] CampaignService
- [ ] Tests
  - [ ] Unit tests
  - [ ] Integration tests

### Frontend
- [ ] Копирование кода
  - [ ] Components
  - [ ] Pages
  - [ ] Services
  - [ ] Hooks
  - [ ] Contexts
  - [ ] Store
- [ ] Конфигурация
  - [ ] package.json
  - [ ] vite.config.ts
  - [ ] Dockerfile
- [ ] Интеграция с Django API
  - [ ] API client
  - [ ] Auth service
  - [ ] Campaign service

### Инфраструктура
- [ ] Docker
  - [ ] Backend Dockerfile
  - [ ] Frontend Dockerfile
  - [ ] docker-compose.yml
- [ ] CI/CD
  - [ ] GitHub Actions
  - [ ] Tests automation

---

## 🚀 Запуск проекта

### Локальная разработка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# 2. Копировать .env файлы
cp .env.example .env

# 3. Запустить Docker Compose
docker-compose up -d

# 4. Применить миграции
docker-compose exec backend python manage.py migrate

# 5. Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser

# 6. Открыть в браузере
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
# Admin: http://localhost:8000/admin
```

---

## 📝 Примечания

### Различия Laravel vs Django

| Аспект | Laravel (PHP) | Django (Python) |
|--------|--------------|------------------|
| ORM | Eloquent | Django ORM |
| Миграции | Artisan | manage.py |
| Routing | routes/api.php | urls.py |
| Views | Controllers | Views/ViewSets |
| Auth | Sanctum | JWT / Session |
| Validation | FormRequest | Serializers |
| Events | Events/Listeners | Signals |

### Рекомендации

1. **Использовать Django REST Framework** для API
2. **JWT токены** вместо Sanctum
3. **Signals** вместо Events/Listeners
4. **Serializers** вместо Resources
5. **ViewSets** для CRUD операций

---

## 🤝 Контакты

При возникновении вопросов:
- GitHub Issues: [marketai-python/issues](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)
- Email: support@marketai.com

---

**Дата последнего обновления:** 23.11.2025

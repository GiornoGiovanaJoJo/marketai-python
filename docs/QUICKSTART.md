# 🚀 Быстрый старт MarketAI

Дата обновления: 23 ноября 2025

## ✅ Текущее состояние проекта

### ✅ Backend (Django 5.1) - ПОЛНОСТЬЮ ГОТОВ

**Модели:**
- ✅ User (CustomUser с email/phone)
- ✅ Campaign (с полем key для интеграции)

**API Endpoints:**
- ✅ Authentication API
  - `POST /api/auth/register` - регистрация
  - `POST /api/auth/login` - вход (JWT)
  - `GET /api/auth/me` - текущий пользователь
  - `POST /api/auth/logout` - выход
  - `POST /api/auth/token/refresh` - обновление токена

- ✅ Campaigns API (CRUD)
  - `GET /api/campaigns/` - список
  - `POST /api/campaigns/` - создать
  - `GET /api/campaigns/{id}/` - получить
  - `PUT /api/campaigns/{id}/` - обновить
  - `DELETE /api/campaigns/{id}/` - удалить
  - `POST /api/campaigns/{id}/activate/` - активировать
  - `POST /api/campaigns/{id}/pause/` - приостановить
  - `POST /api/campaigns/{id}/archive/` - архивировать

**Настроено:**
- ✅ Django REST Framework
- ✅ JWT Authentication (simplejwt)
- ✅ CORS (для frontend)
- ✅ Swagger/OpenAPI документация
- ✅ PostgreSQL база данных
- ✅ Redis кеширование
- ✅ Celery для задач

### ⚠️ Frontend - ТРЕБУЕТСЯ ПЕРЕНОС

Директория `frontend/` ещё не создана. 
Нужно скопировать код из `marketai-front`.

---

## 🛠️ Требования

### Для локальной разработки:
- Python 3.11+
- PostgreSQL 16+
- Redis 7+
- Node.js 20+ (для frontend)

### Для Docker:
- Docker 24+
- Docker Compose 2.20+

---

## 🚀 Запуск с Docker (Рекомендуется)

### Шаг 1: Клонировать репозиторий

```bash
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
```

### Шаг 2: Копировать .env файл

```bash
cp .env.example .env
```

**Отредактируйте `.env` при необходимости:**
```env
# Основные настройки
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# База данных
DB_NAME=marketai
DB_USER=marketai
DB_PASSWORD=marketai_secret
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# CORS
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Шаг 3: Запустить Docker Compose

```bash
docker-compose up -d
```

Это запустит:
- PostgreSQL базу данных (порт 5432)
- Redis кеш (порт 6379)
- Django backend (порт 8000)

### Шаг 4: Применить миграции

```bash
# Применить миграции
docker-compose exec backend python manage.py migrate

# Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser
```

### Шаг 5: Открыть в браузере

- **API Backend**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Admin Panel**: http://localhost:8000/admin/

---

## 💻 Локальная разработка (без Docker)

### Шаг 1: Установить зависимости

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установить пакеты
pip install -r requirements.txt
```

### Шаг 2: Настроить PostgreSQL и Redis

Убедитесь, что у вас запущены:
- PostgreSQL на порту 5432
- Redis на порту 6379

Создайте базу данных:
```bash
psql -U postgres
CREATE DATABASE marketai;
CREATE USER marketai WITH PASSWORD 'marketai_secret';
GRANT ALL PRIVILEGES ON DATABASE marketai TO marketai;
\q
```

### Шаг 3: Применить миграции

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### Шаг 4: Запустить сервер

```bash
python manage.py runserver
```

Сервер запустится на: http://localhost:8000

---

## 📡 Тестирование API

### Через Swagger UI

Откройте в браузере: http://localhost:8000/api/docs/

### Через curl

**1. Регистрация:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "securepass123",
    "password_confirm": "securepass123"
  }'
```

**2. Вход:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

**Сохраните `access` токен из ответа!**

**3. Получить текущего пользователя:**
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**4. Создать кампанию:**
```bash
curl -X POST http://localhost:8000/api/campaigns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тестовая кампания",
    "key": "test-api-key-123",
    "marketplace": "wildberries",
    "status": "active",
    "budget": "100000.00"
  }'
```

**5. Получить список кампаний:**
```bash
curl -X GET http://localhost:8000/api/campaigns/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Следующие шаги

### 1. Перенос Frontend

```bash
# Скопировать код из marketai-front
cp -r ../marketai-front/* ./frontend/

# Установить зависимости
cd frontend
npm install

# Запустить
npm run dev
```

Frontend будет доступен на: http://localhost:5173

### 2. Интеграции

Реализовать интеграции с маркетплейсами:
- Wildberries API
- Ozon API
- Yandex.Market API

### 3. Statistics API

Создать эндпоинты для статистики:
- `GET /api/statistics/financial-report`
- `GET /api/statistics/dashboard`

---

## 🔧 Полезные команды

### Django Management

```bash
# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Собрать статику
python manage.py collectstatic

# Запустить шелл
python manage.py shell

# Запустить тесты
python manage.py test
```

### Docker

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Пересобрать
docker-compose build

# Посмотреть логи
docker-compose logs -f backend

# Выполнить команду в контейнере
docker-compose exec backend python manage.py migrate
```

---

## 📚 Документация

- **План миграции**: [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- **API документация**: http://localhost:8000/api/docs/
- **README**: [../README.md](../README.md)

---

## ❓ Вопросы и проблемы

Если возникли вопросы:

1. Проверьте логи: `docker-compose logs -f backend`
2. Убедитесь, что PostgreSQL и Redis запущены
3. Проверьте `.env` файл
4. Перезапустите контейнеры: `docker-compose restart`

---

**Дата обновления:** 23.11.2025 01:27 MSK

# MarketAI Backend Setup & Migration Guide

## 📋 Обзор миграции из Laravel в Django

### ✅ Завершенные компоненты

#### 1. Statistics API (100%)
- ✅ Модели:
  - `CampaignStatistic` - детальная статистика по кампаниям
  - `ProductStatistic` - статистика по товарам
  - `DailyUserStatistic` - агрегированная статистика пользователей
- ✅ 11 сериализаторов для всех сценариев использования
- ✅ ViewSets + 7 function-based views для REST API
- ✅ Расширенный StatisticsService с методами:
  - `get_financial_report()` - финансовый отчет
  - `get_campaign_detailed_stats()` - детальная статистика кампании
  - `get_campaign_chart_data()` - данные для графиков
  - `get_top_products()` - топ товаров
  - `aggregate_daily_user_stats()` - ежедневная агрегация
- ✅ Django Admin для управления данными

#### 2. Wildberries Integration (100%)
- ✅ Модели:
  - `WildberriesAccount` - аккаунты WB с шифрованными API ключами
  - `WildberriesSyncLog` - логи синхронизации
- ✅ WildberriesAPIClient - клиент API WB
- ✅ WildberriesService - бизнес-логика интеграции
- ✅ Celery Tasks:
  - `sync_wildberries_data` - полная синхронизация (каждый час)
  - `sync_wildberries_account` - синхронизация аккаунта
  - `sync_wildberries_campaigns` - синхронизация кампаний
  - `sync_wildberries_statistics` - синхронизация статистики
  - `cleanup_old_sync_logs` - очистка старых логов

#### 3. Celery + Periodic Tasks (100%)
- ✅ Celery конфигурация с Redis и RabbitMQ
- ✅ Celery Beat для периодических задач:
  - Синхронизация WB каждый час (00:00)
  - Генерация статистики каждый день (00:00)
  - Еженедельные отчеты по понедельникам (09:00)
  - Очистка старых данных ежемесячно
- ✅ Docker Compose с celery_worker и celery_beat

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=marketai
DB_USER=marketai
DB_PASSWORD=marketai
DB_HOST=postgres
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# Celery
CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//
CELERY_RESULT_BACKEND=redis://redis:6379/1

# Wildberries
WILDBERRIES_API_KEY=your-wb-api-key
WILDBERRIES_API_URL=https://advert-api.wildberries.ru

# Encryption (для шифрования API ключей)
FIELD_ENCRYPTION_KEY=generate-with-python-cryptography-fernet
```

### 3. Генерация ключа шифрования

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Скопируйте вывод в `FIELD_ENCRYPTION_KEY`.

### 4. Запуск с Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Проверка логов
docker-compose logs -f backend
docker-compose logs -f celery_worker
docker-compose logs -f celery_beat
```

### 5. Создание миграций БД

```bash
# Войти в контейнер backend
docker-compose exec backend bash

# Создать миграции для новых моделей
python manage.py makemigrations statistics
python manage.py makemigrations integrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser
```

### 6. Проверка работы

- **Backend API**: http://localhost:8000/api/
- **Swagger Docs**: http://localhost:8000/api/schema/swagger-ui/
- **Django Admin**: http://localhost:8000/admin/
- **RabbitMQ Management**: http://localhost:15672/ (guest/guest)
- **Frontend**: http://localhost:3000/

---

## 📊 API Endpoints

### Statistics

```
GET  /api/statistics/dashboard/
GET  /api/statistics/financial-report/?start_date=2024-01-01&end_date=2024-12-31
GET  /api/statistics/campaigns/{id}/performance/
GET  /api/statistics/campaigns/{id}/detailed/?start_date=2024-01-01
GET  /api/statistics/campaigns/{id}/chart/?start_date=2024-01-01
GET  /api/statistics/campaigns/{id}/top-products/
GET  /api/statistics/top-products/?limit=10

# ViewSets
GET  /api/statistics/campaign-statistics/
GET  /api/statistics/product-statistics/
GET  /api/statistics/daily-user-statistics/
```

### Integrations

```
GET  /api/integrations/wildberries/accounts/
POST /api/integrations/wildberries/accounts/
POST /api/integrations/wildberries/accounts/{id}/sync/
GET  /api/integrations/wildberries/sync-logs/
```

---

## 🔧 Celery Tasks - Ручной запуск

### Через Django shell

```bash
docker-compose exec backend python manage.py shell
```

```python
from apps.integrations.tasks import sync_wildberries_account
from apps.statistics.tasks import aggregate_user_daily_stats

# Синхронизация конкретного аккаунта WB
result = sync_wildberries_account.delay(account_id=1)
print(result.get())

# Агрегация статистики пользователя
result = aggregate_user_daily_stats.delay(user_id=1, date_str='2024-11-22')
print(result.get())
```

### Через CLI

```bash
# Запуск задачи синхронизации
docker-compose exec backend celery -A core call apps.integrations.tasks.sync_wildberries_data

# Проверка активных задач
docker-compose exec celery_worker celery -A core inspect active

# Проверка расписания
docker-compose exec celery_beat celery -A core inspect scheduled
```

---

## 📁 Структура базы данных

### Новые таблицы

```sql
-- Statistics
campaign_statistics       (детальная статистика кампаний)
product_statistics        (статистика товаров)
daily_user_statistics     (агрегированная статистика)

-- Integrations
wildberries_accounts      (аккаунты WB)
wildberries_sync_logs     (логи синхронизации)
```

### Индексы (автоматически созданы)

```sql
-- campaign_statistics
INDEX (campaign_id, date)
INDEX (date)
INDEX (campaign_id, -date)

-- product_statistics
INDEX (campaign_id, date)
INDEX (product_id, date)
INDEX (campaign_id, -revenue)

-- daily_user_statistics
INDEX (user_id, date)
INDEX (date)

-- wildberries_accounts
INDEX (user_id, is_active)
INDEX (is_active, auto_sync_enabled)

-- wildberries_sync_logs
INDEX (account_id, status)
INDEX (status, started_at)
INDEX (sync_type, status)
```

---

## 🧪 Тестирование

```bash
# Запуск всех тестов
docker-compose exec backend pytest

# Тестирование конкретного модуля
docker-compose exec backend pytest apps/statistics/tests/

# С coverage
docker-compose exec backend pytest --cov=apps --cov-report=html
```

---

## 🔍 Мониторинг

### Проверка состояния Celery

```bash
# Статус воркеров
docker-compose exec celery_worker celery -A core inspect stats

# Активные задачи
docker-compose exec celery_worker celery -A core inspect active

# Зарегистрированные задачи
docker-compose exec celery_worker celery -A core inspect registered
```

### Логи

```bash
# Backend логи
docker-compose logs -f backend

# Celery worker логи
docker-compose logs -f celery_worker

# Celery beat логи
docker-compose logs -f celery_beat

# PostgreSQL логи
docker-compose logs -f postgres
```

---

## 🚨 Troubleshooting

### Проблема: Celery не видит задачи

```bash
# Перезапуск Celery
docker-compose restart celery_worker celery_beat

# Проверка autodiscover
docker-compose exec backend python -c "from core.celery import app; print(app.tasks.keys())"
```

### Проблема: Миграции не применяются

```bash
# Проверка состояния миграций
docker-compose exec backend python manage.py showmigrations

# Откат миграции
docker-compose exec backend python manage.py migrate statistics zero

# Повторное применение
docker-compose exec backend python manage.py migrate statistics
```

### Проблема: Redis connection error

```bash
# Проверка Redis
docker-compose exec redis redis-cli ping

# Проверка подключения из backend
docker-compose exec backend python -c "import redis; r = redis.from_url('redis://redis:6379/0'); print(r.ping())"
```

---

## 📚 Дополнительная документация

- [API Schema (Swagger)](http://localhost:8000/api/schema/swagger-ui/)
- [Django Admin](http://localhost:8000/admin/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [DRF Documentation](https://www.django-rest-framework.org/)

---

## 🎯 Следующие шаги

1. ✅ Backend на 100% - ГОТОВО!
2. ⏳ Frontend интеграция - следующий этап
3. ⏳ Тесты покрытие
4. ⏳ CI/CD настройка
5. ⏳ Production deployment

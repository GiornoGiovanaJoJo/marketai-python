# MarketAI - Быстрый старт через Docker

## 🚀 Запуск за 3 шага

### 1️⃣ Подготовка окружения

```bash
# Клонируйте репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# Скопируйте пример конфигурации
cp .env.example .env
```

### 2️⃣ Настройка переменных окружения

Откройте `.env` и обновите необходимые значения:

```env
# Django Secret Key (обязательно изменить!)
DJANGO_SECRET_KEY=your-very-secret-key-min-50-chars-change-this-in-production

# Field Encryption Key
# Сгенерируйте с помощью:
# python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FIELD_ENCRYPTION_KEY=your-fernet-encryption-key-here

# JWT Secret Key
JWT_SECRET_KEY=your-jwt-secret-key-change-this-too

# Wildberries API (опционально для тестирования)
WILDBERRIES_API_KEY=your-wildberries-api-key
```

### 3️⃣ Запуск Docker Compose

```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Или в фоновом режиме:
docker-compose up --build -d
```

## 🎯 Доступ к сервисам

После запуска сервисы будут доступны по адресам:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/api/schema/swagger-ui/
- **API Documentation (Redoc)**: http://localhost:8000/api/schema/redoc/
- **Django Admin**: http://localhost:8000/admin/
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 📝 Первоначальная настройка

### Создание суперпользователя Django

```bash
# Войдите в контейнер backend
docker-compose exec backend bash

# Создайте суперпользователя
python manage.py createsuperuser

# Выйдите из контейнера
exit
```

### Применение миграций вручную (если нужно)

```bash
docker-compose exec backend python manage.py migrate
```

### Сбор статических файлов

```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

## 🔍 Проверка работы сервисов

### Проверка статуса контейнеров

```bash
docker-compose ps
```

Все контейнеры должны быть в статусе `Up`.

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend

# Только база данных
docker-compose logs -f postgres
```

### Проверка healthcheck

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U marketai

# Redis
docker-compose exec redis redis-cli ping

# RabbitMQ
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

## 🧪 Тестирование API

### Регистрация пользователя

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Получение токенов JWT

Ответ будет содержать:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Проверка аутентифицированного запроса

```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ Полезные команды

### Управление контейнерами

```bash
# Остановить все сервисы
docker-compose stop

# Запустить остановленные сервисы
docker-compose start

# Перезапустить сервисы
docker-compose restart

# Остановить и удалить контейнеры
docker-compose down

# Остановить и удалить контейнеры + volumes
docker-compose down -v
```

### Django команды

```bash
# Выполнение manage.py команд
docker-compose exec backend python manage.py <command>

# Примеры:
docker-compose exec backend python manage.py showmigrations
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py test
```

### База данных

```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U marketai -d marketai

# Резервное копирование
docker-compose exec postgres pg_dump -U marketai marketai > backup.sql

# Восстановление
cat backup.sql | docker-compose exec -T postgres psql -U marketai -d marketai
```

### Celery

```bash
# Проверка активных задач
docker-compose exec celery_worker celery -A core inspect active

# Проверка запланированных задач
docker-compose exec celery_beat celery -A core inspect scheduled

# Список зарегистрированных задач
docker-compose exec celery_worker celery -A core inspect registered
```

## 🐛 Отладка

### Проблема: Контейнер backend не запускается

```bash
# Проверьте логи
docker-compose logs backend

# Проверьте зависимости
docker-compose exec backend pip list

# Пересоберите образ
docker-compose build --no-cache backend
```

### Проблема: Frontend не подключается к backend

1. Проверьте переменные окружения в `docker-compose.yml`:
   ```yaml
   environment:
     - VITE_API_URL=http://localhost:8000/api
   ```

2. Проверьте CORS настройки в `.env`:
   ```env
   DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

### Проблема: База данных не готова

```bash
# Проверьте healthcheck
docker-compose exec postgres pg_isready -U marketai

# Проверьте логи PostgreSQL
docker-compose logs postgres

# Пересоздайте volume
docker-compose down -v
docker-compose up --build
```

### Проблема: Celery задачи не выполняются

```bash
# Проверьте статус worker
docker-compose logs celery_worker

# Проверьте подключение к Redis
docker-compose exec redis redis-cli ping

# Перезапустите Celery
docker-compose restart celery_worker celery_beat
```

## 📊 Мониторинг

### Проверка использования ресурсов

```bash
# Статистика контейнеров
docker stats

# Использование дискового пространства
docker system df
```

### Очистка неиспользуемых ресурсов

```bash
# Удалить остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune

# Удалить неиспользуемые volumes
docker volume prune

# Полная очистка (осторожно!)
docker system prune -a --volumes
```

## 🔐 Безопасность для production

**⚠️ Перед деплоем в production обязательно:**

1. Измените все секретные ключи:
   - `DJANGO_SECRET_KEY`
   - `FIELD_ENCRYPTION_KEY`
   - `JWT_SECRET_KEY`
   - Пароли БД и RabbitMQ

2. Установите `DJANGO_DEBUG=False`

3. Настройте правильные `DJANGO_ALLOWED_HOSTS`

4. Используйте production WSGI сервер (Gunicorn уже настроен)

5. Настройте SSL/TLS сертификаты

6. Используйте secrets management (например, Docker secrets или Vault)

## 📚 Дополнительная документация

- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Подробное руководство по Docker
- [CONTRIBUTING.md](CONTRIBUTING.md) - Руководство по разработке
- [FRONTEND_MIGRATION_PLAN.md](FRONTEND_MIGRATION_PLAN.md) - План миграции фронтенда

## ❓ Получение помощи

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker-compose ps`
3. Проверьте healthcheck сервисов
4. Откройте issue в GitHub

## 🎉 Готово!

Теперь у вас запущено полное окружение MarketAI:
- ✅ Django backend с API
- ✅ React frontend
- ✅ PostgreSQL база данных
- ✅ Redis для кеширования
- ✅ RabbitMQ для очередей сообщений
- ✅ Celery для фоновых задач
- ✅ DuckDB для аналитики

Приятной работы! 🚀

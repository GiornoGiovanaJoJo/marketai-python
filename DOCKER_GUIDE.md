# 🐳 Docker Guide - MarketAI Python

## 🚀 Быстрый старт для локального тестирования

### Системные требования

- **Docker Desktop** 4.25+ (Windows/macOS) или **Docker Engine** 24+ (Linux)
- **Docker Compose** v2.20+
- **Git**
- Минимум **8GB RAM**, рекомендуется **16GB**
- Свободное место: **10GB+**

---

## 📦 Метод 1: Автоматический запуск (Рекомендуется)

### Linux/macOS:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# 2. Сделайте скрипт исполняемым
chmod +x docker-local.sh

# 3. Запустите всё одной командой
./docker-local.sh start
```

### Windows (PowerShell):

```powershell
# 1. Клонируйте репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# 2. Запустите скрипт
.\docker-local.ps1 start

# Если появится ошибка выполнения скриптов:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\docker-local.ps1 start
```

**Готово!** Через 2-3 минуты все сервисы будут запущены.

---

## 🎯 Доступ к сервисам

После успешного запуска откройте в браузере:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://localhost:3000 | React приложение |
| **Backend API** | http://localhost:8000/api | Django REST API |
| **Admin Panel** | http://localhost:8000/admin | Django Admin (login: `admin` / password: `admin`) |
| **API Documentation** | http://localhost:8000/api/docs | Swagger/OpenAPI |
| **PostgreSQL** | localhost:5432 | База данных |
| **Redis** | localhost:6379 | Кэш и Celery broker |

---

## 🛠️ Управление сервисами

### Доступные команды:

```bash
# Linux/macOS
./docker-local.sh [command]

# Windows
.\docker-local.ps1 [command]
```

| Команда | Описание |
|---------|----------|
| `start` | Запустить все сервисы |
| `stop` | Остановить все сервисы |
| `restart` | Перезапустить все сервисы |
| `restart-one <service>` | Перезапустить один сервис (backend, frontend, celery_worker, postgres, redis) |
| `logs` | Показать логи всех сервисов |
| `status` | Показать статус сервисов |
| `shell` | Открыть Django shell |
| `migrate` | Применить миграции БД |
| `test` | Запустить тесты |
| `clean` | Полная очистка (удалить всё) |
| `help` | Справка |

### Примеры использования:

```bash
# Посмотреть логи
./docker-local.sh logs

# Перезапустить только backend
./docker-local.sh restart-one backend

# Применить новые миграции
./docker-local.sh migrate

# Django shell для отладки
./docker-local.sh shell

# Запустить тесты
./docker-local.sh test
```

---

## 📦 Метод 2: Ручной запуск (для опытных пользователей)

### 1. Подготовка окружения:

```bash
# Клонируйте репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# Создайте .env файл
cp .env.example .env

# Отредактируйте .env (опционально)
nano .env  # или используйте любой редактор
```

### 2. Запуск сервисов:

```bash
# Соберите образы
docker-compose build --no-cache

# Запустите базы данных
docker-compose up -d postgres redis

# Подождите 10 секунд для инициализации БД
sleep 10

# Запустите backend
docker-compose up -d backend celery_worker celery_beat

# Подождите 15 секунд для миграций
sleep 15

# Запустите frontend
docker-compose up -d frontend

# Проверьте статус
docker-compose ps
```

### 3. Просмотр логов:

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f celery_worker
```

### 4. Остановка:

```bash
# Остановить сервисы (сохранить данные)
docker-compose down

# Полная очистка (удалить всё включая данные)
docker-compose down -v --rmi all
```

---

## 🔧 Архитектура Docker

### Сервисы:

```yaml
marketai_network (Docker bridge network)
├── postgres         # PostgreSQL 16 (Основная БД)
├── redis            # Redis 7 (Кэш + Celery broker)
├── backend          # Django 5.1 + Gunicorn
├── celery_worker    # Celery Worker (фоновые задачи)
├── celery_beat      # Celery Beat (планировщик)
└── frontend         # React + Vite (dev server)
```

### Volumes (persistent data):

- `postgres_data` - База данных PostgreSQL
- `redis_data` - Redis persistence
- `static_volume` - Django статика
- `media_volume` - Медиа файлы пользователей
- `duckdb_data` - Аналитическая БД DuckDB
- `logs_volume` - Логи приложения

---

## 🐛 Отладка и решение проблем

### 1. Порты заняты

**Ошибка:** `Bind for 0.0.0.0:5432 failed: port is already allocated`

**Решение:**
```bash
# Проверьте занятые порты
netstat -tulpn | grep LISTEN  # Linux
lsof -i :5432  # macOS
netstat -ano | findstr :5432  # Windows

# Остановите конфликтующий процесс или измените порты в docker-compose.yml
```

### 2. Backend не запускается

```bash
# Проверьте логи
docker-compose logs backend

# Проверьте подключение к БД
docker-compose exec backend python manage.py check --database default

# Пересоздайте миграции
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### 3. Frontend не собирается

```bash
# Очистите node_modules
docker-compose down
docker volume rm marketai-python_node_modules 2>/dev/null || true
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### 4. БД не инициализируется

```bash
# Полная очистка и пересоздание БД
docker-compose down -v
docker volume rm marketai-python_postgres_data
docker-compose up -d postgres
sleep 10
docker-compose up -d backend
```

### 5. Celery задачи не выполняются

```bash
# Проверьте Celery worker
docker-compose logs celery_worker

# Проверьте Redis
docker-compose exec redis redis-cli ping
# Должен вернуть: PONG

# Перезапустите Celery
docker-compose restart celery_worker celery_beat
```

### 6. Низкая производительность

**На Windows/macOS:**
- Выделите Docker Desktop больше ресурсов (Settings → Resources)
- Рекомендуется: 4 CPU cores, 8GB RAM

**Общие советы:**
```bash
# Очистите неиспользуемые образы и контейнеры
docker system prune -a

# Проверьте использование ресурсов
docker stats
```

---

## 🔐 Безопасность для production

> ⚠️ **ВНИМАНИЕ:** Текущая конфигурация предназначена **ТОЛЬКО для локальной разработки**!

### 1. Секретные ключи

Перед деплоем на production:

```bash
# Сгенерируйте новый Django SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Сгенерируйте Fernet ключ для шифрования
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Сгенерируйте JWT ключ
openssl rand -base64 64
```

**Обновите в `.env`:**
```env
DJANGO_SECRET_KEY=<новый-ключ>
FIELD_ENCRYPTION_KEY=<новый-fernet-ключ>
JWT_SECRET_KEY=<новый-jwt-ключ>
```

### 2. Пароли БД

**Измените:**
```env
DB_PASSWORD=<сильный-пароль>
POSTGRES_PASSWORD=<сильный-пароль>
```

### 3. Production настройки

```env
# Отключите DEBUG
DJANGO_DEBUG=False

# Настройте ALLOWED_HOSTS
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Настройте CORS
DJANGO_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. PostgreSQL Production Config

**docker-compose.prod.yml:**
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: ${DB_NAME}
    POSTGRES_USER: ${DB_USER}
    POSTGRES_PASSWORD: ${DB_PASSWORD}
    # Production оптимизации
    POSTGRES_INITDB_ARGS: "-E UTF8 --locale=en_US.UTF-8"
  command: >
    postgres
    -c shared_buffers=256MB
    -c effective_cache_size=1GB
    -c maintenance_work_mem=64MB
    -c checkpoint_completion_target=0.9
    -c wal_buffers=16MB
    -c default_statistics_target=100
    -c random_page_cost=1.1
    -c effective_io_concurrency=200
    -c work_mem=4MB
    -c min_wal_size=1GB
    -c max_wal_size=4GB
    -c max_connections=100
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./backups:/backups  # Backup directory
  restart: unless-stopped
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### 5. Secrets Management

#### Использование Docker Secrets

**docker-compose.secrets.yml:**
```yaml
version: '3.9'

services:
  backend:
    secrets:
      - django_secret_key
      - db_password
      - jwt_secret_key
    environment:
      DJANGO_SECRET_KEY_FILE: /run/secrets/django_secret_key
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_KEY_FILE: /run/secrets/jwt_secret_key

secrets:
  django_secret_key:
    file: ./secrets/django_secret_key.txt
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret_key:
    file: ./secrets/jwt_secret_key.txt
```

**Создайте secrets:**
```bash
mkdir -p secrets
echo "your-django-secret-key" > secrets/django_secret_key.txt
echo "your-db-password" > secrets/db_password.txt
echo "your-jwt-secret-key" > secrets/jwt_secret_key.txt

# Защитите файлы
chmod 600 secrets/*

# Добавьте в .gitignore
echo "secrets/" >> .gitignore
```

#### Использование HashiCorp Vault

```python
# backend/core/vault.py
import hvac
import os

class VaultClient:
    def __init__(self):
        self.client = hvac.Client(
            url=os.getenv('VAULT_ADDR'),
            token=os.getenv('VAULT_TOKEN')
        )
    
    def get_secret(self, path: str, key: str) -> str:
        secret = self.client.secrets.kv.v2.read_secret_version(path=path)
        return secret['data']['data'][key]

# Использование
vault = VaultClient()
DJANGO_SECRET_KEY = vault.get_secret('marketai/django', 'secret_key')
```

### 6. Frontend Production Build

**Используйте production Dockerfile:**
```yaml
frontend:
  build:
    context: ./frontend
    target: production  # вместо development
  restart: unless-stopped
```

### 7. HTTPS/SSL

**Добавьте nginx с Let's Encrypt:**
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
    - static_volume:/var/www/static
  depends_on:
    - backend
    - frontend
  restart: unless-stopped
```

---

## 📊 Мониторинг

### Проверка здоровья сервисов:

```bash
# Статус всех контейнеров
docker-compose ps

# Использование ресурсов
docker stats marketai_backend marketai_frontend marketai_postgres

# Проверка health checks
docker inspect marketai_postgres | grep -A 10 Health
```

### Логи:

```bash
# Backend логи
docker-compose logs -f --tail=100 backend

# Celery логи
docker-compose logs -f --tail=100 celery_worker celery_beat

# БД логи
docker-compose logs -f --tail=50 postgres
```

---

## 🧪 Тестирование

### Запуск тестов:

```bash
# Все тесты
docker-compose exec backend pytest -v

# С coverage отчётом
docker-compose exec backend pytest --cov=. --cov-report=html

# Конкретное приложение
docker-compose exec backend pytest apps/users/tests/

# Конкретный тест
docker-compose exec backend pytest apps/users/tests/test_models.py::TestUserModel::test_create_user
```

---

## 📝 Работа с БД

### Миграции:

```bash
# Создать новые миграции
docker-compose exec backend python manage.py makemigrations

# Применить миграции
docker-compose exec backend python manage.py migrate

# Откатить миграцию
docker-compose exec backend python manage.py migrate users 0001

# Показать список миграций
docker-compose exec backend python manage.py showmigrations
```

### Backup и Restore:

```bash
# Backup
docker-compose exec -T postgres pg_dump -U marketai marketai > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker-compose exec -T postgres psql -U marketai marketai < backup_20251123_050000.sql

# Автоматизированный backup (cron)
0 2 * * * cd /path/to/marketai-python && docker-compose exec -T postgres pg_dump -U marketai marketai | gzip > backups/backup_$(date +\%Y\%m\%d).sql.gz
```

### Прямой доступ к PostgreSQL:

```bash
# PostgreSQL shell
docker-compose exec postgres psql -U marketai -d marketai

# Быстрые команды
\dt              # список таблиц
\d users_user    # структура таблицы
\q               # выход
```

---

## 🔄 Обновление проекта

```bash
# 1. Остановите сервисы
docker-compose down

# 2. Обновите код
git pull origin main

# 3. Пересоберите образы
docker-compose build --no-cache

# 4. Примените миграции
docker-compose up -d postgres redis
sleep 10
docker-compose run --rm backend python manage.py migrate

# 5. Запустите всё
docker-compose up -d
```

---

## 📚 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Django Docker Best Practices](https://docs.docker.com/samples/django/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

---

## 💬 Поддержка

Если возникли проблемы:

1. Проверьте [GitHub Issues](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)
2. Создайте новый Issue с подробным описанием проблемы
3. Приложите логи: `docker-compose logs > logs.txt`

---

**Успешного тестирования! 🚀**

---

**Последнее обновление:** 24 ноября 2025

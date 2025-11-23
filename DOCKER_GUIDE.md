# 🐳 Docker Гайд - Запуск MarketAI

## 🚀 Быстрый старт

### 1. Предварительные требования

- **Docker Desktop** установлен и запущен
- **Git** для клонирования репозитория
- **8 GB RAM** минимум (рекомендуется 16 GB)

### 2. Клонировать репозиторий

```powershell
# Windows PowerShell
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
git checkout feature/full-frontend-migration
```

```bash
# Linux / macOS
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
git checkout feature/full-frontend-migration
```

### 3. Создать .env файл

```powershell
# Windows
copy .env.example .env
```

```bash
# Linux / macOS
cp .env.example .env
```

### 4. Запустить все сервисы

```bash
docker-compose up -d
```

Это запустит:
- ✅ **PostgreSQL 16** - база данных
- ✅ **Redis 7** - кеш и брокер сообщений
- ✅ **RabbitMQ 3** - очереди задач
- ✅ **Django Backend** - API сервер
- ✅ **Celery Worker** - фоновые задачи
- ✅ **Celery Beat** - планировщик задач
- ✅ **React Frontend** - веб-приложение

### 5. Проверить статус

```bash
docker-compose ps
```

Должно показать 7 запущенных контейнеров.

---

## 🌐 Доступ к приложению

После запуска подождите 1-2 минуты, пока все сервисы полностью инициализируются.

### 💻 Главные URL

| Сервис | URL | Описание |
|---------|-----|------------|
| **Frontend** | http://localhost:3000 | React приложение |
| **Backend API** | http://localhost:8000/api/ | Django REST API |
| **API Docs (Swagger)** | http://localhost:8000/api/docs/ | Интерактивная документация API |
| **Admin Panel** | http://localhost:8000/admin/ | Django админка |
| **RabbitMQ Management** | http://localhost:15672 | Управление очередями (guest/guest) |

### 🔑 Создание суперпользователя

```bash
docker-compose exec backend python manage.py createsuperuser
```

Введите:
- Email
- Password (дважды)

### 📦 Создание тестовых данных (опционально)

```bash
docker-compose exec backend python manage.py create_test_data
```

---

## 🔧 Полезные команды

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend

# Только Celery
docker-compose logs -f celery_worker celery_beat
```

### Перезапуск сервисов

```bash
# Перезапустить backend
docker-compose restart backend

# Перезапустить frontend
docker-compose restart frontend

# Перезапустить всё
docker-compose restart
```

### Выполнение команд в контейнере

```bash
# Backend команды
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py test

# Frontend команды
docker-compose exec frontend npm install
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run type-check

# Зайти в контейнер bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Остановка и очистка

```bash
# Остановить все сервисы
docker-compose down

# Остановить и удалить volumes (очистит базу данных)
docker-compose down -v

# Полная очистка (удалить всё: контейнеры, volumes, images)
docker-compose down -v --rmi all
```

### Пересобрать контейнеры

```bash
# Пересобрать всё с нуля
docker-compose build --no-cache

# Пересобрать только backend
docker-compose build backend

# Пересобрать только frontend
docker-compose build frontend

# Пересобрать и запустить
docker-compose up -d --build
```

---

## 🐛 Решение проблем

### Проблема 1: Backend не запускается

**Симптом:**
```
backend exited with code 1
```

**Решение:**
```bash
# Просмотреть логи
docker-compose logs backend

# Пересобрать backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Проблема 2: Frontend не открывается

**Симптом:**
```
Cannot connect to localhost:3000
```

**Решение:**
```bash
# Проверить статус
docker-compose ps frontend

# Просмотреть логи
docker-compose logs -f frontend

# Перезапустить
docker-compose restart frontend
```

### Проблема 3: Порт уже занят

**Симптом:**
```
Error: port is already allocated
```

**Решение:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Linux/macOS
lsof -i :3000
lsof -i :8000

# Убить процесс или изменить порты в docker-compose.yml
```

### Проблема 4: База данных не доступна

**Симптом:**
```
OperationalError: could not connect to server
```

**Решение:**
```bash
# Проверить статус PostgreSQL
docker-compose ps postgres

# Проверить health
docker-compose exec postgres pg_isready -U marketai

# Перезапустить всё
docker-compose restart
```

### Проблема 5: API не отвечает на frontend

**Симптом:**
```
CORS error or Network Error
```

**Решение:**
```bash
# Проверить .env
cat .env | grep CORS

# Должно быть:
# DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000

# Перезапустить backend
docker-compose restart backend
```

---

## 📋 Чек-лист проверки

После запуска проверь:

- [ ] Все 7 контейнеров запущены (`docker-compose ps`)
- [ ] Frontend открывается на http://localhost:3000
- [ ] Backend API отвечает на http://localhost:8000/api/
- [ ] Swagger docs доступен на http://localhost:8000/api/docs/
- [ ] Можно создать суперюзера
- [ ] Можно зайти в admin панель
- [ ] Регистрация работает на frontend
- [ ] Вход работает на frontend
- [ ] Dashboard загружается после входа
- [ ] Все 26 страниц доступны

---

## 📊 Мониторинг

### Использование ресурсов

```bash
# Посмотреть использование CPU/RAM
docker stats

# Посмотреть размер volumes
docker system df -v
```

### Ожидаемое использование

- **PostgreSQL**: ~50-100 MB RAM
- **Redis**: ~10-30 MB RAM
- **RabbitMQ**: ~100-150 MB RAM
- **Backend**: ~200-400 MB RAM
- **Celery Worker**: ~150-300 MB RAM
- **Celery Beat**: ~100-200 MB RAM
- **Frontend (dev)**: ~300-500 MB RAM

**Итого:** ~1-2 GB RAM в режиме development

---

## 🚀 Production режим

Для production используйте:

```bash
# Пересобрать frontend для production
docker-compose -f docker-compose.prod.yml build frontend --build-arg target=production

# Запустить в production режиме
docker-compose -f docker-compose.prod.yml up -d
```

В production:
- Frontend будет отдаваться через Nginx
- Меньше использование памяти
- Быстрее загрузка страниц

---

## 📚 Дополнительные ресурсы

- [📝 План миграции](./FRONTEND_MIGRATION_PLAN.md)
- [💻 API документация](./docs/API.md)
- [🔧 Скрипты миграции](./scripts/README.md)
- [🐛 Issues](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)

---

**Создано:** 2025-11-23  
**Версия:** 1.0.0  
**Статус:** ✅ Готово к тестированию

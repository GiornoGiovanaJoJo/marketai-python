# 🧪 Локальное тестирование MarketAI

## 🚀 Быстрый старт (3 команды)

### Linux/macOS:

```bash
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
chmod +x docker-local.sh && ./docker-local.sh start
```

### Windows (PowerShell):

```powershell
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
.\docker-local.ps1 start
```

**Готово!** Через 2-3 минуты откройте: http://localhost:3000

---

## 📌 Что запустится?

| Сервис | URL | Доступ |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | React приложение |
| **API** | http://localhost:8000/api | Django REST API |
| **Admin** | http://localhost:8000/admin | `admin` / `admin` |
| **API Docs** | http://localhost:8000/api/docs | Swagger UI |

---

## 🔧 Частые команды

```bash
# Посмотреть логи
./docker-local.sh logs

# Перезапустить backend
./docker-local.sh restart-one backend

# Остановить всё
./docker-local.sh stop

# Django shell
./docker-local.sh shell

# Запустить тесты
./docker-local.sh test
```

---

## 🐛 Что-то не работает?

### 1. Проверьте Docker:

```bash
docker --version        # Должно быть 24.0+
docker-compose --version  # Должно быть 2.20+
```

### 2. Порты заняты?

Освободите порты 3000, 8000, 5432, 6379 или остановите конфликтующие процессы.

### 3. Полная перезагрузка:

```bash
./docker-local.sh clean  # Удалит всё
./docker-local.sh start  # Запустит заново
```

### 4. Проверьте логи:

```bash
# Логи всех сервисов
./docker-local.sh logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
```

---

## 🧪 Тестирование функционала

### Backend API тесты:

```bash
# Запустить все тесты
./docker-local.sh test

# Или вручную:
docker-compose exec backend pytest -v

# С coverage:
docker-compose exec backend pytest --cov=. --cov-report=html
```

### Ручное тестирование API:

```bash
# Создать тестового пользователя
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","username":"testuser"}'

# Получить JWT токен
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# Или используйте admin / admin в /admin
```

### Тестирование Celery задач:

```bash
# Проверить статус Celery worker
docker-compose logs celery_worker

# Запустить тестовую задачу через Django shell
docker-compose exec backend python manage.py shell
>>> from celery import current_app
>>> result = current_app.send_task('test_task')
>>> result.get(timeout=10)
```

### Тестирование БД:

```bash
# PostgreSQL shell
docker-compose exec postgres psql -U marketai -d marketai

# Проверка таблиц
marketai=# \dt

# Количество пользователей
marketai=# SELECT COUNT(*) FROM users_user;
```

---

## 📄 Что тестировать?

### Frontend:
- ✅ Регистрация / Вход
- ✅ Дашборд (если реализован)
- ✅ API запросы работают
- ✅ Отображение данных

### Backend API:
- ✅ `/api/docs` открывается
- ✅ `/api/auth/register/` работает
- ✅ `/api/auth/login/` возвращает JWT
- ✅ `/admin` доступен

### БД и Cache:
- ✅ PostgreSQL подключается
- ✅ Redis работает
- ✅ Миграции применены
- ✅ Celery worker активен

---

## 📋 Чек-лист перед тестированием

- [ ] Docker Desktop запущен
- [ ] Порты 3000, 8000, 5432, 6379 свободны
- [ ] Минимум 8GB RAM доступно
- [ ] `.env` файл создан (автоматически)
- [ ] Все сервисы запущены (`docker-compose ps`)

---

## 📊 Мониторинг

```bash
# Статус контейнеров
./docker-local.sh status

# Использование ресурсов
docker stats

# Здоровье сервисов
docker-compose ps
```

---

## 🔗 Дополнительные ресурсы

- 📖 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Полная инструкция
- 🚀 [QUICK_START.md](./QUICK_START.md) - Быстрый старт проекта
- 📝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Руководство по разработке

---

**Успешного тестирования! 🎉**

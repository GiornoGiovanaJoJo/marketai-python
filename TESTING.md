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

## 📋 Что запустится?

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

### 🔵 Backend API тесты

#### Запуск тестов

```bash
# Запустить все тесты
./docker-local.sh test

# Или вручную:
docker-compose exec backend pytest -v

# С coverage:
docker-compose exec backend pytest --cov=apps --cov-report=html --cov-report=term

# С детальным выводом:
docker-compose exec backend pytest -v -s

# Конкретное приложение:
docker-compose exec backend pytest apps/campaigns/tests/

# Конкретный тест:
docker-compose exec backend pytest apps/users/tests/test_models.py::TestUserModel::test_create_user
```

#### Требования к coverage

| Модуль | Минимальный coverage |
|--------|---------------------|
| **Критические** (auth, users, campaigns) | **90%+** |
| **Обычные** (statistics, integrations) | **80%+** |
| **Новый код** | **100%** |
| **Общий проект** | **80%+** |

#### Просмотр coverage отчёта

```bash
# Генерация HTML отчёта
docker-compose exec backend pytest --cov=apps --cov-report=html

# Откройте backend/htmlcov/index.html в браузере
```

#### Типы тестов

1. **Unit тесты** - models, services, utils
   ```bash
   pytest apps/users/tests/test_models.py
   pytest apps/campaigns/tests/test_services.py
   ```

2. **Integration тесты** - API endpoints
   ```bash
   pytest apps/users/tests/test_api.py
   pytest apps/campaigns/tests/test_views.py
   ```

3. **Performance тесты** - производительность
   ```bash
   pytest apps/statistics/tests/test_performance.py
   ```

---

### 🔵 Frontend тесты

#### Unit тесты (Jest + React Testing Library)

```bash
# Запустить все тесты
cd frontend
npm run test

# С coverage
npm run test:coverage

# Watch mode (автоматический перезапуск)
npm run test:watch

# Конкретный файл
npm run test -- LoginForm.test.tsx
```

#### E2E тесты (Playwright)

**Установка:**
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

**Запуск E2E тестов:**
```bash
# Запустить все E2E тесты
npm run test:e2e

# С UI mode (интерактивный режим)
npm run test:e2e:ui

# Конкретный тест
npx playwright test auth.spec.ts

# Debug mode
npx playwright test --debug

# Генерация тестов (запись действий)
npx playwright codegen http://localhost:3000
```

**Пример E2E теста:**
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

#### Критические E2E сценарии

- ✅ Регистрация пользователя
- ✅ Вход / Выход
- ✅ Создание кампании
- ✅ Редактирование кампании
- ✅ Просмотр статистики
- ✅ Интеграция с Wildberries

---

## 🔗 Ручное тестирование API

### Регистрация пользователя

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "username": "testuser"
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

---

## 📊 Тестирование производительности

### Backend Performance Tests

```bash
# Locust для нагрузочного тестирования
pip install locust

# Запустить Locust
locust -f tests/performance/locustfile.py --host=http://localhost:8000

# Откройте http://localhost:8089
```

**Пример locustfile.py:**
```python
from locust import HttpUser, task, between

class MarketAIUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def view_campaigns(self):
        self.client.get("/api/campaigns/")
    
    @task(1)
    def view_statistics(self):
        self.client.get("/api/statistics/financial-report")
```

### Frontend Performance

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000

# Bundle analysis
npm run build -- --analyze
```

### Критерии производительности

| Метрика | Цель |
|--------|-----|
| API Response Time | < 200ms (p95) |
| Database Query Time | < 50ms (p95) |
| Page Load Time | < 2s |
| Time to Interactive | < 3s |
| First Contentful Paint | < 1.5s |

---

## 🔐 Security Testing

### Зависимости

```bash
# Backend
pip install safety
safety check

# Frontend
npm audit
npm audit fix
```

### Статический анализ

```bash
# Bandit для Python
pip install bandit
bandit -r backend/ -ll

# ESLint security
cd frontend
npm install --save-dev eslint-plugin-security
npm run lint
```

### OWASP ZAP Scanning

```bash
# Запустить OWASP ZAP Docker
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:8000 -r zap_report.html
```

---

## ⚙️ Тестирование Celery задач

```bash
# Проверить статус Celery worker
docker-compose logs celery_worker

# Запустить тестовую задачу
docker-compose exec backend python manage.py shell
>>> from celery import current_app
>>> result = current_app.send_task('test_task')
>>> result.get(timeout=10)

# Проверить активные задачи
docker-compose exec celery_worker celery -A core inspect active

# Проверить запланированные задачи
docker-compose exec celery_beat celery -A core inspect scheduled
```

---

## 💾 Тестирование БД

### PostgreSQL

```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U marketai -d marketai

# Проверка таблиц
marketai=# \dt

# Количество пользователей
marketai=# SELECT COUNT(*) FROM users_user;

# Количество кампаний
marketai=# SELECT COUNT(*) FROM campaigns_campaign;

# Выход
marketai=# \q
```

### Redis

```bash
# Подключение к Redis
docker-compose exec redis redis-cli

# Проверка соединения
127.0.0.1:6379> PING
PONG

# Проверка ключей
127.0.0.1:6379> KEYS *

# Выход
127.0.0.1:6379> EXIT
```

---

## 📋 Что тестировать?

### ✅ Frontend:
- ✅ Регистрация / Вход
- ✅ Дашборд (если реализован)
- ✅ API запросы работают
- ✅ Отображение данных
- ✅ Создание/редактирование кампаний
- ✅ Графики и таблицы

### ✅ Backend API:
- ✅ `/api/docs` открывается
- ✅ `/api/auth/register/` работает
- ✅ `/api/auth/login/` возвращает JWT
- ✅ `/api/campaigns/` CRUD работает
- ✅ `/api/statistics/` возвращает данные
- ✅ `/admin` доступен

### ✅ БД и Cache:
- ✅ PostgreSQL подключается
- ✅ Redis работает
- ✅ Миграции применены
- ✅ Celery worker активен

---

## ✅ Чек-лист перед тестированием

- [ ] Docker Desktop запущен
- [ ] Порты 3000, 8000, 5432, 6379 свободны
- [ ] Минимум 8GB RAM доступно
- [ ] `.env` файл создан (автоматически)
- [ ] Все сервисы запущены (`docker-compose ps`)
- [ ] Backend tests проходят
- [ ] Frontend загружается

---

## 📊 Мониторинг

```bash
# Статус контейнеров
./docker-local.sh status

# Использование ресурсов
docker stats

# Здоровье сервисов
docker-compose ps

# Проверка health checks
docker inspect marketai_postgres | grep -A 10 Health
```

---

## 🔗 Дополнительные ресурсы

- 📖 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Полная инструкция
- 🚀 [QUICK_START.md](./QUICK_START.md) - Быстрый старт проекта
- 📝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Руководство по разработке
- 🛡️ [FIX_ENV.md](./FIX_ENV.md) - Решение проблем

---

**Успешного тестирования! 🎉**

---

**Последнее обновление:** 24 ноября 2025

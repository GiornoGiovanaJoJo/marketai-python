# MarketAI Python

🚀 **MarketAI** - Платформа для управления рекламными кампаниями на маркетплейсах

[![Django](https://img.shields.io/badge/Django-5.1.10-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen.svg)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)
[![Code Style](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## 📊 Статус проекта

🔸 **Backend:** 100% готов ✅  
🔶 **Frontend:** 98% готов (добавлена документация по SidebarContext, useSidebar hook)  
✅ **Готов к тестированию через Docker**

**Последнее обновление:** 24 ноября 2025

---

## 🎉 Новые возможности (v2.0)

### ✨ Критические обновления безопасности
- ✅ **Django 5.1.10** с патчами CVE-2025-48432, CVE-2025-64459
- ✅ **Обновленные зависимости** (cryptography 43.0.3, pillow 11.0.0)
- ✅ **Bandit** security scanner

### 🔧 CI/CD Pipeline
- ✅ **GitHub Actions** автоматическое тестирование
- ✅ **Multi-Python/Node** поддержка (Python 3.12-3.13, Node 18-22)
- ✅ **Docker build tests**
- ✅ **Security scanning** (Trivy, Safety, npm audit)
- ✅ **Code coverage** reporting

### 🛡️ Pre-commit Hooks
- ✅ **Python:** black, isort, flake8, mypy, pylint, bandit
- ✅ **TypeScript:** prettier, eslint
- ✅ **Security:** detect-secrets
- ✅ **Quality:** YAML lint, markdown link check

### 🚀 Production-Ready
- ✅ **docker-compose.prod.yml** с Nginx
- ✅ **Healthchecks** для всех сервисов
- ✅ **Resource limits** (CPU, memory)
- ✅ **Horizontal scaling** (replicas)
- ✅ **Structured logging**
- ✅ **Monitoring** (Sentry SDK)

---

## 📦 Быстрый старт (3 команды)

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

**🎉 Готово!** Через 2-3 минуты:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin:** http://localhost:8000/admin (`admin` / `admin`)
- **API Docs:** http://localhost:8000/api/docs

---

## 👨‍💻 Разработчикам

### Установка pre-commit hooks

```bash
# Установите pre-commit
pip install pre-commit

# Установите hooks
pre-commit install

# Запустите на всех файлах
pre-commit run --all-files
```

### Запуск CI/CD локально

```bash
# Backend tests
cd backend
pytest --cov=. --cov-report=html

# Frontend tests
cd frontend
npm run lint
npm run type-check
npm run build

# Security scan
safety check --file backend/requirements.txt
npm audit
```

---

## 🚀 Production Deployment

### 1. Подготовка

```bash
# Создайте .env.production
cp .env.example .env.production

# Установите пароли
DB_PASSWORD=your_secure_db_password
REDIS_PASSWORD=your_secure_redis_password
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
```

### 2. Запуск

```bash
# С Nginx reverse proxy
docker-compose -f docker-compose.prod.yml up -d

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. SSL/TLS (опционально)

```bash
# Let's Encrypt с certbot
docker run -it --rm \
  -v ./nginx/ssl:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d your-domain.com
```

---

## 🔧 Управление сервисами

### Доступные команды:

```bash
# Linux/macOS
./docker-local.sh [command]

# Windows
.\docker-local.ps1 [command]
```

| Команда | Описание |
|---------|-----------|
| `start` | Запустить все сервисы |
| `stop` | Остановить все сервисы |
| `restart` | Перезапустить все |
| `restart-one <service>` | Перезапустить один сервис |
| `logs` | Показать логи |
| `status` | Статус сервисов |
| `shell` | Django shell |
| `migrate` | Применить миграции |
| `test` | Запустить тесты |
| `clean` | Полная очистка |
| `help` | Показать справку |

---

## 🛠️ Технологический стек

### Backend
- **Python:** 3.12+
- **Django:** 5.1.10+ (🔒 патчи безопасности CVE-2025-48432, CVE-2025-64459)
- **Django REST Framework:** 3.15.2
- **PostgreSQL:** 16
- **Redis:** 7
- **Celery:** 5.4
- **JWT Authentication:** djangorestframework-simplejwt 5.3.1
- **API Docs:** drf-spectacular (Swagger/ReDoc)
- **DuckDB:** 1.1.3 - аналитика
- **Monitoring:** Sentry SDK 2.18.0

### Frontend (полная миграция завершена ✅)
- **React:** 18.3
- **TypeScript:** 5.2
- **Vite:** 5.0
- **Tailwind CSS:** 3.3
- **Radix UI** - UI компоненты
- **React Router:** 6.20
- **Redux Toolkit:** 2.2 - state management
- **React Redux:** 9.2 - React bindings
- **Axios:** 1.7 - HTTP клиент
- **Recharts:** 3.3 - графики

---

## 📊 Статус миграции

### Backend - 100% ✅
- [x] Базовая структура Django
- [x] Docker конфигурация (PostgreSQL, Redis)
- [x] JWT аутентификация
- [x] CRUD кампаний
- [x] Интеграция с Wildberries API
- [x] Статистика и отчёты
- [x] Celery задачи
- [x] API документация (Swagger/ReDoc)
- [x] Тесты (pytest)
- [x] CI/CD pipeline
- [x] Pre-commit hooks

### Frontend - 98% 🔶
- [x] React + TypeScript + Vite
- [x] Tailwind CSS + Radix UI
- [x] React Router (26 маршрутов)
- [x] **Все 26 страниц перенесено** ✅
- [x] **60+ компонентов перенесено** ✅
- [x] **Redux Toolkit + React Redux** ✅
- [x] **Contexts (Auth, Theme, Sidebar)** ✅
- [x] **Hooks (useSidebar)** ✅
- [x] API сервисы (auth, campaigns, statistics)
- [x] TypeScript типы
- [x] Custom hooks
- [x] Dockerfile + nginx.conf
- [x] Полная документация (SidebarContext, useSidebar, API endpoints)
- [x] Pre-commit hooks (prettier, eslint)
- [ ] Обновление API эндпоинтов под Django (10%)
- [ ] E2E тестирование всех страниц (0%)

---

## 📚 Документация

- 🧪 **[TESTING.md](./TESTING.md)** - Краткая инструкция по тестированию
- 🐳 **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Полная инструкция по Docker
- 🚀 **[QUICK_START.md](./QUICK_START.md)** - Быстрый старт
- 📝 **[FRONTEND_MIGRATION_PLAN.md](./FRONTEND_MIGRATION_PLAN.md)** - План миграции frontend
- 🛠️ **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Руководство по разработке
- 💻 **[API документация](http://localhost:8000/api/docs/)** (после запуска)

---

## 🔒 Безопасность

### Актуальные обновления безопасности Django 5.1.10+

**Критические уязвимости исправлены:**
- ✅ **CVE-2025-48432** - Log injection через неэкранированный request.path
- ✅ **CVE-2025-64459** - SQL injection при передаче request.GET.dict() в QuerySet

**Рекомендации для production:**

1. **Всегда используйте Django 5.1.10+**
2. **Никогда не передавайте** `request.GET.dict()` или `request.POST.dict()` напрямую в QuerySet методы
3. **Используйте Docker secrets** для паролей БД вместо переменных окружения
4. **Настройте PostgreSQL healthcheck** и persistent volumes
5. **Включите SSL/TLS** для production
6. **Регулярно обновляйте зависимости**

Подробнее: [DOCKER_GUIDE.md - Безопасность](./DOCKER_GUIDE.md#🔒-безопасность-для-production)

---

## 🧪 Тестирование

```bash
# Backend тесты
./docker-local.sh test

# Или вручную
docker-compose exec backend pytest -v

# С coverage
docker-compose exec backend pytest --cov=. --cov-report=html

# Проверка безопасности
cd backend
safety check --file requirements.txt
bandit -r .
```

📖 **Подробное руководство:** [TESTING.md](./TESTING.md)

---

## 🤝 Участие в разработке

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Установите pre-commit hooks (`pre-commit install`)
4. Commit изменения (`git commit -m 'feat: Add amazing feature'`)
5. Push в branch (`git push origin feature/amazing-feature`)
6. Откройте Pull Request

📖 **Подробнее:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📝 Лицензия

MIT License

## 👥 Авторы

- [@GiornoGiovanaJoJo](https://github.com/GiornoGiovanaJoJo)

## 📧 Контакты

По вопросам: [создайте issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)

---

**Статус:** 🔸 Backend 100% | 🔶 Frontend 98% | ✅ Готов к тестированию!

**Обновлено:** 24 ноября 2025, 23:50 MSK
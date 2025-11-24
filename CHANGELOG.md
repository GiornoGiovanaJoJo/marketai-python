# Changelog

Все значимые изменения в этом проекте будут задокументированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [2.0.0] - 2025-11-24

### 🔒 Security (КРИТИЧЕСКОЕ)

#### Исправленные уязвимости
- **Django 5.1 → 5.1.10**: Исправлены CVE-2025-48432 (log injection через request.path) и CVE-2025-64459 (SQL injection при request.GET.dict())
- **cryptography 42.0.0 → 43.0.3**: Критические патчи безопасности
- **pillow 10.2.0 → 11.0.0**: Патчи безопасности для обработки изображений

#### Добавлены инструменты безопасности
- Bandit security scanner для Python кода (`backend/.bandit`)
- detect-secrets в pre-commit hooks
- Trivy vulnerability scanner в CI/CD
- Safety check для Python dependencies
- npm audit для Frontend dependencies

### ✨ Added

#### CI/CD Pipeline
- **GitHub Actions workflow** (`.github/workflows/ci.yml`):
  - Backend tests (Python 3.12, 3.13) с PostgreSQL 16 + Redis 7
  - Frontend tests (Node 18, 20, 22)
  - Docker build tests
  - Security vulnerability scanning
  - Code coverage reporting (Codecov)
  - Multi-platform testing

#### Pre-commit Hooks
- **Comprehensive pre-commit configuration** (`.pre-commit-config.yaml`):
  - Python: black, isort, flake8, mypy, pylint, bandit
  - TypeScript/JavaScript: prettier, eslint
  - General: trailing-whitespace, end-of-file-fixer, check-yaml, check-json
  - Security: detect-secrets
  - Documentation: markdown-link-check
  - Django: system checks

#### Production Configuration
- **docker-compose.prod.yml** - Production-ready Docker Compose:
  - Nginx reverse proxy
  - SSL/TLS support
  - Healthchecks для всех сервисов
  - Resource limits (CPU, memory)
  - Horizontal scaling (backend/celery replicas)
  - Structured logging (JSON-file driver)
  - Persistent volumes с bind mounts
  - Обязательные пароли (DB_PASSWORD, REDIS_PASSWORD)

#### Новые зависимости
- **uvicorn[standard] 0.32.1** - ASGI server для async support
- **sentry-sdk 2.18.0** - Error tracking и monitoring
- **python-json-logger 3.2.1** - Structured logging

#### Конфигурационные файлы
- `backend/.bandit` - Bandit security scanner config
- `frontend/.prettierrc.json` - Prettier code formatter config

### 🔄 Changed

#### Backend Dependencies
- Django: 5.1 → 5.1.10 (🔒 CRITICAL)
- djangorestframework: 3.14.0 → 3.15.2
- drf-spectacular: 0.27.0 → 0.27.2
- django-filter: 23.5 → 24.3
- psycopg2-binary: 2.9.9 → 2.9.10
- dj-database-url: 2.1.0 → 2.2.0
- redis: 5.0.1 → 5.0.9
- celery: 5.3.6 → 5.4.0
- django-cors-headers: 4.3.1 → 4.5.0
- PyJWT: 2.8.0 → 2.9.0
- cryptography: 42.0.0 → 43.0.3 (🔒 CRITICAL)
- pandas: 2.1.4 → 2.2.3
- numpy: 1.26.3 → 1.26.4
- requests: 2.31.0 → 2.32.3
- httpx: 0.26.0 → 0.27.2
- python-dateutil: 2.8.2 → 2.9.0
- pytz: 2024.1 → 2024.2
- pillow: 10.2.0 → 11.0.0 (🔒 CRITICAL)
- gunicorn: 21.2.0 → 23.0.0
- whitenoise: 6.6.0 → 6.8.2
- ipython: 8.20.0 → 8.29.0
- pytest: 7.4.4 → 8.3.4
- pytest-django: 4.7.0 → 4.9.0
- pytest-cov: 4.1.0 → 6.0.0
- factory-boy: 3.3.0 → 3.3.1
- faker: 22.0.0 → 30.8.2
- black: 24.1.1 → 24.10.0
- flake8: 7.0.0 → 7.1.1
- mypy: 1.8.0 → 1.13.0
- pylint: 3.0.3 → 3.3.1

#### Документация
- **README.md**: Полностью переработан
  - Добавлен раздел "Новые возможности (v2.0)"
  - CI/CD Pipeline информация
  - Pre-commit hooks инструкции
  - Production deployment guide
  - Обновленные badges (CI/CD, Code Style)

### 📊 Улучшения

#### Code Quality
- Автоматическое форматирование (black, prettier)
- Типизация (mypy с django-stubs)
- Глубокий анализ кода (pylint)
- Security scanning (bandit, detect-secrets)

#### Testing
- Multi-version testing (Python 3.12-3.13, Node 18-22)
- Coverage reporting (Codecov integration)
- Docker build tests
- Security vulnerability scanning

#### Production Readiness
- Horizontal scaling support
- Resource limits для всех сервисов
- Healthchecks и restart policies
- Structured logging
- Persistent storage configuration
- Nginx reverse proxy

---

## [1.0.0] - 2025-11-23

### ✨ Added
- Полная миграция backend с PHP Laravel на Python Django 5.1
- Django REST Framework 3.14 с JWT authentication
- PostgreSQL 16 + Redis 7 в Docker
- Celery для фоновых задач
- API документация (Swagger/ReDoc)
- DuckDB 1.1.3 для аналитики

### Frontend
- Полная миграция с Vue.js на React 18.3 + TypeScript 5.2
- Vite 5.0 build tool
- Tailwind CSS 3.3 + Radix UI
- Redux Toolkit 2.2 + React Redux 9.2
- React Router 6.20
- 26 полностью функциональных страниц
- 60+ UI компонентов
- Contexts: Auth, Theme, Sidebar
- Custom hooks

### Docker
- docker-compose.yml для development
- Автоматические скрипты (docker-local.sh, docker-local.ps1)
- Multi-stage Docker builds

### Документация
- README.md
- QUICK_START.md
- DOCKER_GUIDE.md
- TESTING.md
- CONTRIBUTING.md
- FRONTEND_MIGRATION_PLAN.md

---

## Типы изменений

- `Added` - новые функции
- `Changed` - изменения в существующей функциональности
- `Deprecated` - функции, которые будут удалены
- `Removed` - удаленные функции
- `Fixed` - исправления ошибок
- `Security` - исправления уязвимостей
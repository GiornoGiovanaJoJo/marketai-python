# Contributing to MarketAI

Спасибо за интерес к проекту! 🚀

## 🛠 Настройка разработческой среды

### 1. Клонирование репозитория

```bash
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
```

### 2. Backend настройка

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev зависимости

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Создать тестовые данные
python manage.py create_test_data
```

### 3. Frontend настройка

```bash
cd frontend
npm install
npm run dev
```

### 4. Pre-commit hooks настройка

```bash
# Установить pre-commit
pip install pre-commit

# Установить hooks
pre-commit install

# Запустить вручную (опционально)
pre-commit run --all-files
```

**Что делают hooks:**
- ✅ Проверка кода через `black`, `flake8`, `isort`, `mypy`
- ✅ Проверка YAML/JSON синтаксиса
- ✅ Удаление trailing whitespace
- ✅ Проверка на большие файлы (>500KB)
- ✅ Проверка secrets (detect-private-key)

---

## 📝 Стандарты кодирования

### Python (Backend)

- **Стиль:** PEP 8, Black formatter
- **Длина строки:** 120 символов
- **Импорты:** isort (5 групп: standard, django, third-party, first-party, local)
- **Type hints:** обязательны для публичных API
- **Docstrings:** Google style для всех публичных методов

```bash
# Форматирование кода
black backend/
isort backend/

# Проверка кода
flake8 backend/
mypy backend/

# Или используйте make (если есть Makefile)
make format
make lint
```

### TypeScript (Frontend)

- **Стиль:** ESLint + Prettier
- **Компоненты:** Functional components + hooks
- **Именование:** PascalCase для компонентов, camelCase для функций
- **Type safety:** strict mode включен

```bash
# Проверка кода
npm run lint

# Автоисправление
npm run lint:fix

# Type checking
npm run type-check
```

---

## 🧪 Тестирование

### Backend Tests

```bash
# Запустить все тесты
pytest

# С покрытием
pytest --cov=apps --cov-report=html --cov-report=term

# Конкретное приложение
pytest apps/campaigns/tests.py

# Конкретный тест
pytest apps/users/tests/test_models.py::TestUserModel::test_create_user

# С verbose
pytest -v -s
```

### Требования к покрытию

- **Минимальное покрытие:** 80%
- **Критические модули:** 90%+ (authentication, users, campaigns)
- **Новый код:** 100% покрытие обязательно

### Типы тестов

1. **Unit тесты:** для бизнес-логики (models, services, utils)
2. **Integration тесты:** для API endpoints (views)
3. **E2E тесты:** для критических пользовательских сценариев
4. **Performance тесты:** для эндпоинтов с большой нагрузкой

### E2E тестирование (Playwright)

```bash
# Установить Playwright
cd frontend
npm install -D @playwright/test
npx playwright install

# Запустить E2E тесты
npm run test:e2e

# С UI mode
npm run test:e2e:ui

# Генерация тестов
npx playwright codegen http://localhost:3000
```

### Frontend Tests

```bash
# Unit тесты (Jest + React Testing Library)
npm run test

# С coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 🔐 Security Testing

### 1. Проверка зависимостей

```bash
# Backend
pip install safety
safety check

# или через pip-audit
pip install pip-audit
pip-audit

# Frontend
npm audit
npm audit fix

# Строгая проверка
npm audit --audit-level=high
```

### 2. Статический анализ безопасности

```bash
# Bandit для Python
pip install bandit
bandit -r backend/ -ll

# ESLint security plugin для TypeScript
npm install --save-dev eslint-plugin-security
```

### 3. Secrets scanning

```bash
# Установить detect-secrets
pip install detect-secrets

# Сканирование
detect-secrets scan --baseline .secrets.baseline

# Аудит
detect-secrets audit .secrets.baseline
```

### 4. Docker security

```bash
# Сканирование Docker образов (Trivy)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image marketai-python_backend:latest

# Hadolint для Dockerfile
docker run --rm -i hadolint/hadolint < backend/Dockerfile
```

### Security checklist

- [ ] Нет хардкоженных секретов в коде
- [ ] Все секреты в `.env` и добавлены в `.gitignore`
- [ ] SQL injection защита (используется ORM)
- [ ] XSS защита (React автоматически экранирует)
- [ ] CSRF токены настроены
- [ ] CORS настроен корректно
- [ ] Rate limiting на критичных эндпоинтах
- [ ] JWT токены с коротким lifetime
- [ ] Шифрование чувствительных данных (field encryption)

---

## 🔀 Работа с Git

### Conventional Commits

Используйте формат [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types

| Type | Описание | Пример |
|------|----------|--------|
| `feat` | Новая функция | `feat(campaigns): add campaign activation endpoint` |
| `fix` | Исправление ошибки | `fix(auth): resolve JWT token expiration issue` |
| `docs` | Документация | `docs: update API documentation` |
| `style` | Форматирование | `style(backend): apply black formatter` |
| `refactor` | Рефакторинг | `refactor(users): simplify user registration logic` |
| `test` | Тесты | `test(campaigns): add unit tests for CampaignService` |
| `chore` | Обслуживание | `chore(deps): update Django to 5.1.3` |
| `perf` | Производительность | `perf(statistics): optimize financial report query` |
| `ci` | CI/CD | `ci: add GitHub Actions workflow` |
| `build` | Сборка | `build(docker): update production Dockerfile` |
| `revert` | Откат | `revert: feat(campaigns): add campaign activation` |

#### Scopes

- `auth`, `authentication` - аутентификация
- `users` - пользователи
- `campaigns` - кампании
- `statistics` - статистика
- `integrations` - интеграции (Wildberries, OZON)
- `api` - API эндпоинты
- `frontend` - React frontend
- `backend` - Django backend
- `docker` - Docker конфигурация
- `deps` - зависимости

#### Breaking Changes

```
feat(api)!: change campaigns API response format

BREAKING CHANGE: campaigns endpoint now returns pagination metadata
```

### Branch Naming

```
<type>/<short-description>
```

**Примеры:**
- `feature/campaign-activation`
- `bugfix/jwt-expiration`
- `hotfix/security-vulnerability`
- `refactor/user-service-cleanup`
- `docs/update-contributing-guide`

### Commit Messages примеры

✅ **Хорошие:**
```bash
feat(campaigns): add campaign activation endpoint

Implements POST /api/campaigns/{id}/activate/ endpoint
with automatic Wildberries API integration.

Closes #123
```

```bash
fix(auth): resolve JWT token expiration issue

- Update JWT_ACCESS_TOKEN_LIFETIME to 15 minutes
- Add refresh token rotation
- Improve error handling for expired tokens

Fixes #456
```

```bash
test(campaigns): add unit tests for CampaignService

- Test campaign creation
- Test campaign activation
- Test error handling
- Coverage: 95%
```

❌ **Плохие:**
```bash
fixed bug
update code
WIP
changes
```

---

## 📦 Pull Request Process

### 1. Создайте branch

```bash
git checkout -b feature/campaign-analytics
```

### 2. Внесите изменения

- Пишите чистый код согласно стандартам
- Добавляйте unit тесты
- Обновляйте документацию
- Используйте Conventional Commits

### 3. Pre-commit проверка

```bash
# Автоматически запустится при git commit
git commit -m "feat(campaigns): add campaign analytics"

# Или вручную
pre-commit run --all-files
```

### 4. Запустите тесты

```bash
# Backend
pytest --cov=apps

# Frontend
npm run test

# E2E (опционально)
npm run test:e2e
```

### 5. Push и создайте PR

```bash
git push origin feature/campaign-analytics
```

Откройте PR на GitHub и заполните шаблон.

### PR Template

```markdown
## 📝 Описание

Краткое описание изменений и проблемы, которую они решают.

Closes #123

## 🔧 Тип изменений

- [ ] 🎨 Новая функция (feat)
- [ ] 🐛 Исправление ошибки (fix)
- [ ] 📚 Документация (docs)
- [ ] ♻️ Рефакторинг (refactor)
- [ ] ✅ Тесты (test)
- [ ] 🔧 Обслуживание (chore)

## 🧪 Тестирование

Описание проведённого тестирования:

- [ ] Unit тесты добавлены/обновлены
- [ ] Integration тесты добавлены
- [ ] E2E тесты пройдены (если применимо)
- [ ] Ручное тестирование выполнено

## 📸 Screenshots/Demos (если применимо)

Добавьте скриншоты или GIF демонстрации изменений UI.

## ✅ Checklist

- [ ] Код следует стилю проекта
- [ ] Тесты добавлены и проходят
- [ ] Документация обновлена
- [ ] Commit messages соответствуют Conventional Commits
- [ ] Pre-commit hooks проходят
- [ ] Security проверки пройдены
- [ ] Breaking changes задокументированы
- [ ] PR description понятен и полон
```

### Code Review Guidelines

**Для автора PR:**
- Описание должно быть понятным
- Добавьте комментарии к сложному коду
- Отвечайте на review комментарии быстро
- Не закрывайте review threads без согласия reviewer

**Для reviewer:**
- Будьте конструктивны и вежливы
- Проверяйте логику, безопасность, производительность
- Одобряйте только если уверены в качестве кода
- Запрашивайте изменения при необходимости

---

## 📚 Документация

### Backend API документация

- **Автогенерация:** через drf-spectacular
- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema:** http://localhost:8000/api/schema/

### Docstrings стиль (Google)

```python
def create_campaign(user: User, data: dict) -> Campaign:
    """
    Создаёт новую кампанию для пользователя.

    Args:
        user: Пользователь, создающий кампанию
        data: Данные кампании (name, marketplace, key)

    Returns:
        Campaign: Созданная кампания

    Raises:
        ValidationError: Если данные невалидны
        IntegrityError: Если кампания с таким ключом уже существует

    Examples:
        >>> user = User.objects.get(email="test@example.com")
        >>> data = {"name": "Test Campaign", "marketplace": "wildberries"}
        >>> campaign = create_campaign(user, data)
    """
    pass
```

### Документация структуры

```
docs/
├── API.md                    # API endpoints документация
├── BACKEND_SETUP.md          # Backend setup руководство
├── MIGRATION_PLAN.md         # План миграции Laravel → Django
├── MODELS_MIGRATION.md       # Миграция моделей
└── QUICKSTART.md            # Быстрый старт
```

---

## 🐛 Отладка

### Backend

```bash
# Django shell
python manage.py shell

# Django shell plus (ipython + auto-import)
python manage.py shell_plus

# Debug сервер с pdb
python manage.py runserver --noreload
```

### Frontend

```bash
# React Developer Tools (Chrome extension)
# Redux DevTools (Chrome extension)

# Vite debug server
npm run dev -- --debug
```

### Docker debugging

```bash
# Логи конкретного сервиса
docker-compose logs -f backend

# Войти в контейнер
docker-compose exec backend bash

# Перезапустить один сервис
docker-compose restart backend

# Проверить health
docker-compose ps
```

---

## 🚀 Деплой

### Pre-production checklist

- [ ] `DJANGO_DEBUG=False`
- [ ] Секретные ключи изменены
- [ ] `ALLOWED_HOSTS` настроены
- [ ] HTTPS включен
- [ ] Database backups настроены
- [ ] Logging настроен (Sentry, LogDNA)
- [ ] Monitoring настроен (DataDog, New Relic)
- [ ] Rate limiting включен
- [ ] Celery queues настроены
- [ ] Static/media files на CDN
- [ ] Database indices проверены

---

## 📊 Производительность

### Мониторинг

```bash
# Backend performance
python manage.py test --parallel

# Database queries analysis
python manage.py check --database default

# Frontend bundle analysis
npm run build -- --analyze
```

### Best practices

- Используйте `select_related()` и `prefetch_related()` для ORM queries
- Кэшируйте дорогие вычисления (Redis)
- Используйте Celery для long-running tasks
- Оптимизируйте N+1 queries
- Используйте database indices для часто запрашиваемых полей

---

## ❓ Вопросы?

- **Issues:** [GitHub Issues](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)
- **Discussions:** [GitHub Discussions](https://github.com/GiornoGiovanaJoJo/marketai-python/discussions)
- **Email:** support@marketai.com

---

## 🎉 Спасибо за вклад!

Каждый PR делает MarketAI лучше. Ваш вклад ценится! ❤️

---

**Последнее обновление:** 24 ноября 2025

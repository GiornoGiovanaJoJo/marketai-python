# MarketAI Python

🚀 **MarketAI** - Платформа для управления рекламными кампаниями на маркетплейсах

## 📋 О проекте

Полнофункциональное веб-приложение для аналитики и управления рекламой на Wildberries и других маркетплейсах.

**Миграция с PHP Laravel на Python Django 5.1** ✅

## 🛠 Технологический стек

### Backend
- **Python:** 3.12+
- **Django:** 5.1
- **Django REST Framework:** 3.14
- **PostgreSQL:** 16
- **Redis:** 7
- **Celery:** 5.3
- **RabbitMQ:** 3
- **JWT Authentication** (Simple JWT)
- **API Documentation:** drf-spectacular

### Frontend
- **React:** 18.2
- **TypeScript:** 5.2
- **Vite:** 5.0
- **Tailwind CSS:** 3.3
- **Radix UI**
- **React Router:** 6.20
- **Recharts:** 3.3

## 📁 Структура проекта

```
marketai-python/
├── backend/              # Django приложение
│   ├── core/            # Настройки проекта
│   ├── apps/            # Django приложения
│   │   ├── authentication/ # JWT аутентификация ✅
│   │   ├── campaigns/       # CRUD кампаний ✅
│   │   ├── statistics/      # Статистика и отчеты ✅
│   │   ├── users/           # Кастомная модель User ✅
│   │   └── integrations/    # Wildberries API ✅
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── Makefile
├── frontend/            # React приложение (в процессе)
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                # Документация
│   └── API.md
├── docker-compose.yml   # Docker конфигурация
├── .env.example        # Пример переменных окружения
└── CONTRIBUTING.md     # Гайд для разработчиков
```

## 🚀 Быстрый старт

### Требования
- Docker и Docker Compose
- Python 3.12+ (для локальной разработки)
- Node.js 20+ (для локальной разработки)

### Запуск с Docker

```bash
# Клонировать репозиторий
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python

# Создать .env файл
cp .env.example .env

# Запустить все сервисы
docker-compose up -d

# Применить миграции
docker-compose exec backend python manage.py migrate

# Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser

# Создать тестовые данные (опционально)
docker-compose exec backend python manage.py create_test_data
```

### Локальная разработка

#### Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Применить миграции
python manage.py migrate

# Запустить сервер
python manage.py runserver

# Или используйте Makefile
make install  # Установка зависимостей
make migrate  # Миграции
make runserver  # Запуск сервера
```

#### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

## 📚 API документация

После запуска проекта документация доступна по адресам:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/
- **API Schema:** http://localhost:8000/api/schema/

Детальная документация: [docs/API.md](docs/API.md)

## 🔧 Основные команды

```bash
# Backend
python manage.py makemigrations  # Создать миграции
python manage.py migrate         # Применить миграции
python manage.py test            # Запустить тесты
python manage.py shell           # Django shell
python manage.py create_test_data  # Создать тестовые данные

# Или используйте Makefile
make help         # Показать все команды
make test         # Тесты
make lint         # Проверка кода
make format       # Форматирование

# Celery
celery -A core worker -l info    # Запустить worker
celery -A core beat -l info      # Запустить scheduler

# Frontend
npm run build                    # Production build
npm run lint                     # Проверка кода
npm run type-check               # TypeScript проверка
```

## 📖 Миграция с Laravel

Проект успешно мигрирован с [marketai-backend](https://github.com/GiornoGiovanaJoJo/marketai-backend) (PHP Laravel) 🎉

### Статус миграции

#### Backend (готово к использованию)
- [x] Базовая структура Django проекта
- [x] Docker конфигурация (PostgreSQL, Redis, RabbitMQ)
- [x] Аутентификация (JWT)
  - Register: `POST /api/auth/register/`
  - Login: `POST /api/auth/login/`
  - Logout: `POST /api/auth/logout/`
  - Me: `GET /api/auth/me/`
- [x] Модель User (кастомная с email как username)
- [x] Модель Campaign (с метриками CTR, ROI, Conversion Rate)
- [x] API эндпоинты CRUD для кампаний
- [x] Интеграция с Wildberries API
  - Sync campaigns
  - Sync statistics
  - Connection test
- [x] Статистика и отчеты
  - Financial report
  - Dashboard stats
  - Campaign performance
- [x] Celery задачи
  - Daily statistics generation
  - Wildberries data sync
- [x] API документация (Swagger/ReDoc)
- [x] Тесты (pytest)
- [x] Management команды

#### Frontend (в процессе)
- [ ] Перенос React компонентов из [marketai-front](https://github.com/GiornoGiovanaJoJo/marketai-front)
- [ ] Интеграция с Django API
- [ ] Настройка axios и JWT
- [ ] Перенос всех 26 страниц

### Маппинг API эндпоинтов

| Laravel Endpoint | Django Endpoint | Статус |
|-----------------|-----------------|-------|
| `POST /api/auth/register` | `POST /api/auth/register/` | ✅ |
| `POST /api/auth/login` | `POST /api/auth/login/` | ✅ |
| `GET /api/auth/me` | `GET /api/auth/me/` | ✅ |
| `POST /api/auth/logout` | `POST /api/auth/logout/` | ✅ |
| `GET /api/campaigns` | `GET /api/campaigns/` | ✅ |
| `POST /api/campaigns` | `POST /api/campaigns/` | ✅ |
| `GET /api/campaigns/{id}` | `GET /api/campaigns/{id}/` | ✅ |
| `PUT /api/campaigns/{id}` | `PUT /api/campaigns/{id}/` | ✅ |
| `DELETE /api/campaigns/{id}` | `DELETE /api/campaigns/{id}/` | ✅ |
| `GET /api/statistics/financial-report` | `GET /api/statistics/financial-report/` | ✅ |
| `GET /api/users` | `GET /api/users/` | ✅ |

## 🤝 Участие в разработке

Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для подробной информации.

**Кратко:**

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License

## 👥 Авторы

- [@GiornoGiovanaJoJo](https://github.com/GiornoGiovanaJoJo)

## 📧 Контакты

По вопросам: [создайте issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)

---

**Статус проекта:** 🟢 Backend готов | 🟡 Frontend в процессе

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
- **Radix UI** - компоненты
- **React Router:** 6.20
- **Axios** - HTTP клиент
- **Recharts:** 3.3 - графики

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
├── frontend/            # React приложение ✨
│   ├── src/
│   │   ├── components/  # Переиспользуемые компоненты
│   │   ├── pages/       # 26 страниц приложения
│   │   ├── services/    # API сервисы
│   │   ├── contexts/    # React Context
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Утилиты
│   │   ├── types/       # TypeScript типы
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docs/                # Документация
└── docker-compose.yml   # Docker конфигурация
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

**Приложение доступно:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **API Docs:** http://localhost:8000/api/docs/
- **Admin:** http://localhost:8000/admin/

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
```

#### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Приложение доступно на http://localhost:3000
```

## 📚 API документация

После запуска проекта документация доступна по адресам:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/
- **API Schema:** http://localhost:8000/api/schema/

Детальная документация: [docs/API.md](docs/API.md)

## 🔧 Основные команды

### Backend
```bash
python manage.py makemigrations  # Создать миграции
python manage.py migrate         # Применить миграции
python manage.py test            # Запустить тесты
python manage.py shell           # Django shell
python manage.py create_test_data  # Создать тестовые данные

# Celery
celery -A core worker -l info    # Запустить worker
celery -A core beat -l info      # Запустить scheduler
```

### Frontend
```bash
npm run dev          # Dev сервер
npm run build        # Production сборка
npm run lint         # Проверка кода
npm run type-check   # TypeScript проверка
npm run preview      # Просмотр production
```

## 📋 Страницы приложения

Frontend включает 26 страниц:

### Аутентификация
- Вход (`/login`)
- Регистрация (`/register`)

### Главные
- Главная (`/`)
- Dashboard (`/dashboard`)
- Кампании (`/campaigns`)

### Реклама
- РНП (`/advertising/rnp`)
- ДДС (`/advertising/dds`)

### Отчеты
- Финансовый отчет (`/reports/financial`)
- План-факт (`/reports/plan-fact`)
- Юнит-экономика (`/reports/unit-economics`)
- Метрики (`/reports/metrics`)
- Heatmap (`/reports/heatmap`)

### Организация
- Организация (`/organization`)
- Сотрудники (`/organization/employees`)
- Партнеры (`/organization/partners`)
- Доступ (`/organization/access`)

### Автоматизация
- Автоматизация (`/automation`)
- Предпоставка (`/automation/pre-delivery`)

### OPI
- OPI Dashboard (`/opi`)

### Реферальная программа
- Обзор (`/referral`)
- Сеть (`/referral/network`)
- Доход (`/referral/income`)
- О программе (`/referral/about`)
- Выплаты (`/referral/payments`)
- Настройки (`/referral/settings`)

## 📚 Миграция с Laravel

Проект успешно мигрирован с [marketai-backend](https://github.com/GiornoGiovanaJoJo/marketai-backend) (PHP Laravel) 🎉

### Статус миграции

#### Backend (готов к использованию) 🟫
- [x] Базовая структура Django проекта
- [x] Docker конфигурация (PostgreSQL, Redis, RabbitMQ)
- [x] Аутентификация (JWT)
- [x] Модель User (кастомная с email)
- [x] Модель Campaign (с метриками)
- [x] API эндпоинты CRUD
- [x] Интеграция с Wildberries API
- [x] Статистика и отчеты
- [x] Celery задачи
- [x] API документация (Swagger/ReDoc)
- [x] Тесты (pytest)

#### Frontend (базовая структура готова) 🟫
- [x] Базовая структура React + TypeScript + Vite
- [x] Настройка Tailwind CSS
- [x] API клиент (axios) с JWT
- [x] API сервисы (auth, campaigns, statistics)
- [x] TypeScript типы
- [x] Роутер (все 26 маршрутов)
- [x] Dockerfile + nginx.conf
- [ ] Перенос компонентов из [marketai-front](https://github.com/GiornoGiovanaJoJo/marketai-front)
- [ ] Перенос всех 26 страниц

## 🤝 Участие в разработке

Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для подробной информации.

## 📝 Лицензия

MIT License

## 👥 Авторы

- [@GiornoGiovanaJoJo](https://github.com/GiornoGiovanaJoJo)

## 📧 Контакты

По вопросам: [создайте issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)

---

**Статус проекта:** 🟫 Backend готов | 🟫 Frontend базовая структура

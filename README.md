# MarketAI Python

🚀 **MarketAI** - Платформа для управления рекламными кампаниями на маркетплейсах

## 📋 О проекте

Полнофункциональное веб-приложение для аналитики и управления рекламой на Wildberries и других маркетплейсах.

**Миграция с PHP Laravel на Python Django 5.1**

## 🛠 Технологический стек

### Backend
- **Python:** 3.12+
- **Django:** 5.1
- **Django REST Framework:** 3.14
- **PostgreSQL:** 16
- **Redis:** 7
- **Celery:** 5.3
- **RabbitMQ:** 3
- **JWT Authentication**

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
│   │   ├── authentication/
│   │   ├── campaigns/
│   │   ├── statistics/
│   │   ├── users/
│   │   └── integrations/
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # React приложение
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml   # Docker конфигурация
└── .env.example        # Пример переменных окружения
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

## 🔧 Основные команды

```bash
# Backend
python manage.py makemigrations  # Создать миграции
python manage.py migrate         # Применить миграции
python manage.py test            # Запустить тесты
python manage.py shell           # Django shell

# Celery
celery -A core worker -l info    # Запустить worker
celery -A core beat -l info      # Запустить scheduler

# Frontend
npm run build                    # Production build
npm run lint                     # Проверка кода
npm run type-check               # TypeScript проверка
```

## 📖 Миграция с Laravel

Проект мигрирован с [marketai-backend](https://github.com/GiornoGiovanaJoJo/marketai-backend) (PHP Laravel)

### Статус миграции

- [x] Базовая структура проекта
- [x] Docker конфигурация
- [ ] Аутентификация (JWT)
- [ ] Модели User и Campaign
- [ ] API эндпоинты
- [ ] Интеграция с Wildberries
- [ ] Статистика и отчеты
- [ ] Celery задачи
- [ ] Frontend интеграция
- [ ] Тесты

## 🤝 Участие в разработке

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

# MarketAI Python

🚀 **MarketAI** - Платформа для управления рекламными кампаниями на маркетплейсах

## 📊 Статус проекта

🟢 **Backend:** 100% готов  
🟡 **Frontend:** 85% готов (миграция завершена!)  
✅ **Готов к тестированию через Docker**

---

## 📝 О проекте

Полнофункциональное веб-приложение для аналитики и управления рекламой на Wildberries и других маркетплейсах.

**Миграция с PHP Laravel на Python Django 5.1** ✅

---

## 🚀 Быстрый старт с Docker

### 1. Предварительные требования

- **Docker Desktop** установлен и запущен
- **Git** для клонирования
- **8 GB RAM** минимум

### 2. Запуск

```bash
# Клонировать и перейти в ветку миграции
git clone https://github.com/GiornoGiovanaJoJo/marketai-python.git
cd marketai-python
git checkout feature/full-frontend-migration

# Создать .env
cp .env.example .env

# Запустить всё
docker-compose up -d

# Создать суперюзера
docker-compose exec backend python manage.py createsuperuser
```

### 3. Открыть приложение

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **API Docs (Swagger):** http://localhost:8000/api/docs/
- **Admin Panel:** http://localhost:8000/admin/
- **RabbitMQ UI:** http://localhost:15672 (guest/guest)

📖 **Полная инструкция:** [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## 🛠️ Технологический стек

### Backend
- **Python:** 3.12+
- **Django:** 5.1
- **Django REST Framework:** 3.14
- **PostgreSQL:** 16
- **Redis:** 7
- **Celery:** 5.3 + RabbitMQ 3
- **JWT Authentication:** djangorestframework-simplejwt
- **API Docs:** drf-spectacular (Swagger/ReDoc)

### Frontend (полная миграция завершена ✅)
- **React:** 18.2
- **TypeScript:** 5.2
- **Vite:** 5.0
- **Tailwind CSS:** 3.3
- **Radix UI** - UI компоненты
- **React Router:** 6.20
- **Redux:** 9.2 - state management
- **Axios** - HTTP клиент
- **Recharts:** 3.3 - графики

---

## 📊 Статус миграции

### Backend - 100% ✅
- [x] Базовая структура Django
- [x] Docker конфигурация (PostgreSQL, Redis, RabbitMQ)
- [x] JWT аутентификация
- [x] CRUD кампаний
- [x] Интеграция с Wildberries API
- [x] Статистика и отчёты
- [x] Celery задачи
- [x] API документация (Swagger/ReDoc)
- [x] Тесты (pytest)

### Frontend - 85% 🟡 (миграция завершена!)
- [x] React + TypeScript + Vite
- [x] Tailwind CSS + Radix UI
- [x] React Router (26 маршрутов)
- [x] **Все 26 страниц перенесено** ✅
- [x] **60+ компонентов перенесено** ✅
- [x] **Redux store** ✅
- [x] **Contexts (Auth, Theme)** ✅
- [x] API сервисы (auth, campaigns, statistics)
- [x] TypeScript типы
- [x] Custom hooks
- [x] Dockerfile + nginx.conf
- [ ] Обновление API эндпоинтов под Django (15%)
- [ ] Тестирование всех страниц (0%)

**Перенесено из [marketai-front](https://github.com/GiornoGiovanaJoJo/marketai-front):**
- 📊 **~150 файлов** (~500 KB кода)
- 📄 **26 полных страниц** с бизнес-логикой
- 🧩 **60+ компонентов** (UI + бизнес)
- 🏪 **Redux store** + slices
- 🔐 **AuthContext** + ThemeContext

📖 **План миграции:** [FRONTEND_MIGRATION_PLAN.md](./FRONTEND_MIGRATION_PLAN.md)

---

## 📚 Документация

- 🐳 [Docker гайд](./DOCKER_GUIDE.md) - полная инструкция по запуску
- 📝 [План миграции Frontend](./FRONTEND_MIGRATION_PLAN.md)
- 🛠️ [Скрипты миграции](./scripts/README.md)
- 💻 [API документация](http://localhost:8000/api/docs/) (после запуска)

---

## 📋 Страницы приложения (26 страниц ✅)

### 🔐 Аутентификация
- Вход (`/login`)
- Регистрация (`/register`)

### 🏠 Главные
- Главная (`/`)
- Dashboard (`/dashboard`)
- Кампании (`/campaigns`)

### 📊 Реклама
- РНП (`/advertising/rnp`)
- ДДС (`/advertising/dds`)

### 📈 Отчёты
- Финансовый отчёт (`/reports/financial`)
- План-факт (`/reports/plan-fact`)
- Юнит-экономика (`/reports/unit-economics`)
- Метрики (`/reports/metrics`)
- Heatmap (`/reports/heatmap`)

### 🏢 Организация
- Организация (`/organization`)
- Сотрудники (`/organization/employees`)
- Партнёры (`/organization/partners`)
- Доступ (`/organization/access`)

### ⚙️ Автоматизация
- Автоматизация (`/automation`)
- Предпоставка (`/automation/pre-delivery`)

### 📆 OPI
- OPI Dashboard (`/opi`)

### 👥 Реферальная программа
- Обзор (`/referral`)
- Сеть (`/referral/network`)
- Доход (`/referral/income`)
- О программе (`/referral/about`)
- Выплаты (`/referral/payments`)
- Настройки (`/referral/settings`)

---

## 🔧 Полезные команды

### Docker
```bash
# Запустить
docker-compose up -d

# Логи
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапустить
docker-compose restart backend
docker-compose restart frontend

# Остановить
docker-compose down
```

### Backend
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
python manage.py shell
python manage.py create_test_data

# Celery
celery -A core worker -l info
celery -A core beat -l info
```

### Frontend
```bash
npm run dev          # Dev сервер
npm run build        # Production сборка
npm run lint         # ESLint
npm run type-check   # TypeScript
```

---

## 🌟 Особенности

- ✅ **Полная миграция frontend** из Laravel/Vue на Django/React
- ✅ **Docker Compose** для лёгкого запуска полного стека
- ✅ **JWT аутентификация** с refresh tokens
- ✅ **Swagger/ReDoc** интерактивная API документация
- ✅ **Celery** для фоновых задач и планировщика
- ✅ **TypeScript** для типобезопасности frontend
- ✅ **Redux** для управления состоянием
- ✅ **Tailwind CSS + Radix UI** для современного UI

---

## 🐛 Известные проблемы

1. **API эндпоинты** - Нужно обновить `src/services/` под Django URL
2. **TypeScript ошибки** - Возможны мелкие ошибки типов после миграции

👉 **Решения см. в** [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## 🤝 Участие в разработке

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'feat: Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📝 Лицензия

MIT License

## 👥 Авторы

- [@GiornoGiovanaJoJo](https://github.com/GiornoGiovanaJoJo)

## 📧 Контакты

По вопросам: [создайте issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues)

---

**Статус:** 🟢 Backend 100% | 🟡 Frontend 85% | ✅ Готов к тестированию!

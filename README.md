# MarketAI Python

🚀 **MarketAI** - Платформа для управления рекламными кампаниями на маркетплейсах

[![Django](https://img.shields.io/badge/Django-5.1.10-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-brightgreen.svg)](https://www.docker.com/)

## 📊 Статус проекта

🔸 **Backend:** 100% готов ✅  
🔶 **Frontend:** 98% готов (добавлена документация по SidebarContext, useSidebar hook)  
✅ **Готов к тестированию через Docker**

**Последнее обновление:** 24 ноября 2025

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

## 📝 О проекте

Полнофункциональное веб-приложение для аналитики и управления рекламой на Wildberries и других маркетплейсах.

**Миграция с PHP Laravel на Python Django 5.1** ✅

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
|---------|----------|
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

### Примеры:

```bash
# Посмотреть логи
./docker-local.sh logs

# Перезапустить backend
./docker-local.sh restart-one backend

# Django shell
./docker-local.sh shell

# Запустить тесты
./docker-local.sh test
```

---

## 🛠️ Технологический стек

### Backend
- **Python:** 3.12+
- **Django:** 5.1.10+ (с патчами безопасности CVE-2025-48432, CVE-2025-64459)
- **Django REST Framework:** 3.14
- **PostgreSQL:** 16
- **Redis:** 7
- **Celery:** 5.3
- **JWT Authentication:** djangorestframework-simplejwt 5.3.1
- **API Docs:** drf-spectacular (Swagger/ReDoc)
- **DuckDB:** 1.1.3 - аналитика

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
- [ ] Обновление API эндпоинтов под Django (10%)
- [ ] E2E тестирование всех страниц (0%)

**Перенесено из [marketai-front](https://github.com/GiornoGiovanaJoJo/marketai-front):**
- 📊 **~150 файлов** (~500 KB кода)
- 📄 **26 полных страниц** с бизнес-логикой
- 🧩 **60+ компонентов** (UI + бизнес)
- 🏪 **Redux Toolkit store** + slices
- 🔐 **Contexts:** AuthContext, ThemeContext, SidebarContext
- 🎣 **Hooks:** useSidebar, useAuth, useTheme

📖 **Документация:**
- [FRONTEND_MIGRATION_PLAN.md](./FRONTEND_MIGRATION_PLAN.md) - План миграции
- [frontend/MIGRATION_STATUS.md](./frontend/MIGRATION_STATUS.md) - Текущий статус
- [frontend/docs/contexts/SidebarContext.md](./frontend/docs/contexts/SidebarContext.md) - SidebarContext API
- [frontend/docs/hooks/useSidebar.md](./frontend/docs/hooks/useSidebar.md) - useSidebar hook

---

## 📚 Документация

- 🧪 **[TESTING.md](./TESTING.md)** - Краткая инструкция по тестированию
- 🐳 **[DOCKER_GUIDE.md](./DOCKER_GUIDE.md)** - Полная инструкция по Docker
- 🚀 **[QUICK_START.md](./QUICK_START.md)** - Быстрый старт
- 📝 **[FRONTEND_MIGRATION_PLAN.md](./FRONTEND_MIGRATION_PLAN.md)** - План миграции frontend
- 🛠️ **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Руководство по разработке
- 💻 **[API документация](http://localhost:8000/api/docs/)** (после запуска)

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

## 🌟 Особенности

- ✅ **Полная миграция frontend** из Laravel/Vue на Django/React
- ✅ **Docker Compose** для лёгкого запуска полного стека
- ✅ **Автоматические скрипты** для запуска (Linux/macOS/Windows)
- ✅ **JWT аутентификация** с refresh tokens
- ✅ **Swagger/ReDoc** интерактивная API документация
- ✅ **Celery** для фоновых задач и планировщика
- ✅ **TypeScript** для типобезопасности frontend
- ✅ **Redux Toolkit** для управления состоянием
- ✅ **Tailwind CSS + Radix UI** для современного UI
- ✅ **DuckDB** для аналитики
- ✅ **Полная документация** компонентов и hooks

---

## 🔐 Безопасность

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

Подробнее: [DOCKER_GUIDE.md - Безопасность](./DOCKER_GUIDE.md#🔐-безопасность-для-production)

---

## 🐛 Решение проблем

### Порты заняты?
```bash
# Освободите порты 3000, 8000, 5432, 6379
./docker-local.sh stop
```

### Что-то не работает?
```bash
# Полная перезагрузка
./docker-local.sh clean
./docker-local.sh start
```

### Проверьте логи:
```bash
./docker-local.sh logs
```

👉 **Подробное решение проблем:** [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## 🧪 Тестирование

```bash
# Backend тесты
./docker-local.sh test

# Или вручную
docker-compose exec backend pytest -v

# С coverage
docker-compose exec backend pytest --cov=. --cov-report=html
```

📖 **Подробное руководство:** [TESTING.md](./TESTING.md)

---

## 🤝 Участие в разработке

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'feat: Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

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

**Обновлено:** 24 ноября 2025, 04:08 MSK
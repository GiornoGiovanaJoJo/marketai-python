# 🚀 Инструкция по миграции на v2.0

Этот гайд поможет вам обновить существующую установку MarketAI Python до v2.0 с критическими патчами безопасности и новыми возможностями.

---

## 📊 Обзор изменений

### 🔒 Критические патчи безопасности
- Django 5.1.10 (CVE-2025-48432, CVE-2025-64459)
- cryptography 43.0.3
- pillow 11.0.0

### ✨ Новые возможности
- GitHub Actions CI/CD pipeline
- Pre-commit hooks
- Production-ready docker-compose
- Monitoring (Sentry SDK)

---

## 🛠️ Шаги миграции

### 1. Сохраните данные (ОБЯЗАТЕЛЬНО)

```bash
# Остановите сервисы
./docker-local.sh stop

# Создайте резервную копию базы данных
docker-compose exec postgres pg_dump -U marketai marketai > backup_$(date +%Y%m%d_%H%M%S).sql

# Сохраните .env файл
cp .env .env.backup
```

### 2. Обновите код

```bash
# Получите последние изменения
git fetch origin
git checkout main
git pull origin main

# Или скачайте release v2.0
# wget https://github.com/GiornoGiovanaJoJo/marketai-python/archive/refs/tags/v2.0.0.tar.gz
```

### 3. Проверьте зависимости

```bash
# Backend - проверьте requirements.txt
cat backend/requirements.txt | grep -E "^Django==|^cryptography==|^pillow=="

# Должно быть:
# Django==5.1.10
# cryptography==43.0.3
# pillow==11.0.0
```

### 4. Пересоберите Docker образы

```bash
# Удалите старые образы
docker-compose down --rmi all

# Пересоберите с новыми зависимостями
docker-compose build --no-cache
```

### 5. Примените миграции (Development)

```bash
# Запустите сервисы
./docker-local.sh start

# Проверьте статус
./docker-local.sh status

# Проверьте логи
./docker-local.sh logs
```

### 6. Верификация

```bash
# Проверьте версию Django
docker-compose exec backend python -c "import django; print(django.VERSION)"
# Ожидаем: (5, 1, 10, 'final', 0)

# Проверьте Django checks
docker-compose exec backend python manage.py check

# Запустите тесты
./docker-local.sh test
```

---

## 🎁 Новые возможности (опционально)

### 1. Pre-commit Hooks

Если вы разработчик:

```bash
# Установите pre-commit
pip install pre-commit

# Установите hooks
pre-commit install

# Запустите на всех файлах (первый раз)
pre-commit run --all-files
```

### 2. Sentry Error Tracking

Добавьте в `.env`:

```bash
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ENVIRONMENT=production  # или development
```

### 3. Production Deployment

Если готовы к production:

```bash
# Создайте .env.production
cp .env.example .env.production

# Установите пароли
DB_PASSWORD=your_secure_password
REDIS_PASSWORD=your_secure_redis_password

# Запустите production стек
docker-compose -f docker-compose.prod.yml up -d
```

---

## ⚠️ Breaking Changes

**Нет breaking changes!** Все изменения обратно совместимы с v1.0.

Однако, обратите внимание:

1. **Django 5.1.10** - новые security проверки могут выявить проблемы в коде
2. **Новые зависимости** - увеличивают размер Docker образа
3. **Pre-commit hooks** - требуют дополнительной установки

---

## 🐛 Решение проблем

### Проблема: Ошибки миграций Django

```bash
# Проверьте статус миграций
docker-compose exec backend python manage.py showmigrations

# Примените миграции вручную
docker-compose exec backend python manage.py migrate
```

### Проблема: Docker образы не пересобираются

```bash
# Полная очистка
docker-compose down -v --rmi all
docker system prune -a --volumes

# Пересоберите
./docker-local.sh clean
./docker-local.sh start
```

### Проблема: Pre-commit hooks фейлятся

```bash
# Обновите hooks
pre-commit autoupdate

# Повторите запуск
pre-commit run --all-files

# Пропустите конкретный hook (временно)
SKIP=mypy git commit -m "message"
```

### Проблема: CI/CD ошибки

```bash
# Локальное тестирование CI
cd backend
pytest --cov=. -v
black --check .
flake8 .

cd ../frontend
npm run lint
npm run type-check
npm run build
```

---

## 📝 Checklist миграции

- [ ] Создан бэкап базы данных
- [ ] Сохранен .env файл
- [ ] Обновлен код до v2.0
- [ ] Проверены зависимости
- [ ] Пересобраны Docker образы
- [ ] Применены миграции
- [ ] Запущены тесты
- [ ] Проверена функциональность
- [ ] Проверены логи

---

## 🔗 Дополнительные ресурсы

- [CHANGELOG.md](./CHANGELOG.md) - Полный список изменений
- [README.md](./README.md) - Обновленная документация
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker инструкции
- [TESTING.md](./TESTING.md) - Тестирование
- [Pull Request #10](https://github.com/GiornoGiovanaJoJo/marketai-python/pull/10) - Подробности v2.0

---

## 📧 Помощь

Если возникли проблемы:

1. Проверьте [CHANGELOG.md](./CHANGELOG.md)
2. Прочитайте [Решение проблем](#🐛-решение-проблем) выше
3. [Создайте issue](https://github.com/GiornoGiovanaJoJo/marketai-python/issues/new)
4. Задайте вопрос в [Pull Request #10](https://github.com/GiornoGiovanaJoJo/marketai-python/pull/10)

---

**Создано:** 24 ноября 2025  
**Версия:** v2.0.0
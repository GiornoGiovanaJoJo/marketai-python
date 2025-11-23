#!/bin/bash

# MarketAI - Скрипт быстрого запуска

set -e  # Выход при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "  __  __            _        _     _    ___ "
echo " |  \\/  | __ _ _ __| | _____| |_  / \\  |_ _|"
echo " | |\\/| |/ _\` | '__| |/ / _ \\ __|/ _ \\  | | "
echo " | |  | | (_| | |  |   <  __/ |_/ ___ \\ | | "
echo " |_|  |_|\\__,_|_|  |_|\\_\\___|\\__/_/   \\_\\___|"
echo ""
echo -e "${NC}"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Установите Docker с https://www.docker.com/get-started${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен${NC}"
    exit 1
fi

# Проверка .env файла
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Файл .env не найден. Создаю из .env.example${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Файл .env создан${NC}"
    echo -e "${YELLOW}⚠️  Пожалуйста, отредактируйте .env и установите:${NC}"
    echo -e "  - DJANGO_SECRET_KEY"
    echo -e "  - FIELD_ENCRYPTION_KEY"
    echo -e "  - JWT_SECRET_KEY"
    echo ""
    read -p "Продолжить с тестовыми ключами? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Отредактируйте .env и запустите скрипт снова${NC}"
        exit 0
    fi
fi

echo -e "${BLUE}🛠️  Проверяю текущие контейнеры...${NC}"

# Проверка Docker Compose команды
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Остановка старых контейнеров
if [ "$(${DOCKER_COMPOSE} ps -q 2>/dev/null)" ]; then
    echo -e "${YELLOW}⚠️  Останавливаю старые контейнеры...${NC}"
    ${DOCKER_COMPOSE} down
fi

# Очистка (опционально)
if [ "$1" = "--clean" ]; then
    echo -e "${YELLOW}🧼 Очистка volumes и образов...${NC}"
    ${DOCKER_COMPOSE} down -v
    docker system prune -f
    echo -e "${GREEN}✅ Очистка завершена${NC}"
fi

# Сборка образов
echo -e "${BLUE}🔨 Сборка Docker образов...${NC}"
${DOCKER_COMPOSE} build

# Запуск контейнеров
echo -e "${BLUE}🚀 Запуск контейнеров...${NC}"
${DOCKER_COMPOSE} up -d

# Ожидание запуска сервисов
echo -e "${BLUE}⏳ Ожидание запуска сервисов...${NC}"
sleep 5

# Проверка healthcheck
echo -e "${BLUE}🔍 Проверка статуса сервисов...${NC}"

check_service() {
    local service=$1
    local check_cmd=$2
    
    if ${DOCKER_COMPOSE} exec -T $service $check_cmd &> /dev/null; then
        echo -e "${GREEN}✅ $service: OK${NC}"
        return 0
    else
        echo -e "${RED}❌ $service: FAILED${NC}"
        return 1
    fi
}

echo ""
check_service postgres "pg_isready -U marketai"
check_service redis "redis-cli ping"
check_service rabbitmq "rabbitmq-diagnostics ping"
echo ""

# Применение миграций
echo -e "${BLUE}📦 Применение миграций базы данных...${NC}"
${DOCKER_COMPOSE} exec -T backend python manage.py migrate --noinput

# Сбор статики
echo -e "${BLUE}📦 Сбор статических файлов...${NC}"
${DOCKER_COMPOSE} exec -T backend python manage.py collectstatic --noinput

echo ""
echo -e "${GREEN}"
echo "===================================="
echo "  ✅ MarketAI успешно запущен!"
echo "===================================="
echo -e "${NC}"
echo -e "${BLUE}🎯 Доступные сервисы:${NC}"
echo ""
echo -e "  🖥️  Frontend:           ${GREEN}http://localhost:3000${NC}"
echo -e "  🔌 Backend API:        ${GREEN}http://localhost:8000${NC}"
echo -e "  📚 API Docs (Swagger): ${GREEN}http://localhost:8000/api/schema/swagger-ui/${NC}"
echo -e "  📚 API Docs (Redoc):   ${GREEN}http://localhost:8000/api/schema/redoc/${NC}"
echo -e "  🔑 Django Admin:       ${GREEN}http://localhost:8000/admin/${NC}"
echo -e "  🐇 RabbitMQ UI:        ${GREEN}http://localhost:15672${NC} (guest/guest)"
echo ""
echo -e "${BLUE}🛠️  Полезные команды:${NC}"
echo ""
echo -e "  • Просмотр логов:        ${YELLOW}${DOCKER_COMPOSE} logs -f${NC}"
echo -e "  • Остановить сервисы:   ${YELLOW}${DOCKER_COMPOSE} down${NC}"
echo -e "  • Перезапустить:       ${YELLOW}${DOCKER_COMPOSE} restart${NC}"
echo -e "  • Статус контейнеров: ${YELLOW}${DOCKER_COMPOSE} ps${NC}"
echo ""
echo -e "${BLUE}ℹ️  Чтобы создать суперпользователя Django:${NC}"
echo -e "  ${YELLOW}${DOCKER_COMPOSE} exec backend python manage.py createsuperuser${NC}"
echo ""
echo -e "${GREEN}🎉 Приятной работы!${NC}"
echo ""

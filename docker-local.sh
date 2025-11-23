#!/bin/bash
# MarketAI Python - Local Docker Testing Script
# Usage: ./docker-local.sh [command]

set -e

COLOR_RESET="\033[0m"
COLOR_GREEN="\033[0;32m"
COLOR_YELLOW="\033[1;33m"
COLOR_RED="\033[0;31m"
COLOR_BLUE="\033[0;34m"

function print_header() {
    echo -e "${COLOR_BLUE}"
    echo "═══════════════════════════════════════════════════════════"
    echo "  $1"
    echo "═══════════════════════════════════════════════════════════"
    echo -e "${COLOR_RESET}"
}

function print_success() {
    echo -e "${COLOR_GREEN}✓ $1${COLOR_RESET}"
}

function print_warning() {
    echo -e "${COLOR_YELLOW}⚠ $1${COLOR_RESET}"
}

function print_error() {
    echo -e "${COLOR_RED}✗ $1${COLOR_RESET}"
}

function check_requirements() {
    print_header "Проверка требований"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Установите Docker Desktop."
        exit 1
    fi
    print_success "Docker установлен"
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose не установлен"
        exit 1
    fi
    print_success "Docker Compose установлен"
    
    if [ ! -f ".env" ]; then
        print_warning ".env файл не найден, копируем из .env.example"
        cp .env.example .env
        print_success ".env файл создан"
    else
        print_success ".env файл найден"
    fi
}

function start_services() {
    print_header "Запуск MarketAI Docker"
    
    # Останавливаем старые контейнеры
    docker-compose down 2>/dev/null || true
    
    # Собираем образы
    print_warning "Сборка Docker образов (это может занять несколько минут)..."
    docker-compose build --no-cache
    
    # Запускаем сервисы
    print_warning "Запуск сервисов..."
    docker-compose up -d postgres redis
    
    # Ждём готовности БД
    print_warning "Ожидание готовности PostgreSQL..."
    sleep 10
    
    # Запускаем backend
    docker-compose up -d backend celery_worker celery_beat
    
    # Ждём готовности backend
    print_warning "Ожидание готовности Backend..."
    sleep 15
    
    # Запускаем frontend
    docker-compose up -d frontend
    
    print_success "Все сервисы запущены!"
    echo ""
    print_header "Доступ к сервисам"
    echo "Frontend:        http://localhost:3000"
    echo "Backend API:     http://localhost:8000/api"
    echo "Admin Panel:     http://localhost:8000/admin"
    echo "                 login: admin / password: admin"
    echo "API Docs:        http://localhost:8000/api/docs"
    echo ""
}

function stop_services() {
    print_header "Остановка сервисов"
    docker-compose down
    print_success "Сервисы остановлены"
}

function clean_all() {
    print_header "Полная очистка"
    print_warning "Это удалит все контейнеры, образы и данные!"
    read -p "Продолжить? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all
        print_success "Очистка завершена"
    else
        print_warning "Очистка отменена"
    fi
}

function show_logs() {
    print_header "Логи сервисов"
    docker-compose logs -f --tail=100
}

function restart_service() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        print_error "Укажите сервис: backend, frontend, celery_worker, postgres, redis"
        exit 1
    fi
    print_header "Перезапуск сервиса: $SERVICE"
    docker-compose restart $SERVICE
    print_success "Сервис $SERVICE перезапущен"
}

function run_tests() {
    print_header "Запуск тестов Backend"
    docker-compose exec backend pytest -v
}

function shell() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        SERVICE="backend"
    fi
    print_header "Django Shell ($SERVICE)"
    docker-compose exec $SERVICE python manage.py shell
}

function migrate() {
    print_header "Миграции базы данных"
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    print_success "Миграции применены"
}

function show_status() {
    print_header "Статус сервисов"
    docker-compose ps
}

function show_help() {
    echo "Usage: ./docker-local.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Запустить все сервисы"
    echo "  stop        - Остановить все сервисы"
    echo "  restart     - Перезапустить все сервисы"
    echo "  restart-one <service> - Перезапустить один сервис"
    echo "  logs        - Показать логи всех сервисов"
    echo "  status      - Показать статус сервисов"
    echo "  shell       - Django shell"
    echo "  migrate     - Применить миграции БД"
    echo "  test        - Запустить тесты"
    echo "  clean       - Полная очистка (удалить все)"
    echo "  help        - Показать эту справку"
    echo ""
}

# Main
COMMAND=${1:-start}

case $COMMAND in
    start)
        check_requirements
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        start_services
        ;;
    restart-one)
        restart_service $2
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    shell)
        shell $2
        ;;
    migrate)
        migrate
        ;;
    test)
        run_tests
        ;;
    clean)
        clean_all
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Неизвестная команда: $COMMAND"
        show_help
        exit 1
        ;;
esac

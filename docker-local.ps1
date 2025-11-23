# MarketAI Python - Local Docker Testing Script (PowerShell)
# Usage: .\docker-local.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "start",
    [Parameter(Position=1)]
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor Blue
    Write-Host "  $Text" -ForegroundColor Blue
    Write-Host "=" * 60 -ForegroundColor Blue
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Text)
    Write-Host "⚠ $Text" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "✗ $Text" -ForegroundColor Red
}

function Test-Requirements {
    Write-Header "Проверка требований"
    
    # Check Docker
    try {
        $null = docker --version
        Write-Success "Docker установлен"
    } catch {
        Write-Error-Custom "Docker не установлен. Установите Docker Desktop."
        exit 1
    }
    
    # Check Docker Compose
    try {
        $null = docker-compose --version
        Write-Success "Docker Compose установлен"
    } catch {
        try {
            $null = docker compose version
            Write-Success "Docker Compose установлен"
        } catch {
            Write-Error-Custom "Docker Compose не установлен"
            exit 1
        }
    }
    
    # Check .env file
    if (-not (Test-Path ".env")) {
        Write-Warning-Custom ".env файл не найден, копируем из .env.example"
        Copy-Item ".env.example" ".env"
        Write-Success ".env файл создан"
    } else {
        Write-Success ".env файл найден"
    }
}

function Start-Services {
    Write-Header "Запуск MarketAI Docker"
    
    # Stop old containers
    try {
        docker-compose down 2>$null
    } catch {}
    
    # Build images
    Write-Warning-Custom "Сборка Docker образов (это может занять несколько минут)..."
    docker-compose build --no-cache
    
    # Start databases
    Write-Warning-Custom "Запуск БД..."
    docker-compose up -d postgres redis
    
    Write-Warning-Custom "Ожидание готовности PostgreSQL..."
    Start-Sleep -Seconds 10
    
    # Start backend services
    docker-compose up -d backend celery_worker celery_beat
    
    Write-Warning-Custom "Ожидание готовности Backend..."
    Start-Sleep -Seconds 15
    
    # Start frontend
    docker-compose up -d frontend
    
    Write-Success "Все сервисы запущены!"
    Write-Host ""
    Write-Header "Доступ к сервисам"
    Write-Host "Frontend:        http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend API:     http://localhost:8000/api" -ForegroundColor Cyan
    Write-Host "Admin Panel:     http://localhost:8000/admin" -ForegroundColor Cyan
    Write-Host "                 login: admin / password: admin" -ForegroundColor Gray
    Write-Host "API Docs:        http://localhost:8000/api/docs" -ForegroundColor Cyan
    Write-Host ""
}

function Stop-Services {
    Write-Header "Остановка сервисов"
    docker-compose down
    Write-Success "Сервисы остановлены"
}

function Remove-All {
    Write-Header "Полная очистка"
    Write-Warning-Custom "Это удалит все контейнеры, образы и данные!"
    $confirm = Read-Host "Продолжить? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v --rmi all
        Write-Success "Очистка завершена"
    } else {
        Write-Warning-Custom "Очистка отменена"
    }
}

function Show-Logs {
    Write-Header "Логи сервисов"
    docker-compose logs -f --tail=100
}

function Restart-OneService {
    param([string]$ServiceName)
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Error-Custom "Укажите сервис: backend, frontend, celery_worker, postgres, redis"
        exit 1
    }
    Write-Header "Перезапуск сервиса: $ServiceName"
    docker-compose restart $ServiceName
    Write-Success "Сервис $ServiceName перезапущен"
}

function Start-Tests {
    Write-Header "Запуск тестов Backend"
    docker-compose exec backend pytest -v
}

function Open-Shell {
    param([string]$ServiceName = "backend")
    Write-Header "Django Shell ($ServiceName)"
    docker-compose exec $ServiceName python manage.py shell
}

function Start-Migrate {
    Write-Header "Миграции базы данных"
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    Write-Success "Миграции применены"
}

function Show-Status {
    Write-Header "Статус сервисов"
    docker-compose ps
}

function Show-Help {
    Write-Host "Usage: .\docker-local.ps1 [command] [service]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start           - Запустить все сервисы"
    Write-Host "  stop            - Остановить все сервисы"
    Write-Host "  restart         - Перезапустить все сервисы"
    Write-Host "  restart-one <service> - Перезапустить один сервис"
    Write-Host "  logs            - Показать логи всех сервисов"
    Write-Host "  status          - Показать статус сервисов"
    Write-Host "  shell           - Django shell"
    Write-Host "  migrate         - Применить миграции БД"
    Write-Host "  test            - Запустить тесты"
    Write-Host "  clean           - Полная очистка (удалить все)"
    Write-Host "  help            - Показать эту справку"
    Write-Host ""
}

# Main execution
switch ($Command.ToLower()) {
    "start" {
        Test-Requirements
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Stop-Services
        Start-Services
    }
    "restart-one" {
        Restart-OneService $Service
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "shell" {
        Open-Shell $Service
    }
    "migrate" {
        Start-Migrate
    }
    "test" {
        Start-Tests
    }
    "clean" {
        Remove-All
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error-Custom "Неизвестная команда: $Command"
        Show-Help
        exit 1
    }
}

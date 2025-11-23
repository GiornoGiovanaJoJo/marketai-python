# MarketAI - Скрипт быстрого запуска для Windows
# PowerShell скрипт

$ErrorActionPreference = "Stop"

# Цвета
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-Host @"
  __  __            _        _     _    ___ 
 |  \/  | __ _ _ __| | _____| |_  / \  |_ _|
 | |\/| |/ _`` | '__| |/ / _ \ __|/ _ \  | | 
 | |  | | (_| | |  |   <  __/ |_/ ___ \ | | 
 |_|  |_|\__,_|_|  |_|\_\___|\__/_/   \_\___|

"@ -ForegroundColor Blue

# Проверка Docker
Write-Host "🔍 Проверка Docker..." -ForegroundColor Blue

try {
    docker --version | Out-Null
    Write-Host "✅ Docker установлен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не установлен. Установите Docker Desktop с https://www.docker.com/get-started" -ForegroundColor Red
    exit 1
}

try {
    docker compose version | Out-Null
    $dockerCompose = "docker compose"
    Write-Host "✅ Docker Compose доступен" -ForegroundColor Green
} catch {
    try {
        docker-compose --version | Out-Null
        $dockerCompose = "docker-compose"
        Write-Host "✅ Docker Compose доступен" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker Compose не установлен" -ForegroundColor Red
        exit 1
    }
}

# Проверка .env файла
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Файл .env не найден. Создаю из .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Файл .env создан" -ForegroundColor Green
    Write-Host "⚠️  Пожалуйста, отредактируйте .env и установите:" -ForegroundColor Yellow
    Write-Host "  - DJANGO_SECRET_KEY"
    Write-Host "  - FIELD_ENCRYPTION_KEY"
    Write-Host "  - JWT_SECRET_KEY"
    Write-Host ""
    
    $response = Read-Host "Продолжить с тестовыми ключами? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "ℹ️  Отредактируйте .env и запустите скрипт снова" -ForegroundColor Blue
        exit 0
    }
}

Write-Host "🛠️  Проверяю текущие контейнеры..." -ForegroundColor Blue

# Остановка старых контейнеров
$runningContainers = & $dockerCompose ps -q 2>$null
if ($runningContainers) {
    Write-Host "⚠️  Останавливаю старые контейнеры..." -ForegroundColor Yellow
    & $dockerCompose down
}

# Очистка (если указан параметр --clean)
if ($args -contains "--clean") {
    Write-Host "🧼 Очистка volumes и образов..." -ForegroundColor Yellow
    & $dockerCompose down -v
    docker system prune -f
    Write-Host "✅ Очистка завершена" -ForegroundColor Green
}

# Сборка образов
Write-Host "🔨 Сборка Docker образов..." -ForegroundColor Blue
& $dockerCompose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке образов" -ForegroundColor Red
    exit 1
}

# Запуск контейнеров
Write-Host "🚀 Запуск контейнеров..." -ForegroundColor Blue
& $dockerCompose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при запуске контейнеров" -ForegroundColor Red
    exit 1
}

# Ожидание запуска
Write-Host "⏳ Ожидание запуска сервисов..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Проверка healthcheck
Write-Host "🔍 Проверка статуса сервисов..." -ForegroundColor Blue
Write-Host ""

function Test-Service {
    param(
        [string]$ServiceName,
        [string]$Command
    )
    
    try {
        $result = & $dockerCompose exec -T $ServiceName $Command.Split(' ') 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $ServiceName : OK" -ForegroundColor Green
            return $true
        }
    } catch {}
    
    Write-Host "❌ $ServiceName : FAILED" -ForegroundColor Red
    return $false
}

Test-Service "postgres" "pg_isready -U marketai"
Test-Service "redis" "redis-cli ping"
Test-Service "rabbitmq" "rabbitmq-diagnostics ping"

Write-Host ""

# Применение миграций
Write-Host "📦 Применение миграций базы данных..." -ForegroundColor Blue
& $dockerCompose exec -T backend python manage.py migrate --noinput

# Сбор статики
Write-Host "📦 Сбор статических файлов..." -ForegroundColor Blue
& $dockerCompose exec -T backend python manage.py collectstatic --noinput

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  ✅ MarketAI успешно запущен!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 Доступные сервисы:" -ForegroundColor Blue
Write-Host ""
Write-Host "  🖥️  Frontend:           " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "  🔌 Backend API:        " -NoNewline
Write-Host "http://localhost:8000" -ForegroundColor Green
Write-Host "  📚 API Docs (Swagger): " -NoNewline
Write-Host "http://localhost:8000/api/schema/swagger-ui/" -ForegroundColor Green
Write-Host "  📚 API Docs (Redoc):   " -NoNewline
Write-Host "http://localhost:8000/api/schema/redoc/" -ForegroundColor Green
Write-Host "  🔑 Django Admin:       " -NoNewline
Write-Host "http://localhost:8000/admin/" -ForegroundColor Green
Write-Host "  🐇 RabbitMQ UI:        " -NoNewline
Write-Host "http://localhost:15672" -ForegroundColor Green -NoNewline
Write-Host " (guest/guest)"
Write-Host ""

Write-Host "🛠️  Полезные команды:" -ForegroundColor Blue
Write-Host ""
Write-Host "  • Просмотр логов:        " -NoNewline
Write-Host "$dockerCompose logs -f" -ForegroundColor Yellow
Write-Host "  • Остановить сервисы:   " -NoNewline
Write-Host "$dockerCompose down" -ForegroundColor Yellow
Write-Host "  • Перезапустить:       " -NoNewline
Write-Host "$dockerCompose restart" -ForegroundColor Yellow
Write-Host "  • Статус контейнеров: " -NoNewline
Write-Host "$dockerCompose ps" -ForegroundColor Yellow
Write-Host ""

Write-Host "ℹ️  Чтобы создать суперпользователя Django:" -ForegroundColor Blue
Write-Host "  " -NoNewline
Write-Host "$dockerCompose exec backend python manage.py createsuperuser" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎉 Приятной работы!" -ForegroundColor Green
Write-Host ""

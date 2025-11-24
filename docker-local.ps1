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
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Text)
    Write-Host "[WARN] $Text" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "[ERROR] $Text" -ForegroundColor Red
}

function Test-Requirements {
    Write-Header "Checking Requirements"
    
    # Check Docker
    try {
        $null = docker --version
        Write-Success "Docker installed"
    } catch {
        Write-Error-Custom "Docker not installed. Please install Docker Desktop."
        exit 1
    }
    
    # Check Docker Compose
    try {
        $null = docker-compose --version
        Write-Success "Docker Compose installed"
    } catch {
        try {
            $null = docker compose version
            Write-Success "Docker Compose installed"
        } catch {
            Write-Error-Custom "Docker Compose not installed"
            exit 1
        }
    }
    
    # Check .env file
    if (-not (Test-Path ".env")) {
        Write-Warning-Custom ".env file not found, copying from .env.example"
        Copy-Item ".env.example" ".env"
        Write-Success ".env file created"
    } else {
        Write-Success ".env file found"
    }
}

function Start-Services {
    Write-Header "Starting MarketAI Docker"
    
    # Stop old containers
    try {
        docker-compose down 2>$null
    } catch {}
    
    # Build images
    Write-Warning-Custom "Building Docker images (this may take a few minutes)..."
    docker-compose build --no-cache
    
    # Start databases
    Write-Warning-Custom "Starting databases..."
    docker-compose up -d postgres redis
    
    Write-Warning-Custom "Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 10
    
    # Start backend services
    docker-compose up -d backend celery_worker celery_beat
    
    Write-Warning-Custom "Waiting for Backend to be ready..."
    Start-Sleep -Seconds 15
    
    # Start frontend
    docker-compose up -d frontend
    
    Write-Success "All services started!"
    Write-Host ""
    Write-Header "Access Services"
    Write-Host "Frontend:        http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend API:     http://localhost:8000/api" -ForegroundColor Cyan
    Write-Host "Admin Panel:     http://localhost:8000/admin" -ForegroundColor Cyan
    Write-Host "                 login: admin / password: admin" -ForegroundColor Gray
    Write-Host "API Docs:        http://localhost:8000/api/docs" -ForegroundColor Cyan
    Write-Host ""
}

function Stop-Services {
    Write-Header "Stopping Services"
    docker-compose down
    Write-Success "Services stopped"
}

function Remove-All {
    Write-Header "Full Cleanup"
    Write-Warning-Custom "This will remove all containers, images and data!"
    $confirm = Read-Host "Continue? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v --rmi all
        Write-Success "Cleanup complete"
    } else {
        Write-Warning-Custom "Cleanup cancelled"
    }
}

function Show-Logs {
    Write-Header "Service Logs"
    docker-compose logs -f --tail=100
}

function Restart-OneService {
    param([string]$ServiceName)
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Error-Custom "Specify service: backend, frontend, celery_worker, postgres, redis"
        exit 1
    }
    Write-Header "Restarting service: $ServiceName"
    docker-compose restart $ServiceName
    Write-Success "Service $ServiceName restarted"
}

function Start-Tests {
    Write-Header "Running Backend Tests"
    docker-compose exec backend pytest -v
}

function Open-Shell {
    param([string]$ServiceName = "backend")
    Write-Header "Django Shell ($ServiceName)"
    docker-compose exec $ServiceName python manage.py shell
}

function Start-Migrate {
    Write-Header "Database Migrations"
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    Write-Success "Migrations applied"
}

function Show-Status {
    Write-Header "Services Status"
    docker-compose ps
}

function Show-Help {
    Write-Host "Usage: .\docker-local.ps1 [command] [service]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start           - Start all services"
    Write-Host "  stop            - Stop all services"
    Write-Host "  restart         - Restart all services"
    Write-Host "  restart-one <service> - Restart one service"
    Write-Host "  logs            - Show logs of all services"
    Write-Host "  status          - Show services status"
    Write-Host "  shell           - Django shell"
    Write-Host "  migrate         - Apply database migrations"
    Write-Host "  test            - Run tests"
    Write-Host "  clean           - Full cleanup (remove everything)"
    Write-Host "  help            - Show this help"
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
        Write-Error-Custom "Unknown command: $Command"
        Show-Help
        exit 1
    }
}

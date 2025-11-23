# UI Components Migration Script
# Automatically downloads all UI components from marketai-front repository

$ErrorActionPreference = "Stop"

# Configuration
$SOURCE_REPO = "https://raw.githubusercontent.com/GiornoGiovanaJoJo/marketai-front/main"
$TARGET_BASE = "frontend/src/components"

# Colors for output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Info "Starting UI Components Migration..."
Write-Info "Source: marketai-front repository"
Write-Info "Target: marketai-python/frontend"
Write-Host ""

# Ensure target directories exist
Write-Info "Creating target directories..."
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/ui" | Out-Null
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/UserInfoBar" | Out-Null
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/navigation" | Out-Null
Write-Success "Directories created"
Write-Host ""

# ============================================
# BATCH 1: UI Components - Forms & Inputs (8 files)
# ============================================
Write-Info "BATCH 1: Forms & Inputs (8 files)"
$batch1 = @(
    "button.tsx",
    "input.tsx",
    "checkbox.tsx",
    "switch.tsx",
    "select.tsx",
    "date-picker.tsx",
    "date-range-picker.tsx",
    "period-picker.tsx"
)

$completed = 0
$total = $batch1.Count

foreach ($file in $batch1) {
    $url = "$SOURCE_REPO/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 1 completed: $completed/$total files"
Write-Host ""

# ============================================
# BATCH 2: UI Components - Layouts & Containers (5 files)
# ============================================
Write-Info "BATCH 2: Layouts & Containers (5 files)"
$batch2 = @(
    "card.tsx",
    "dialog.tsx",
    "sheet.tsx",
    "popover.tsx",
    "tabs.tsx"
)

$completed = 0
$total = $batch2.Count

foreach ($file in $batch2) {
    $url = "$SOURCE_REPO/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 2 completed: $completed/$total files"
Write-Host ""

# ============================================
# BATCH 3: UI Components - Data Display (4 files)
# ============================================
Write-Info "BATCH 3: Data Display (4 files)"
$batch3 = @(
    "table.tsx",
    "chart.tsx",
    "badge.tsx",
    "progress.tsx"
)

$completed = 0
$total = $batch3.Count

foreach ($file in $batch3) {
    $url = "$SOURCE_REPO/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 3 completed: $completed/$total files"
Write-Host ""

# ============================================
# BATCH 4: UI Components - Navigation & Notifications (5 files)
# ============================================
Write-Info "BATCH 4: Navigation & Notifications (5 files)"
$batch4 = @(
    "dropdown-menu.tsx",
    "calendar.tsx",
    "toast.tsx",
    "toaster.tsx",
    "use-toast.ts"
)

$completed = 0
$total = $batch4.Count

foreach ($file in $batch4) {
    $url = "$SOURCE_REPO/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 4 completed: $completed/$total files"
Write-Host ""

# ============================================
# BATCH 5: Business Components - Authentication (3 files)
# ============================================
Write-Info "BATCH 5: Business Components - Authentication (3 files)"
$batch5 = @(
    "AuthInitializer.tsx",
    "ProtectedRoute.tsx",
    "LogoutButton.tsx"
)

$completed = 0
$total = $batch5.Count

foreach ($file in $batch5) {
    $url = "$SOURCE_REPO/src/components/$file"
    $dest = "$TARGET_BASE/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 5 completed: $completed/$total files"
Write-Host ""

# ============================================
# BATCH 6: Business Components - Management & Filters (3 files)
# ============================================
Write-Info "BATCH 6: Business Components - Management & Filters (3 files)"
$batch6 = @(
    "AccessManagement.tsx",
    "BlockVisibilityManager.tsx",
    "FilterPanel.tsx"
)

$completed = 0
$total = $batch6.Count

foreach ($file in $batch6) {
    $url = "$SOURCE_REPO/src/components/$file"
    $dest = "$TARGET_BASE/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download $file"
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Success "Batch 6 completed: $completed/$total files"
Write-Host ""

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "===========================================" -ForegroundColor Yellow
Write-Success "Migration completed!"
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""
Write-Info "Next steps:"
Write-Host "  1. Review migrated components in $TARGET_BASE"
Write-Host "  2. Run: npm install (to ensure all dependencies)"
Write-Host "  3. Run: npm run build (to check TypeScript)"
Write-Host "  4. Run: npm run lint (to check code quality)"
Write-Host "  5. Commit changes: git add . && git commit -m 'feat: Migrate UI components from marketai-front'"
Write-Host "  6. Push: git push origin feature/migrate-ui-components"
Write-Host ""
Write-Success "All done! 🎉"

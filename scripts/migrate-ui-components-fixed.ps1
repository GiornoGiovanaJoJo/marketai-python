# UI Components Migration Script (Fixed)
# Uses correct GitHub raw URLs with commit SHA

$ErrorActionPreference = "Stop"

# Configuration - using specific commit SHA
$COMMIT_SHA = "c007542b75f12ad88ecd28c1e2de87c614b16289"
$SOURCE_BASE = "https://raw.githubusercontent.com/GiornoGiovanaJoJo/marketai-front/$COMMIT_SHA"
$TARGET_BASE = "frontend/src/components"

Write-Host "[INFO] Starting UI Components Migration..." -ForegroundColor Cyan
Write-Host "[INFO] Source: marketai-front (commit: $COMMIT_SHA)" -ForegroundColor Cyan
Write-Host "[INFO] Target: marketai-python/frontend" -ForegroundColor Cyan
Write-Host ""

# Ensure target directories exist
Write-Host "[INFO] Creating target directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/ui" | Out-Null
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/UserInfoBar" | Out-Null
New-Item -ItemType Directory -Force -Path "$TARGET_BASE/navigation" | Out-Null
Write-Host "[SUCCESS] Directories created" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 1: UI Components - Forms and Inputs
# ============================================
Write-Host "[INFO] BATCH 1: Forms and Inputs (8 files)" -ForegroundColor Cyan
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
foreach ($file in $batch1) {
    $url = "$SOURCE_BASE/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host "[SUCCESS] Batch 1: $completed/$($batch1.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 2: Layouts and Containers
# ============================================
Write-Host "[INFO] BATCH 2: Layouts and Containers (5 files)" -ForegroundColor Cyan
$batch2 = @(
    "card.tsx",
    "dialog.tsx",
    "sheet.tsx",
    "popover.tsx",
    "tabs.tsx"
)

$completed = 0
foreach ($file in $batch2) {
    $url = "$SOURCE_BASE/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
    }
}
Write-Host "[SUCCESS] Batch 2: $completed/$($batch2.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 3: Data Display
# ============================================
Write-Host "[INFO] BATCH 3: Data Display (4 files)" -ForegroundColor Cyan
$batch3 = @(
    "table.tsx",
    "chart.tsx",
    "badge.tsx",
    "progress.tsx"
)

$completed = 0
foreach ($file in $batch3) {
    $url = "$SOURCE_BASE/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
    }
}
Write-Host "[SUCCESS] Batch 3: $completed/$($batch3.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 4: Navigation and Notifications
# ============================================
Write-Host "[INFO] BATCH 4: Navigation and Notifications (5 files)" -ForegroundColor Cyan
$batch4 = @(
    "dropdown-menu.tsx",
    "calendar.tsx",
    "toast.tsx",
    "toaster.tsx",
    "use-toast.ts"
)

$completed = 0
foreach ($file in $batch4) {
    $url = "$SOURCE_BASE/src/components/ui/$file"
    $dest = "$TARGET_BASE/ui/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
    }
}
Write-Host "[SUCCESS] Batch 4: $completed/$($batch4.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 5: Business Components - Authentication
# ============================================
Write-Host "[INFO] BATCH 5: Business - Authentication (3 files)" -ForegroundColor Cyan
$batch5 = @(
    "AuthInitializer.tsx",
    "ProtectedRoute.tsx",
    "LogoutButton.tsx"
)

$completed = 0
foreach ($file in $batch5) {
    $url = "$SOURCE_BASE/src/components/$file"
    $dest = "$TARGET_BASE/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
    }
}
Write-Host "[SUCCESS] Batch 5: $completed/$($batch5.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# BATCH 6: Business Components - Management
# ============================================
Write-Host "[INFO] BATCH 6: Business - Management (3 files)" -ForegroundColor Cyan
$batch6 = @(
    "AccessManagement.tsx",
    "BlockVisibilityManager.tsx",
    "FilterPanel.tsx"
)

$completed = 0
foreach ($file in $batch6) {
    $url = "$SOURCE_BASE/src/components/$file"
    $dest = "$TARGET_BASE/$file"
    
    try {
        Write-Host "  Downloading $file..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        $completed++
        Write-Host " Done" -ForegroundColor Green
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  URL: $url" -ForegroundColor Yellow
    }
}
Write-Host "[SUCCESS] Batch 6: $completed/$($batch6.Count) files" -ForegroundColor Green
Write-Host ""

# ============================================
# Summary
# ============================================
Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "[SUCCESS] Migration completed!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "[INFO] Next steps:" -ForegroundColor Cyan
Write-Host "  1. cd frontend"
Write-Host "  2. npm install"
Write-Host "  3. npm run build"
Write-Host "  4. git add src/components/"
Write-Host "  5. git commit -m 'feat: Migrate UI components'"
Write-Host "  6. git push origin feat/ui-components"
Write-Host ""
Write-Host "[SUCCESS] All done!" -ForegroundColor Green

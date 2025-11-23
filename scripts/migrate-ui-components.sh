#!/bin/bash
# UI Components Migration Script (Bash version for Linux/Mac)
# Automatically downloads all UI components from marketai-front repository

set -e

# Configuration
SOURCE_REPO="https://raw.githubusercontent.com/GiornoGiovanaJoJo/marketai-front/main"
TARGET_BASE="frontend/src/components"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
function info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

function success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function error() {
    echo -e "${RED}❌ $1${NC}"
}

info "Starting UI Components Migration..."
info "Source: marketai-front repository"
info "Target: marketai-python/frontend"
echo ""

# Ensure target directories exist
info "Creating target directories..."
mkdir -p "$TARGET_BASE/ui"
mkdir -p "$TARGET_BASE/UserInfoBar"
mkdir -p "$TARGET_BASE/navigation"
success "Directories created"
echo ""

# ============================================
# BATCH 1: UI Components - Forms & Inputs (8 files)
# ============================================
info "BATCH 1: Forms & Inputs (8 files)"
BATCH1=(
    "button.tsx"
    "input.tsx"
    "checkbox.tsx"
    "switch.tsx"
    "select.tsx"
    "date-picker.tsx"
    "date-range-picker.tsx"
    "period-picker.tsx"
)

completed=0
total=${#BATCH1[@]}

for file in "${BATCH1[@]}"; do
    url="$SOURCE_REPO/src/components/ui/$file"
    dest="$TARGET_BASE/ui/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 1 completed: $completed/$total files"
echo ""

# ============================================
# BATCH 2: UI Components - Layouts & Containers (5 files)
# ============================================
info "BATCH 2: Layouts & Containers (5 files)"
BATCH2=(
    "card.tsx"
    "dialog.tsx"
    "sheet.tsx"
    "popover.tsx"
    "tabs.tsx"
)

completed=0
total=${#BATCH2[@]}

for file in "${BATCH2[@]}"; do
    url="$SOURCE_REPO/src/components/ui/$file"
    dest="$TARGET_BASE/ui/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 2 completed: $completed/$total files"
echo ""

# ============================================
# BATCH 3: UI Components - Data Display (4 files)
# ============================================
info "BATCH 3: Data Display (4 files)"
BATCH3=(
    "table.tsx"
    "chart.tsx"
    "badge.tsx"
    "progress.tsx"
)

completed=0
total=${#BATCH3[@]}

for file in "${BATCH3[@]}"; do
    url="$SOURCE_REPO/src/components/ui/$file"
    dest="$TARGET_BASE/ui/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 3 completed: $completed/$total files"
echo ""

# ============================================
# BATCH 4: UI Components - Navigation & Notifications (5 files)
# ============================================
info "BATCH 4: Navigation & Notifications (5 files)"
BATCH4=(
    "dropdown-menu.tsx"
    "calendar.tsx"
    "toast.tsx"
    "toaster.tsx"
    "use-toast.ts"
)

completed=0
total=${#BATCH4[@]}

for file in "${BATCH4[@]}"; do
    url="$SOURCE_REPO/src/components/ui/$file"
    dest="$TARGET_BASE/ui/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 4 completed: $completed/$total files"
echo ""

# ============================================
# BATCH 5: Business Components - Authentication (3 files)
# ============================================
info "BATCH 5: Business Components - Authentication (3 files)"
BATCH5=(
    "AuthInitializer.tsx"
    "ProtectedRoute.tsx"
    "LogoutButton.tsx"
)

completed=0
total=${#BATCH5[@]}

for file in "${BATCH5[@]}"; do
    url="$SOURCE_REPO/src/components/$file"
    dest="$TARGET_BASE/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 5 completed: $completed/$total files"
echo ""

# ============================================
# BATCH 6: Business Components - Management & Filters (3 files)
# ============================================
info "BATCH 6: Business Components - Management & Filters (3 files)"
BATCH6=(
    "AccessManagement.tsx"
    "BlockVisibilityManager.tsx"
    "FilterPanel.tsx"
)

completed=0
total=${#BATCH6[@]}

for file in "${BATCH6[@]}"; do
    url="$SOURCE_REPO/src/components/$file"
    dest="$TARGET_BASE/$file"
    
    echo -n "  Downloading $file..."
    if curl -fsSL "$url" -o "$dest" 2>/dev/null; then
        ((completed++))
        echo -e " ${GREEN}Done${NC}"
    else
        error "Failed to download $file"
    fi
done

success "Batch 6 completed: $completed/$total files"
echo ""

# ============================================
# Summary
# ============================================
echo ""
echo -e "${YELLOW}===========================================${NC}"
success "Migration completed!"
echo -e "${YELLOW}===========================================${NC}"
echo ""
info "Next steps:"
echo "  1. Review migrated components in $TARGET_BASE"
echo "  2. Run: npm install (to ensure all dependencies)"
echo "  3. Run: npm run build (to check TypeScript)"
echo "  4. Run: npm run lint (to check code quality)"
echo "  5. Commit changes: git add . && git commit -m 'feat: Migrate UI components from marketai-front'"
echo "  6. Push: git push origin feature/migrate-ui-components"
echo ""
success "All done! 🎉"

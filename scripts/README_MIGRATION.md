# UI Components Migration Scripts

> Автоматический перенос UI компонентов из `marketai-front` в `marketai-python/frontend`

## 📦 Что делают эти скрипты?

Скрипты автоматически скачивают **31 UI компонент** из исходного репозитория `marketai-front` и размещают их в правильных директориях целевого репозитория `marketai-python/frontend`.

### Переносимые компоненты:

**UI компоненты (22 файла):**
- Формы и инпуты: button, input, checkbox, switch, select, date-picker, date-range-picker, period-picker
- Лэйауты: card, dialog, sheet, popover, tabs
- Данные: table, chart, badge, progress
- Навигация: dropdown-menu, calendar, toast, toaster, use-toast

**Бизнес-компоненты (6 файлов):**
- AuthInitializer, ProtectedRoute, LogoutButton
- AccessManagement, BlockVisibilityManager, FilterPanel

**Вложенные структуры (2 папки):**
- UserInfoBar/
- navigation/

---

## 🚀 Использование

### Windows (PowerShell)

```powershell
# 1. Перейти в корень проекта
cd marketai-python

# 2. Запустить скрипт
.\scripts\migrate-ui-components.ps1
```

### Linux/Mac (Bash)

```bash
# 1. Перейти в корень проекта
cd marketai-python

# 2. Сделать скрипт исполняемым (только первый раз)
chmod +x scripts/migrate-ui-components.sh

# 3. Запустить скрипт
./scripts/migrate-ui-components.sh
```

---

## ✅ Что произойдёт после выполнения?

### Структура файлов:

```
frontend/src/components/
├── ui/
│   ├── badge.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── date-picker.tsx
│   ├── date-range-picker.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── period-picker.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── sheet.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   └── use-toast.ts
├── AccessManagement.tsx
├── AuthInitializer.tsx
├── BlockVisibilityManager.tsx
├── FilterPanel.tsx
├── LogoutButton.tsx
├── ProtectedRoute.tsx
├── UserInfoBar/
│   └── (компоненты user info)
└── navigation/
    └── (компоненты навигации)
```

---

## 📋 Следующие шаги

### 1. Проверка зависимостей

Убедитесь, что в `frontend/package.json` установлены необходимые пакеты:

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.0.0",
    "react-day-picker": "^8.10.0",
    "recharts": "^2.10.3",
    "tailwind-merge": "^2.2.0"
  }
}
```

Если пакетов нет:

```bash
cd frontend
npm install
```

### 2. Проверка utils.ts

Убедитесь, что файл `frontend/src/lib/utils.ts` существует:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Если файла нет, создайте его вручную.

### 3. Проверка сборки

```bash
cd frontend

# TypeScript проверка
npm run type-check

# Lint проверка
npm run lint

# Сборка
npm run build

# Dev-сервер
npm run dev
```

### 4. Коммит изменений

```bash
git add frontend/src/components/
git commit -m "feat: Migrate UI components from marketai-front

- Added 22 shadcn/ui components
- Added 6 business components
- Added UserInfoBar and navigation structures
- Automated migration via PowerShell/Bash scripts"

git push origin feature/migrate-ui-components
```

### 5. Создание Pull Request

1. Перейдите на GitHub: https://github.com/GiornoGiovanaJoJo/marketai-python
2. Создайте Pull Request из `feature/migrate-ui-components` в `main`
3. Опишите изменения:
   ```
   ## Описание
   Мигрировал все UI компоненты из marketai-front репозитория.
   
   ## Что добавлено
   - ✅ 22 shadcn/ui компонента
   - ✅ 6 бизнес-компонентов
   - ✅ UserInfoBar и navigation структуры
   - ✅ Автоматизированные скрипты миграции
   
   ## Проверено
   - [x] TypeScript сборка успешна
   - [x] Lint проверка пройдена
   - [x] Dev-сервер запускается
   - [ ] Компоненты протестированы в UI (требуется)
   ```

---

## 🔍 Проверка результата

### Проверка файлов:

```bash
# Проверить, что все UI компоненты на месте
ls -la frontend/src/components/ui/
# Должно быть 22 файла

# Проверить бизнес-компоненты
ls -la frontend/src/components/ | grep -E "(Auth|Protected|Logout|Access|Block|Filter)"
# Должно быть 6 файлов
```

### Проверка импортов:

```typescript
// В любом файле проверьте импорт
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// Должны работать без ошибок
```

---

## 🐛 Troubleshooting

### Проблема: "Не могу запустить PowerShell скрипт"

**Решение:**
```powershell
# Разрешить выполнение скриптов (только первый раз)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Затем запустить скрипт
.\scripts\migrate-ui-components.ps1
```

### Проблема: "Permission denied" на Linux/Mac

**Решение:**
```bash
# Сделать скрипт исполняемым
chmod +x scripts/migrate-ui-components.sh

# Запустить
./scripts/migrate-ui-components.sh
```

### Проблема: "curl: command not found"

**Решение:**
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS (если Homebrew установлен)
brew install curl
```

### Проблема: "TypeScript ошибки после миграции"

**Решение:**
```bash
# Проверить, что установлены все зависимости
cd frontend
npm install

# Проверить src/lib/utils.ts существует
cat src/lib/utils.ts

# Если нет, создать:
mkdir -p src/lib
echo "import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}" > src/lib/utils.ts
```

### Проблема: "Module not found: @/components/ui/..."

**Решение:**

Проверьте `tsconfig.json` содержит правильный alias:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📚 Дополнительные ресурсы

- **План миграции:** `frontend/UI_COMPONENTS_MIGRATION.md`
- **shadcn/ui документация:** https://ui.shadcn.com/
- **Radix UI:** https://www.radix-ui.com/
- **Исходный репозиторий:** https://github.com/GiornoGiovanaJoJo/marketai-front
- **Целевой репозиторий:** https://github.com/GiornoGiovanaJoJo/marketai-python

---

## 💡 Рекомендации

1. **Запускайте скрипт в чистой ветке** `feature/migrate-ui-components`
2. **Проверяйте сборку** после каждого запуска
3. **Создайте backup** перед запуском (опционально)
4. **Тестируйте компоненты** в реальных страницах после миграции

---

## ✅ Готово!

После успешной миграции все UI компоненты будут доступны в проекте, и вы сможете использовать их в страницах и других компонентах.

**Следующий шаг:** Интеграция компонентов в существующие страницы (Login, Dashboard, Campaigns и т.д.)

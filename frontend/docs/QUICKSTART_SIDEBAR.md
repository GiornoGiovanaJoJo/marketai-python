# Quick Start: useSidebar Hook

## Быстрый старт за 5 минут ⏱️

### 1. Обнови код 🔄

```bash
git pull origin main
npm install  # если есть новые зависимости
```

### 2. Базовое использование 💡

**В компоненте Sidebar:**

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Sidebar() {
  const { isOpen, toggle, close } = useSidebar()

  return (
    <aside className={isOpen ? 'sidebar-open' : 'sidebar-closed'}>
      <button onClick={close}>×</button>
      {/* Твой контент */}
    </aside>
  )
}
```

**В Header для кнопки меню:**

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Header() {
  const { toggle } = useSidebar()

  return (
    <header>
      <button onClick={toggle}>☰ Menu</button>
    </header>
  )
}
```

### 3. Добавь Pin функциональность 📌

```tsx
import { useSidebar } from '@/hooks/useSidebar'
import { Pin, PinOff } from 'lucide-react'

function SidebarHeader() {
  const { isPinned, pin, unpin } = useSidebar()

  return (
    <div>
      <button onClick={isPinned ? unpin : pin}>
        {isPinned ? <PinOff /> : <Pin />}
      </button>
    </div>
  )
}
```

### 4. Mobile Overlay 📱

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Layout() {
  const { isOpen, isMobile, close } = useSidebar()

  return (
    <>
      {/* Overlay только на mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={close}
        />
      )}
      
      <Sidebar />
      <MainContent />
    </>
  )
}
```

### 5. CSS стили (Tailwind) 🎨

```tsx
function Sidebar() {
  const { isOpen, isPinned, isMobile } = useSidebar()

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white shadow-lg
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isPinned ? 'lg:translate-x-0' : ''}
        ${isMobile ? 'w-full z-50' : 'w-64'}
      `}
    >
      {/* content */}
    </aside>
  )
}
```

---

## Полный пример Layout 💻

```tsx
import { useSidebar } from '@/hooks/useSidebar'
import { Menu, X, Pin, PinOff } from 'lucide-react'

// Layout компонент
function Layout({ children }) {
  const { isOpen, isMobile, close } = useSidebar()

  return (
    <div className="flex h-screen">
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

// Sidebar компонент
function Sidebar() {
  const { isOpen, isPinned, isMobile, close, pin, unpin } = useSidebar()

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white shadow-lg z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!isMobile && isPinned ? 'lg:translate-x-0' : ''}
        ${isMobile ? 'w-full' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <div className="flex gap-2">
          {/* Pin button (desktop only) */}
          {!isMobile && (
            <button onClick={isPinned ? unpin : pin}>
              {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
            </button>
          )}
          {/* Close button */}
          <button onClick={close}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <a href="/" className="block py-2">Dashboard</a>
        <a href="/products" className="block py-2">Products</a>
        <a href="/settings" className="block py-2">Settings</a>
      </nav>
    </aside>
  )
}

// Header компонент
function Header() {
  const { isOpen, isMobile, toggle } = useSidebar()

  return (
    <header className="bg-white border-b p-4">
      <div className="flex items-center gap-4">
        {/* Menu button (mobile or when sidebar closed) */}
        {(isMobile || !isOpen) && (
          <button onClick={toggle}>
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">MarketAI</h1>
      </div>
    </header>
  )
}

export default Layout
```

---

## API Шпаргалка 📜

| Свойство | Тип | Описание |
|---------|-----|------------|
| `isOpen` | `boolean` | Открыт ли сайдбар |
| `isPinned` | `boolean` | Закреплен ли сайдбар |
| `isMobile` | `boolean` | Мобильное устройство (<768px) |
| `toggle()` | `function` | Переключить состояние |
| `open()` | `function` | Открыть сайдбар |
| `close()` | `function` | Закрыть сайдбар |
| `pin()` | `function` | Закрепить (открыть + зафиксировать) |
| `unpin()` | `function` | Открепить |
| `setMobile(bool)` | `function` | Установить mobile режим вручную |

---

## Частые сценарии 🤔

### Скрыть кнопку закрытия, если закреплен:
```tsx
{!isPinned && <CloseButton />}
```

### Показать кнопку меню только на mobile:
```tsx
{isMobile && <MenuButton />}
```

### Авто-закрытие после навигации (mobile):
```tsx
const handleNavigate = (path) => {
  navigate(path)
  if (isMobile) close()
}
```

### Разные стили для desktop/mobile:
```tsx
<div className={isMobile ? 'mobile-styles' : 'desktop-styles'}>
```

---

## Что дальше? 🚀

1. **Читай полную документацию**:  
   📚 [frontend/docs/hooks/useSidebar.md](./hooks/useSidebar.md)

2. **Смотри готовые примеры**:  
   💻 [frontend/docs/examples/SidebarExample.tsx](./examples/SidebarExample.tsx)

3. **Чек изменения**:  
   🗒️ [frontend/docs/CHANGELOG_SIDEBAR.md](./CHANGELOG_SIDEBAR.md)

4. **Тестируй на разных экранах**:  
   - Desktop: проверь pin/unpin  
   - Mobile: проверь overlay и авто-закрытие  
   - Resize: проверь поведение при изменении размера

---

**Вопросы?** Создавай issue в GitHub! 🐛

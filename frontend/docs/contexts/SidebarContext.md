# SidebarContext Documentation

## Обзор

`SidebarContext` - глобальный React Context для управления состоянием sidebar во всем приложении.

### Когда использовать?

- ✅ **Context (SidebarProvider)** - когда нужен глобальный доступ к sidebar из любого компонента
- ✅ **Standalone Hook** - когда sidebar нужен только в одном месте (без Provider)

### Основные возможности

- ✅ Глобальное состояние sidebar
- ✅ Pin/Unpin функциональность
- ✅ Mobile/Desktop автоопределение
- ✅ localStorage персистентность
- ✅ SSR-safe (Next.js совместимость)
- ✅ Debounced resize handling
- ✅ TypeScript типизация

---

## API Reference

### SidebarProvider

Provider компонент для обертывания приложения.

#### Props

```typescript
interface SidebarProviderProps {
  children: ReactNode              // Дочерние компоненты
  defaultOpen?: boolean            // Начальное состояние (по умолчанию: true)
  defaultPinned?: boolean          // Закреплен по умолчанию (по умолчанию: false)
  mobileBreakpoint?: number        // Breakpoint для mobile (по умолчанию: 768)
}
```

#### Пример использования

```tsx
import { SidebarProvider } from '@/contexts/SidebarContext'

function App() {
  return (
    <SidebarProvider 
      defaultOpen={true}
      defaultPinned={false}
      mobileBreakpoint={768}
    >
      <Layout />
    </SidebarProvider>
  )
}
```

---

### useSidebar Hook

Hook для доступа к sidebar состоянию и действиям.

#### Возвращаемый объект

```typescript
interface SidebarContextType {
  // Состояние
  isOpen: boolean                  // Открыт ли sidebar
  isPinned: boolean                // Закреплен ли sidebar
  isMobile: boolean                // Mobile устройство
  
  // Действия
  toggle: () => void               // Переключить
  open: () => void                 // Открыть
  close: () => void                // Закрыть
  pin: () => void                  // Закрепить
  unpin: () => void                // Открепить
  setMobile: (mobile: boolean) => void  // Установить mobile режим
}
```

#### Пример использования

```tsx
import { useSidebar } from '@/contexts/SidebarContext'

function Sidebar() {
  const { isOpen, isPinned, toggle, pin, unpin } = useSidebar()

  return (
    <aside className={isOpen ? 'open' : 'closed'}>
      <button onClick={toggle}>Toggle</button>
      <button onClick={isPinned ? unpin : pin}>
        {isPinned ? 'Unpin' : 'Pin'}
      </button>
    </aside>
  )
}
```

---

### Дополнительные Hooks

#### useHasSidebarProvider

Проверяет, есть ли SidebarProvider в дереве компонентов.

```tsx
import { useHasSidebarProvider } from '@/contexts/SidebarContext'

function OptionalSidebarButton() {
  const hasProvider = useHasSidebarProvider()
  
  if (!hasProvider) {
    return null // Нет Provider - не отображаем кнопку
  }
  
  return <SidebarToggleButton />
}
```

#### useSidebarOptional

Безопасный hook, который возвращает `null` вместо ошибки.

```tsx
import { useSidebarOptional } from '@/contexts/SidebarContext'

function FlexibleComponent() {
  const sidebar = useSidebarOptional()
  
  if (!sidebar) {
    return <div>No sidebar available</div>
  }
  
  return <div>Sidebar is {sidebar.isOpen ? 'open' : 'closed'}</div>
}
```

---

## Примеры использования

### 1. Базовая настройка

```tsx
// App.tsx
import { SidebarProvider } from '@/contexts/SidebarContext'
import Layout from './components/Layout'

function App() {
  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  )
}

export default App
```

### 2. Sidebar Компонент

```tsx
// components/Sidebar.tsx
import { useSidebar } from '@/contexts/SidebarContext'
import { X, Pin, PinOff } from 'lucide-react'

export function Sidebar() {
  const { 
    isOpen, 
    isPinned, 
    isMobile, 
    close, 
    pin, 
    unpin 
  } = useSidebar()

  return (
    <aside
      className={`
        sidebar
        ${isOpen ? 'sidebar--open' : 'sidebar--closed'}
        ${isPinned ? 'sidebar--pinned' : ''}
        ${isMobile ? 'sidebar--mobile' : 'sidebar--desktop'}
      `}
    >
      {/* Header */}
      <div className="sidebar__header">
        <h2>Navigation</h2>
        <div className="sidebar__actions">
          {!isMobile && (
            <button onClick={isPinned ? unpin : pin}>
              {isPinned ? <PinOff /> : <Pin />}
            </button>
          )}
          <button onClick={close}>
            <X />
          </button>
        </div>
      </div>

      {/* Content */}
      <nav className="sidebar__nav">
        <a href="/">Dashboard</a>
        <a href="/products">Products</a>
        <a href="/settings">Settings</a>
      </nav>
    </aside>
  )
}
```

### 3. Header с кнопкой Toggle

```tsx
// components/Header.tsx
import { useSidebar } from '@/contexts/SidebarContext'
import { Menu } from 'lucide-react'

export function Header() {
  const { isOpen, isMobile, toggle } = useSidebar()

  return (
    <header className="header">
      {/* Показываем кнопку на mobile или когда sidebar закрыт */}
      {(isMobile || !isOpen) && (
        <button onClick={toggle} className="header__menu-btn">
          <Menu />
        </button>
      )}
      
      <h1>MarketAI</h1>
    </header>
  )
}
```

### 4. Layout с Overlay

```tsx
// components/Layout.tsx
import { useSidebar } from '@/contexts/SidebarContext'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout({ children }) {
  const { isOpen, isMobile, close } = useSidebar()

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="layout__overlay" 
          onClick={close}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="layout__main">
        <Header />
        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
```

### 5. Кастомные настройки

```tsx
// App.tsx с кастомными настройками
import { SidebarProvider } from '@/contexts/SidebarContext'

function App() {
  return (
    <SidebarProvider
      defaultOpen={false}          // Закрыт по умолчанию
      defaultPinned={true}         // Закреплен по умолчанию (desktop)
      mobileBreakpoint={1024}      // Tablet = mobile
    >
      <Layout />
    </SidebarProvider>
  )
}
```

---

## Сравнение: Context vs Standalone Hook

| Аспект | Context (SidebarProvider) | Standalone Hook |
|--------|--------------------------|----------------|
| **Глобальность** | ✅ Доступен везде | ❌ Только в одном компоненте |
| **Setup** | Нужен Provider | Не нужен Provider |
| **Синхронизация** | ✅ Автоматическая | ❌ Разные состояния |
| **Производительность** | Re-render всех потребителей | Локальные re-renders |
| **Use Case** | Много компонентов | Один компонент |

### Когда использовать Context?

✅ **Используй Context, если:**
- Sidebar управляется из нескольких мест (Header, Sidebar, кнопки в content)
- Нужна синхронизация состояния между компонентами
- Приложение среднего/большого размера

❌ **Не используй Context, если:**
- Sidebar используется только в одном месте
- Простое приложение (используй standalone hook)
- Критична производительность

---

## Best Practices

### 1. Размести Provider на верхнем уровне

```tsx
// ✅ Хорошо - в App.tsx
<SidebarProvider>
  <Router>
    <Layout />
  </Router>
</SidebarProvider>

// ❌ Плохо - внутри Layout
<Layout>
  <SidebarProvider>
    <Sidebar />
  </SidebarProvider>
</Layout>
```

### 2. Используй деструктуризацию

```tsx
// ✅ Хорошо
const { isOpen, toggle } = useSidebar()

// ❌ Плохо
const sidebar = useSidebar()
if (sidebar.isOpen) { ... }
```

### 3. Обработка ошибок

```tsx
try {
  const sidebar = useSidebar()
  // ...
} catch (error) {
  console.error('SidebarProvider not found:', error)
  // Fallback UI
}

// Или используй useSidebarOptional
const sidebar = useSidebarOptional()
if (!sidebar) return <div>No sidebar</div>
```

### 4. Оптимизация re-renders

```tsx
// ✅ Хорошо - только нужные свойства
const { isOpen } = useSidebar()

// ❌ Плохо - все свойства
const sidebar = useSidebar()
```

---

## Troubleshooting

### Error: "useSidebar must be used within a SidebarProvider"

**Проблема:** Компонент использует `useSidebar`, но не обернут в Provider.

**Решение:**
```tsx
// Добавь Provider в корневой компонент
function App() {
  return (
    <SidebarProvider>
      <YourComponent />
    </SidebarProvider>
  )
}
```

### Состояние не синхронизируется

**Проблема:** Изменения в одном компоненте не отражаются в другом.

**Проверь:**
- Все компоненты используют `useSidebar` из `@/contexts/SidebarContext`
- Нет нескольких Providerов
- Не смешиваешь context и standalone hook

---

## Ссылки

- [SidebarContext.tsx](../../src/contexts/SidebarContext.tsx)
- [useSidebar Hook](../hooks/useSidebar.md)
- [Sidebar Examples](../examples/SidebarExample.tsx)
- [Quick Start](../QUICKSTART_SIDEBAR.md)

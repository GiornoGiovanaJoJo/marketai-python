# useSidebar Hook

## Описание

Полнофункциональный хук для управления состоянием сайдбара с поддержкой:

- ✅ Персистентность состояния (localStorage)
- ✅ SSR безопасность (Next.js совместимость)
- ✅ Адаптивность (автоматическое определение mobile/desktop)
- ✅ Pin/Unpin функциональность
- ✅ Оптимизированные колбэки (useCallback)
- ✅ TypeScript типизация

## Интерфейс

```typescript
interface SidebarState {
  // Состояние
  isOpen: boolean        // Открыт ли сайдбар
  isPinned: boolean      // Закреплен ли сайдбар
  isMobile: boolean      // Мобильное устройство
  
  // Действия
  toggle: () => void     // Переключить состояние
  open: () => void       // Открыть сайдбар
  close: () => void      // Закрыть сайдбар
  pin: () => void        // Закрепить (открыть и зафиксировать)
  unpin: () => void      // Открепить
  setMobile: (mobile: boolean) => void  // Установить режим mobile
}
```

## Использование

### Базовое использование

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Sidebar() {
  const { isOpen, toggle, close } = useSidebar()

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggle}>Toggle</button>
      <button onClick={close}>Close</button>
      {/* Контент сайдбара */}
    </aside>
  )
}
```

### С Pin/Unpin функциональностью

```tsx
import { useSidebar } from '@/hooks/useSidebar'
import { Pin, PinOff } from 'lucide-react'

function SidebarHeader() {
  const { isPinned, pin, unpin, close } = useSidebar()

  return (
    <div className="sidebar-header">
      <h2>Navigation</h2>
      <div className="actions">
        {/* Кнопка закрепления */}
        <button onClick={isPinned ? unpin : pin}>
          {isPinned ? <PinOff /> : <Pin />}
        </button>
        
        {/* Кнопка закрытия (только если не закреплен) */}
        {!isPinned && (
          <button onClick={close}>×</button>
        )}
      </div>
    </div>
  )
}
```

### Адаптивная логика

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Layout() {
  const { isOpen, isMobile, toggle, close } = useSidebar()

  return (
    <div className="layout">
      {/* Overlay для мобильных */}
      {isMobile && isOpen && (
        <div 
          className="overlay" 
          onClick={close}
          aria-label="Close sidebar"
        />
      )}

      {/* Сайдбар */}
      <Sidebar />

      {/* Основной контент */}
      <main className="main-content">
        {/* Кнопка меню только на мобильных */}
        {isMobile && (
          <button onClick={toggle} className="menu-button">
            ☰ Menu
          </button>
        )}
        {/* Контент */}
      </main>
    </div>
  )
}
```

### С анимациями (Framer Motion)

```tsx
import { useSidebar } from '@/hooks/useSidebar'
import { motion, AnimatePresence } from 'framer-motion'

function AnimatedSidebar() {
  const { isOpen, toggle } = useSidebar()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="sidebar"
        >
          {/* Контент */}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
```

### CSS классы (Tailwind)

```tsx
import { useSidebar } from '@/hooks/useSidebar'

function Sidebar() {
  const { isOpen, isPinned, isMobile } = useSidebar()

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white shadow-lg
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isPinned ? 'lg:translate-x-0' : ''}
        ${isMobile ? 'w-full z-50' : 'w-64'}
      `}
    >
      {/* Контент */}
    </aside>
  )
}
```

## Конфигурация

### Изменение breakpoint для mobile

Отредактируйте константу `MOBILE_BREAKPOINT` в `useSidebar.ts`:

```typescript
const MOBILE_BREAKPOINT = 768 // по умолчанию
// Измените на:
const MOBILE_BREAKPOINT = 1024 // для tablet в качестве mobile
```

### Изменение ключей localStorage

```typescript
const STORAGE_KEY = 'sidebar-open'     // состояние открыт/закрыт
const PINNED_KEY = 'sidebar-pinned'    // состояние закреплен
```

## Особенности

### SSR Safety

Хук безопасен для SSR (Next.js):
- Проверка `typeof window === 'undefined'`
- Корректная гидратация
- Нет ошибок при серверном рендеринге

### Автоматическое поведение

1. **Mobile режим**:
   - Сайдбар автоматически закрывается при изменении размера на mobile
   - Pin игнорируется на mobile

2. **Desktop режим**:
   - Если сайдбар был закреплен, автоматически открывается при переходе на desktop
   - Pin работает как ожидается

3. **Персистентность**:
   - Состояние сохраняется между перезагрузками страницы
   - Отдельное хранение для `isOpen` и `isPinned`

## Миграция со старой версии

### Было (старый useSidebar из context):

```tsx
import { useSidebar } from '@/contexts/SidebarContext'

const { isOpen, toggle } = useSidebar()
```

### Стало (новый standalone hook):

```tsx
import { useSidebar } from '@/hooks/useSidebar'

const { isOpen, toggle, isPinned, isMobile } = useSidebar()
```

**Обратная совместимость**: Старые методы (`isOpen`, `toggle`, `open`, `close`) работают идентично.

## Best Practices

1. **Используйте деструктуризацию** для получения только нужных методов:
   ```tsx
   const { isOpen, toggle } = useSidebar() // ✅
   const sidebar = useSidebar() // ❌ (излишне)
   ```

2. **Для desktop приложений** используйте `isPinned`:
   ```tsx
   {!isPinned && <CloseButton />} // показываем только если не закреплен
   ```

3. **Для mobile приложений** используйте overlay:
   ```tsx
   {isMobile && isOpen && <Overlay onClick={close} />}
   ```

4. **Не дублируйте состояние**:
   ```tsx
   // ❌ Плохо
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const { isOpen } = useSidebar()
   
   // ✅ Хорошо
   const { isOpen, toggle } = useSidebar()
   ```

## Примеры интеграции

### С React Router

```tsx
import { useSidebar } from '@/hooks/useSidebar'
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const { isOpen, close, isMobile } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (path: string) => {
    navigate(path)
    // Закрываем сайдбар на mobile после навигации
    if (isMobile) {
      close()
    }
  }

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <a 
        onClick={() => handleNavigate('/')}
        className={location.pathname === '/' ? 'active' : ''}
      >
        Home
      </a>
    </nav>
  )
}
```

### С Redux/Zustand (опционально)

Если нужно глобальное состояние, можно обернуть в context:

```tsx
import { createContext, useContext } from 'react'
import { useSidebar as useSidebarHook } from '@/hooks/useSidebar'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const sidebar = useSidebarHook()
  
  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
```

## Тестирование

```tsx
import { renderHook, act } from '@testing-library/react'
import { useSidebar } from '@/hooks/useSidebar'

describe('useSidebar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default open state', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.current.isOpen).toBe(true)
  })

  it('should toggle state', () => {
    const { result } = renderHook(() => useSidebar())
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should pin sidebar', () => {
    const { result } = renderHook(() => useSidebar())
    
    act(() => {
      result.current.pin()
    })
    
    expect(result.current.isPinned).toBe(true)
    expect(result.current.isOpen).toBe(true)
  })
})
```

## Поддержка

Для вопросов и предложений создавайте issue в репозитории.

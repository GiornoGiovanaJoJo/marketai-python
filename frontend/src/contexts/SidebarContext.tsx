/**
 * SidebarContext - Глобальный контекст для управления состоянием sidebar
 * 
 * Особенности:
 * - Использует внутренний hook для управления состоянием
 * - Поддержка pin/unpin функциональности
 * - Автоматическое определение mobile/desktop
 * - SSR безопасность
 * - localStorage персистентность
 * - Оптимизированные renders
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// ==================== TYPES ====================

interface SidebarContextType {
  // Состояние
  isOpen: boolean
  isPinned: boolean
  isMobile: boolean
  
  // Действия
  toggle: () => void
  open: () => void
  close: () => void
  pin: () => void
  unpin: () => void
  setMobile: (mobile: boolean) => void
}

interface SidebarProviderProps {
  children: ReactNode
  defaultOpen?: boolean
  defaultPinned?: boolean
  mobileBreakpoint?: number
}

// ==================== CONSTANTS ====================

const STORAGE_KEY = 'sidebar-open'
const PINNED_KEY = 'sidebar-pinned'
const DEFAULT_MOBILE_BREAKPOINT = 768

// ==================== CONTEXT ====================

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Экспорты для обратной совместимости
export { SidebarContext }
export default SidebarContext

// ==================== PROVIDER ====================

/**
 * SidebarProvider - Обертка для предоставления sidebar состояния всему приложению
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <SidebarProvider defaultOpen={true} defaultPinned={false}>
 *       <Layout />
 *     </SidebarProvider>
 *   )
 * }
 * ```
 */
export function SidebarProvider({
  children,
  defaultOpen = true,
  defaultPinned = false,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
}: SidebarProviderProps) {
  // ==================== STATE ====================
  
  // Инициализация из localStorage (SSR-safe)
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultOpen
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null ? saved === 'true' : defaultOpen
  })

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultPinned
    const saved = localStorage.getItem(PINNED_KEY)
    return saved !== null ? saved === 'true' : defaultPinned
  })

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < mobileBreakpoint
  })

  // ==================== EFFECTS ====================

  // Persist isOpen state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(isOpen))
    }
  }, [isOpen])

  // Persist isPinned state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PINNED_KEY, String(isPinned))
    }
  }, [isPinned])

  // Handle window resize for mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < mobileBreakpoint
        setIsMobile(mobile)
        
        // Auto-close on mobile, respect pinned state on desktop
        if (mobile && isOpen) {
          setIsOpen(false)
        } else if (!mobile && isPinned) {
          setIsOpen(true)
        }
      }, 150) // 150ms debounce
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, isPinned, mobileBreakpoint])

  // ==================== ACTIONS ====================

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const pin = useCallback(() => {
    setIsPinned(true)
    setIsOpen(true)
  }, [])

  const unpin = useCallback(() => {
    setIsPinned(false)
  }, [])

  const setMobileState = useCallback((mobile: boolean) => {
    setIsMobile(mobile)
  }, [])

  // ==================== CONTEXT VALUE ====================

  const value: SidebarContextType = {
    isOpen,
    isPinned,
    isMobile,
    toggle,
    open,
    close,
    pin,
    unpin,
    setMobile: setMobileState,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

// ==================== HOOK ====================

/**
 * useSidebar - Hook для доступа к sidebar состоянию и действиям
 * 
 * @throws {Error} Если используется вне SidebarProvider
 * 
 * @example
 * ```tsx
 * function Sidebar() {
 *   const { isOpen, isPinned, toggle, pin, unpin } = useSidebar()
 *   
 *   return (
 *     <aside className={isOpen ? 'open' : 'closed'}>
 *       <button onClick={toggle}>Toggle</button>
 *       <button onClick={isPinned ? unpin : pin}>
 *         {isPinned ? 'Unpin' : 'Pin'}
 *       </button>
 *     </aside>
 *   )
 * }
 * ```
 */
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  
  if (context === undefined) {
    throw new Error(
      'useSidebar must be used within a SidebarProvider. ' +
      'Wrap your app with <SidebarProvider> at the root level.'
    )
  }
  
  return context
}

// ==================== UTILITIES ====================

/**
 * Утилита для проверки наличия SidebarProvider в дереве компонентов
 * Полезно для условного рендеринга или отладки
 */
export function useHasSidebarProvider(): boolean {
  const context = useContext(SidebarContext)
  return context !== undefined
}

/**
 * Hook для безопасного использования sidebar вне Provider
 * Возвращает null если Provider отсутствует
 */
export function useSidebarOptional(): SidebarContextType | null {
  const context = useContext(SidebarContext)
  return context ?? null
}

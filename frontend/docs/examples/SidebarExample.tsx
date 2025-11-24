/**
 * Полноценный пример компонента Sidebar
 * с использованием useSidebar hook
 */

import { useSidebar } from '@/hooks/useSidebar'
import { X, Pin, PinOff, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

/**
 * Основной компонент Sidebar
 */
export function Sidebar({ children, className }: SidebarProps) {
  const { isOpen, isPinned, isMobile, toggle, close, pin, unpin } = useSidebar()

  return (
    <>
      {/* Overlay для mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={close}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Базовые стили
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50',
          'transition-transform duration-300 ease-in-out',
          
          // Ширина
          isMobile ? 'w-full' : 'w-64',
          
          // Состояние открыт/закрыт
          isOpen ? 'translate-x-0' : '-translate-x-full',
          
          // Закрепленное состояние (только desktop)
          !isMobile && isPinned && 'lg:translate-x-0',
          
          className
        )}
      >
        {/* Шапка */}
        <SidebarHeader />

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Футер (опционально) */}
        <SidebarFooter />
      </aside>
    </>
  )
}

/**
 * Шапка сайдбара
 */
function SidebarHeader() {
  const { isPinned, isMobile, close, pin, unpin } = useSidebar()

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Navigation
      </h2>

      <div className="flex items-center gap-2">
        {/* Кнопка pin/unpin (только desktop) */}
        {!isMobile && (
          <button
            onClick={isPinned ? unpin : pin}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isPinned
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}
            aria-label={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>
        )}

        {/* Кнопка закрытия */}
        {(!isPinned || isMobile) && (
          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Футер сайдбара
 */
function SidebarFooter() {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-xs text-gray-500 dark:text-gray-400">
        MarketAI v2.0
      </div>
    </div>
  )
}

/**
 * Кнопка открытия сайдбара (для использования в header)
 */
export function SidebarToggle() {
  const { isOpen, isMobile, toggle } = useSidebar()

  // Показываем только на mobile или когда сайдбар закрыт
  if (!isMobile && isOpen) return null

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
      aria-label="Toggle sidebar"
    >
      <Menu size={20} />
    </button>
  )
}

/**
 * Пример использования в Layout
 */
export function LayoutExample() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar>
        <nav className="space-y-2">
          <a
            href="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dashboard
          </a>
          <a
            href="/products"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Products
          </a>
          <a
            href="/analytics"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Analytics
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Settings
          </a>
        </nav>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <SidebarToggle />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <p>Your page content here...</p>
        </div>
      </main>
    </div>
  )
}

/**
 * Пример с анимациями (Framer Motion)
 */
import { motion, AnimatePresence } from 'framer-motion'

export function AnimatedSidebar({ children, className }: SidebarProps) {
  const { isOpen, isPinned, isMobile, close } = useSidebar()

  return (
    <>
      {/* Animated Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Animated Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50',
          isMobile ? 'w-full' : 'w-64',
          !isMobile && isPinned && 'lg:translate-x-0',
          className
        )}
      >
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <SidebarFooter />
      </motion.aside>
    </>
  )
}

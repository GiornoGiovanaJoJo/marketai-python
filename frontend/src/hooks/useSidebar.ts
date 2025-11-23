<<<<<<< HEAD
import { useState, useEffect } from 'react'

interface SidebarState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

/**
 * Hook for managing sidebar state
 * Persists state to localStorage
 */
export function useSidebar(): SidebarState {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-open')
      return saved !== null ? saved === 'true' : true // Default to open
    }
    return true
  })

  useEffect(() => {
    // Save to localStorage whenever state changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', String(isOpen))
    }
  }, [isOpen])

  const toggle = () => setIsOpen(prev => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, toggle, open, close }
}
=======
// Экспортируем useSidebar из контекста
export { useSidebar } from "@/contexts/SidebarContext"

>>>>>>> 731b75b (scr)

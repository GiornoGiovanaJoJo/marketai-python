import { useState, useEffect, useCallback } from 'react'

interface SidebarState {
  isOpen: boolean
  isPinned: boolean
  isMobile: boolean
  toggle: () => void
  open: () => void
  close: () => void
  pin: () => void
  unpin: () => void
  setMobile: (mobile: boolean) => void
}

const STORAGE_KEY = 'sidebar-open'
const PINNED_KEY = 'sidebar-pinned'
const MOBILE_BREAKPOINT = 768

/**
 * Full-featured sidebar hook with:
 * - State persistence (localStorage)
 * - SSR safety
 * - Mobile responsiveness
 * - Pin/unpin functionality
 * - Animation-ready state
 */
export function useSidebar(): SidebarState {
  // Initialize state from localStorage (SSR-safe)
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null ? saved === 'true' : true
  })

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem(PINNED_KEY)
    return saved !== null ? saved === 'true' : false
  })

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

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

    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      
      // Auto-close on mobile, respect pinned state on desktop
      if (mobile && isOpen) {
        setIsOpen(false)
      } else if (!mobile && isPinned) {
        setIsOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, isPinned])

  // Actions
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

  const setMobile = useCallback((mobile: boolean) => {
    setIsMobile(mobile)
  }, [])

  return {
    isOpen,
    isPinned,
    isMobile,
    toggle,
    open,
    close,
    pin,
    unpin,
    setMobile
  }
}

// Export standalone version
export default useSidebar

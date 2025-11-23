import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'marketai-theme'

// Инициализация темы при загрузке модуля (синхронно)
function initializeTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  if (savedTheme) {
    return savedTheme
  }
  // Темная тема по умолчанию
  return 'dark'
}

// Применяем тему синхронно при инициализации
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Инициализируем тему при загрузке модуля
const initialTheme = initializeTheme()
applyTheme(initialTheme)

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    // Применяем класс dark к корневому элементу
    applyTheme(theme)
    
    // Сохраняем тему в localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setThemeDirect = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  return { theme, toggleTheme, setTheme: setThemeDirect }
}


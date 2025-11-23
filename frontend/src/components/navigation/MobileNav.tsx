import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, Moon, Sun } from "lucide-react"
import { navMenu } from "@/types/navmenu"
import { NavItem } from "./NavItem"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/hooks/useTheme"

// Mock данные пользователя
const mockUser = {
  name: "Дарья",
  role: "Администратор",
  phone: "+79688029396",
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  // Закрываем меню при изменении роута
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Бургер-кнопка */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMenu}
          className="glass-effect border-border/40"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Мобильное меню */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 glass-effect border-r border-border/40 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Логотип и кнопка закрытия */}
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="flex items-center space-x-2 text-xl font-bold gradient-text"
            >
              <img src="/icon.png" alt="marketAI" className="h-8 w-8" />
              <span>marketAI</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Навигационное меню */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 sidebar-nav">
            {navMenu.map((item) => (
              <div key={item.id} onClick={closeMenu}>
                <NavItem item={item} />
              </div>
            ))}
          </nav>

          {/* Переключатель темы */}
          <div className="p-4 border-t border-border/40">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4 text-primary" />
                ) : (
                  <Sun className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm font-medium">Темная тема</span>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
            </div>
          </div>

          {/* Информация о пользователе */}
          <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{mockUser.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {mockUser.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}


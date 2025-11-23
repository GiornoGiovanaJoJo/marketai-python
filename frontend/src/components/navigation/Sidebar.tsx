import { Link } from "react-router-dom"
import { Moon, Sun, ChevronLeft } from "lucide-react"
import { navMenu } from "@/types/navmenu"
import { NavItem } from "./NavItem"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { useSidebar } from "@/hooks/useSidebar"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { theme, setTheme } = useTheme()
  const { isOpen, toggle } = useSidebar()

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full glass-effect border-r border-border/40 z-40 hidden md:flex transition-all duration-300",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className={cn(
        "flex flex-col h-full w-64 transition-all duration-300",
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none overflow-hidden"
      )}>
        {/* Логотип */}
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-xl font-bold gradient-text"
          >
            <img src="/icon.png" alt="marketAI" className="h-8 w-8" />
            <span>marketAI</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-8 w-8 shrink-0"
            title="Скрыть меню"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Навигационное меню */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 sidebar-nav">
          {navMenu.map((item) => (
            <NavItem key={item.id} item={item} />
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

      </div>
    </aside>
  )
}


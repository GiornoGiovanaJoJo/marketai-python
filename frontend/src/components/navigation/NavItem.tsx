import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavMenuItem } from "@/types/navmenu"
import { cn } from "@/lib/utils"

interface NavItemProps {
  item: NavMenuItem
}

export function NavItem({ item }: NavItemProps) {
  const location = useLocation()
  const isActive = item.path === location.pathname
  const isDisabled = item.disabled === true
  
  // Если есть дочерние элементы, показываем dropdown
  if (item.children) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={cn(
            "nav-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
            "hover:bg-accent/60 hover:shadow-md hover:scale-[1.02]",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            isActive && "nav-item-active"
          )}
        >
          <span className="whitespace-nowrap">{item.label}</span>
          <ChevronRight className="h-4 w-4 opacity-70 nav-item-chevron shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="right"
          className="w-64 glass-effect ml-2 sidebar-dropdown"
        >
          {item.children.map((child) => {
            const childDisabled = child.disabled === true
            if (childDisabled) {
              return (
                <DropdownMenuItem 
                  key={child.id} 
                  disabled
                  className="sidebar-dropdown-item opacity-50 cursor-not-allowed"
                >
                  <span className="flex items-center w-full">
                    {child.label}
                  </span>
                </DropdownMenuItem>
              )
            }
            return (
              <DropdownMenuItem 
                key={child.id} 
                asChild
                className="sidebar-dropdown-item"
              >
                <Link
                  to={child.path || "#"}
                  className="flex items-center w-full cursor-pointer"
                >
                  {child.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Обычная ссылка без дочерних элементов
  if (isDisabled) {
    return (
      <span
        className={cn(
          "nav-item block w-full px-4 py-3 rounded-xl text-sm font-medium",
          "opacity-50 cursor-not-allowed whitespace-nowrap"
        )}
      >
        {item.label}
      </span>
    )
  }

  return (
    <Link
      to={item.path || "#"}
      className={cn(
        "nav-item block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
        "hover:bg-accent/60 hover:shadow-md hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        isActive && "nav-item-active",
        "whitespace-nowrap"
      )}
    >
      {item.label}
    </Link>
  )
}

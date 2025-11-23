import { useSidebar } from "@/hooks/useSidebar"
import { cn } from "@/lib/utils"

// Хук для управления шириной контейнера страницы
export function usePageContainer() {
  const { isOpen } = useSidebar()
  
  const containerClassName = cn(
    "w-full",
    isOpen ? "max-w-7xl mx-auto" : "max-w-full px-4"
  )
  
  return { containerClassName, isSidebarOpen: isOpen }
}


import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

interface LogoutButtonProps {
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
    showText?: boolean
}

export function LogoutButton({
                                 variant = "ghost",
                                 size = "sm",
                                 className = "",
                                 showText = true
                             }: LogoutButtonProps) {
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleLogout = () => {
        // TODO: Добавьте логику выхода из системы
        // Например: очистка токенов, localStorage, context, etc.

        toast({
            title: "Выход выполнен",
            description: "Вы успешно вышли из системы",
        })

        // Перенаправление на страницу входа
        navigate("/login")
    }

    return (
        <Button
            onClick={handleLogout}
            variant={variant}
            size={size}
            className={`
        hover:bg-destructive/10 
        hover:text-destructive
        transition-all 
        duration-300
        ${className}
      `}
            title="Выход из системы"
        >
            <LogOut className={showText ? "h-4 w-4 mr-2" : "h-4 w-4"} />
            {showText && "Выход"}
        </Button>
    )
}

import {User, Menu, Phone, Calendar} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/useSidebar'

interface UserProfileProps {
    userName: string
    userPhone?: string
    subscriptionDays?: number
}

export function UserProfile({
                                userName,
                                userPhone,
                                subscriptionDays = 45,
                            }: UserProfileProps) {
    const { isOpen, toggle } = useSidebar()

    return (
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggle()
                }}
                className="h-9 w-9 shrink-0 hidden md:flex z-50"
                title={isOpen ? 'Скрыть меню' : 'Показать меню'}
                type="button"
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold text-sm">{userName}</div>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 mt-0.5 w-fit">
                        Пользователь
                    </Badge>
                </div>
            </div>

            {userPhone && (
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{userPhone}</span>
                </div>
            )}

            <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{subscriptionDays} дней подписки</span>
            </div>
        </div>
    )
}

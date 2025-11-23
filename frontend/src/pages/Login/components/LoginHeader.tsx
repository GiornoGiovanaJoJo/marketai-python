import { LogIn } from 'lucide-react'
import {
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'

export function LoginHeader() {
    return (
        <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-2 glow-effect">
                <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">
                Добро пожаловать
            </CardTitle>
            <CardDescription className="text-base">
                Войдите в свой аккаунт для продолжения
            </CardDescription>
        </CardHeader>
    )
}

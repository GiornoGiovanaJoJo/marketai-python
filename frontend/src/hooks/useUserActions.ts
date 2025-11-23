import { useToast } from '@/components/ui/use-toast'
import { useLogoutMutation } from '@/services/api'
import { useAppDispatch } from '@/store/hooks'
import { clearAuth } from '@/store/slices/authSlice'
import {useNavigate} from "react-router-dom";

export function useUserActions() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [logout, { isLoading }] = useLogoutMutation()
    const dispatch = useAppDispatch()

    const handleCopyReferralLink = async (referralLink: string) => {
        try {
            await navigator.clipboard.writeText(referralLink)
            toast({
                title: 'Ссылка скопирована',
                description: 'Реферальная ссылка скопирована в буфер обмена',
            })
        } catch (err) {
            toast({
                title: 'Ошибка',
                description: 'Не удалось скопировать ссылку',
                variant: 'destructive',
            })
        }
    }

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            dispatch(clearAuth())

            toast({
                title: 'Выход выполнен',
                description: 'Вы успешно вышли из системы',
            })

            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
            toast({
                title: 'Ошибка',
                description: 'Не удалось выйти из системы',
                variant: 'destructive',
            })
        }
    }

    return {
        isLoading,
        handleCopyReferralLink,
        handleLogout,
    }
}

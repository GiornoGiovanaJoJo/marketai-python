import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/services/api'
import { useToast } from '@/components/ui/use-toast'
import type { LoginFormErrors } from '../../pages/Login/types/login.types'

export function useLoginForm() {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<LoginFormErrors>({})
    const [login, { isLoading }] = useLoginMutation()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Валидация российского телефона (10 цифр, начинается с 9)
    const validatePhone = (phoneNumber: string): boolean => {
        const phoneRegex = /^9\d{9}$/
        return phoneRegex.test(phoneNumber.replace(/\D/g, ''))
    }

    // Валидация пароля (минимум 6 символов)
    const validatePassword = (pass: string): boolean => {
        return pass.length >= 6
    }

    // Проверка валидности в реальном времени
    const phoneValid = phone.length > 0 ? validatePhone(phone) : null
    const passwordValid = password.length > 0 ? validatePassword(password) : null

    const handlePhoneChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        if (cleaned.length <= 10) {
            setPhone(cleaned)
            if (errors.phone) {
                setErrors({ ...errors, phone: undefined })
            }
        }
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value)
        if (errors.password) {
            setErrors({ ...errors, password: undefined })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Валидация перед отправкой
        const phoneValid = validatePhone(phone)
        const passwordValid = validatePassword(password)

        if (!phoneValid) {
            setErrors({
                phone: 'Введите корректный номер телефона (10 цифр, начинается с 9)',
            })
            return
        }

        if (!passwordValid) {
            setErrors({
                password: 'Пароль должен содержать минимум 6 символов',
            })
            return
        }

        try {
            // Авторизация через Redux
            await login({ phone, password }).unwrap()

            toast({
                title: 'Успешный вход',
                description: 'Вы успешно авторизовались',
            })

            navigate('/dashboard')
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Неверный телефон или пароль'
            console.error('Login error:', error)

            toast({
                title: 'Ошибка входа',
                description: errorMessage,
                variant: 'destructive',
            })

            setErrors({ password: errorMessage })
        }
    }

    return {
        phone,
        password,
        showPassword,
        errors,
        isLoading,
        phoneValid,
        passwordValid,
        handlePhoneChange,
        handlePasswordChange,
        handleSubmit,
        setShowPassword,
    }
}

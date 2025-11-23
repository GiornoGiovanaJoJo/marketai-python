import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, Lock, LogIn, Eye, EyeOff, CheckCircle2, XCircle, User, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Валидация имени
    const validateName = (name: string): boolean => {
        return name.length >= 2
    }

    // Валидация email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Валидация российского телефона (10 цифр, начинается с 9)
    const validatePhone = (phoneNumber: string): boolean => {
        const phoneRegex = /^9\d{9}$/
        return phoneRegex.test(phoneNumber.replace(/\D/g, ''))
    }

    // Валидация пароля (минимум 6 символов)
    const validatePassword = (pass: string): boolean => {
        return pass.length >= 6
    }

    // Проверка совпадения паролей
    const validatePasswordMatch = (): boolean => {
        return password === passwordConfirmation && password.length > 0
    }

    // Проверка валидности в реальном времени
    const nameValid = name.length > 0 ? validateName(name) : null
    const emailValid = email.length > 0 ? validateEmail(email) : null
    const phoneValid = phone.length > 0 ? validatePhone(phone) : null
    const passwordValid = password.length > 0 ? validatePassword(password) : null
    const passwordMatchValid = passwordConfirmation.length > 0 ? validatePasswordMatch() : null

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '')
        if (value.length <= 10) {
            setPhone(value)
            if (errors.phone) {
                setErrors({ ...errors, phone: undefined })
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        // Валидация всех полей
        const newErrors: { [key: string]: string } = {}

        if (!validateName(name)) {
            newErrors.name = 'Имя должно содержать минимум 2 символа'
        }

        if (!validateEmail(email)) {
            newErrors.email = 'Введите корректный email'
        }

        if (!validatePhone(phone)) {
            newErrors.phone = 'Введите корректный номер телефона (10 цифр, начинается с 9)'
        }

        if (!validatePassword(password)) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов'
        }

        if (!validatePasswordMatch()) {
            newErrors.passwordConfirmation = 'Пароли не совпадают'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            // Попытка регистрации через API
            await register(name, email, phone, password, passwordConfirmation)

            toast({
                title: 'Регистрация успешна',
                description: 'Добро пожаловать в MarketAI!',
            })

            navigate('/dashboard')
        } catch (error: any) {
            console.error('Registration error:', error)

            toast({
                title: 'Ошибка регистрации',
                description: error.message || 'Не удалось зарегистрироваться',
                variant: 'destructive',
            })

            // Обработка ошибок валидации с сервера
            if (error.errors) {
                setErrors(error.errors)
            } else {
                setErrors({ general: error.message })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Декоративные элементы фона */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative z-10 glass-effect border-border/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-2 glow-effect">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold gradient-text">Регистрация</CardTitle>
                    <CardDescription className="text-base">
                        Создайте аккаунт для доступа к платформе
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Поле имени */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                Имя
                            </label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Иван Иванов"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300",
                                        errors.name && "border-destructive focus-visible:ring-destructive",
                                        nameValid === true && "border-green-500 focus-visible:ring-green-500"
                                    )}
                                    disabled={isLoading}
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                {nameValid !== null && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {nameValid ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-destructive" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.name && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Поле email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email
                            </label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ivan@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300",
                                        errors.email && "border-destructive focus-visible:ring-destructive",
                                        emailValid === true && "border-green-500 focus-visible:ring-green-500"
                                    )}
                                    disabled={isLoading}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                {emailValid !== null && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {emailValid ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-destructive" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Поле телефона */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Телефон
                            </label>
                            <div className="relative">
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="9151453935"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300",
                                        errors.phone && "border-destructive focus-visible:ring-destructive",
                                        phoneValid === true && "border-green-500 focus-visible:ring-green-500"
                                    )}
                                    disabled={isLoading}
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                {phoneValid !== null && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {phoneValid ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-destructive" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.phone && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Поле пароля */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                Пароль
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Минимум 6 символов"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300",
                                        errors.password && "border-destructive focus-visible:ring-destructive",
                                        passwordValid === true && "border-green-500 focus-visible:ring-green-500"
                                    )}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Подтверждение пароля */}
                        <div className="space-y-2">
                            <label htmlFor="passwordConfirmation" className="text-sm font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                Подтверждение пароля
                            </label>
                            <div className="relative">
                                <Input
                                    id="passwordConfirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder="Повторите пароль"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className={cn(
                                        "pl-10 pr-10 h-12 transition-all duration-300",
                                        errors.passwordConfirmation && "border-destructive focus-visible:ring-destructive",
                                        passwordMatchValid === true && "border-green-500 focus-visible:ring-green-500"
                                    )}
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.passwordConfirmation && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    {errors.passwordConfirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold glow-effect transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isLoading || !nameValid || !emailValid || !phoneValid || !passwordValid || !passwordMatchValid}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Регистрация...
                </span>
                            ) : (
                                'Зарегистрироваться'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border/50">
                        <p className="text-center text-sm text-muted-foreground">
                            Уже есть аккаунт?{' '}
                            <Link
                                to="/login"
                                className="text-primary font-semibold hover:underline transition-all duration-200 hover:text-primary/80"
                            >
                                Войти
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

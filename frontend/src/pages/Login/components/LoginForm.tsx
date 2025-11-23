import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { PhoneInput } from './PhoneInput'
import { PasswordInput } from './PasswordInput'
import { RegisterLink } from './RegisterLink'
import type { LoginFormErrors, ValidationState } from '../types/login.types'

interface LoginFormProps {
    phone: string
    password: string
    showPassword: boolean
    errors: LoginFormErrors
    isLoading: boolean
    validation: ValidationState
    onPhoneChange: (value: string) => void
    onPasswordChange: (value: string) => void
    onShowPasswordToggle: () => void
    onSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
                              phone,
                              password,
                              showPassword,
                              errors,
                              isLoading,
                              validation,
                              onPhoneChange,
                              onPasswordChange,
                              onShowPasswordToggle,
                              onSubmit,
                          }: LoginFormProps) {
    const isFormValid = validation.phoneValid && validation.passwordValid

    return (
        <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
                <PhoneInput
                    value={phone}
                    onChange={onPhoneChange}
                    isValid={validation.phoneValid}
                    error={errors.phone}
                    disabled={isLoading}
                />

                <PasswordInput
                    value={password}
                    onChange={onPasswordChange}
                    isValid={validation.passwordValid}
                    error={errors.password}
                    disabled={isLoading}
                    showPassword={showPassword}
                    onToggleShowPassword={onShowPasswordToggle}
                />

                <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold glow-effect transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading || !isFormValid}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Вход...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <LogIn className="w-5 h-5" />
                            Войти
                        </span>
                    )}
                </Button>
            </form>

            <RegisterLink />
        </CardContent>
    )
}

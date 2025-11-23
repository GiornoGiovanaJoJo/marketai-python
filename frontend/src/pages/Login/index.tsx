'use client'

import { Card } from '@/components/ui/card'
import { LoginHeader } from './components/LoginHeader'
import { LoginForm } from './components/LoginForm'
import { BackgroundDecorations } from './components/BackgroundDecorations'
import { useLoginForm } from '../../hooks/data/useLoginForm'

export function Login() {
    const {
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
    } = useLoginForm()

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <BackgroundDecorations />

            <Card className="w-full max-w-md relative z-10 glass-effect border-border/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                <LoginHeader />
                <LoginForm
                    phone={phone}
                    password={password}
                    showPassword={showPassword}
                    errors={errors}
                    isLoading={isLoading}
                    validation={{
                        phoneValid,
                        passwordValid,
                    }}
                    onPhoneChange={handlePhoneChange}
                    onPasswordChange={handlePasswordChange}
                    onShowPasswordToggle={() => setShowPassword(!showPassword)}
                    onSubmit={handleSubmit}
                />
            </Card>
        </div>
    )
}

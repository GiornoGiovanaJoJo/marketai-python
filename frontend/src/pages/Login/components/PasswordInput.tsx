import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PasswordInputProps } from '../types/login.types'

interface PasswordInputExtendedProps extends PasswordInputProps {
    showPassword: boolean
    onToggleShowPassword: () => void
}

export function PasswordInput({
                                  value,
                                  onChange,
                                  isValid,
                                  error,
                                  disabled,
                                  showPassword,
                                  onToggleShowPassword,
                              }: PasswordInputExtendedProps) {
    return (
        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Пароль
            </label>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "pl-10 pr-10 h-12 transition-all duration-300",
                        error && "border-destructive focus-visible:ring-destructive",
                        isValid === true && "border-green-500 focus-visible:ring-green-500",
                        isValid === false && value.length > 0 && "border-destructive"
                    )}
                    disabled={disabled}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <button
                    type="button"
                    onClick={onToggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
            {error && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-top-1">
                    <XCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    )
}

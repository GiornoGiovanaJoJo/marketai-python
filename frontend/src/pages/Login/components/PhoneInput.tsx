import { Phone, CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { PhoneInputProps } from '../types/login.types'

export function PhoneInput({
                               value,
                               onChange,
                               isValid,
                               error,
                               disabled,
                           }: PhoneInputProps) {
    return (
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
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                {isValid !== null && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                        )}
                    </div>
                )}
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

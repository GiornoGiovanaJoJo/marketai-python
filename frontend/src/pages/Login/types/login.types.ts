export interface LoginFormErrors {
    phone?: string
    password?: string
}

export interface PhoneInputProps {
    value: string
    onChange: (value: string) => void
    isValid: boolean | null
    error?: string
    disabled?: boolean
}

export interface PasswordInputProps {
    value: string
    onChange: (value: string) => void
    isValid: boolean | null
    error?: string
    disabled?: boolean
}

export interface ValidationState {
    phoneValid: boolean | null
    passwordValid: boolean | null
}

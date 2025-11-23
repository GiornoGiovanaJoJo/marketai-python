export interface User {
    id: number
    name: string
    email: string
    phone: string
    created_at: string
    updated_at: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface LoginRequest {
    phone: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}

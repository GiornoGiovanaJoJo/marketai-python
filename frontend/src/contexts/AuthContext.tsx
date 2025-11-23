import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, type User } from '@/lib/api'
import { getToken, removeToken } from '@/lib/http'

interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    loading: boolean
    login: (phone: string, password: string) => Promise<void>
    register: (name: string, email: string, phone: string, password: string, password_confirmation: string) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const loadUser = async (): Promise<void> => {
        try {
            const userData = await api.getMe()
            setUser(userData)
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Failed to load user:', error)
            removeToken()
            setIsAuthenticated(false)
            setUser(null)
            throw error
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            const token = getToken()

            if (token) {
                try {
                    await loadUser()
                } catch (error) {
                    console.log('Token invalid or expired')
                }
            }

            setLoading(false)
        }

        initAuth()
    }, [])

    // Авторизация - Bearer-поток без CSRF
    const login = async (phone: string, password: string): Promise<void> => {
        try {
            const response = await api.login(phone, password)
            setUser(response.user)
            setIsAuthenticated(true)
        } catch (error: any) {
            console.error('Login error:', error)
            throw error
        }
    }

    // Регистрация - Bearer-поток без CSRF
    const register = async (
        name: string,
        email: string,
        phone: string,
        password: string,
        password_confirmation: string
    ): Promise<void> => {
        try {
            const response = await api.register(name, email, phone, password, password_confirmation)
            setUser(response.user)
            setIsAuthenticated(true)
        } catch (error: any) {
            console.error('Registration error:', error)
            throw error
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await api.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsAuthenticated(false)
            setUser(null)
        }
    }

    const refreshUser = async (): Promise<void> => {
        await loadUser()
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            register,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

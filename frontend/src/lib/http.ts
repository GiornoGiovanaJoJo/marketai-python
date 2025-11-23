import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = 'https://4895c9d9450e.vps.myjino.ru/api'
const TOKEN_KEY = 'auth_token'

// Создаем инстанс axios для Bearer-токенов
export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false, // Bearer не требует cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
})

// Request Interceptor - добавляет Bearer токен
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        if (import.meta.env.DEV) {
            console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            })
        }

        return config
    },
    (error) => {
        console.error('[HTTP Request Error]', error)
        return Promise.reject(error)
    }
)

// Response Interceptor - обрабатывает ошибки
httpClient.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(`[HTTP Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            })
        }
        return response
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn('[HTTP] 401 Unauthorized - Removing token')
            localStorage.removeItem(TOKEN_KEY)
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login'
            }
        }

        if (error.response?.status === 403) {
            console.error('[HTTP] 403 Forbidden - Access denied')
        }

        if (error.response?.status === 422) {
            console.error('[HTTP] 422 Validation Error', error.response.data)
        }

        if (error.response?.status === 500) {
            console.error('[HTTP] 500 Server Error', error.response.data)
        }

        if (import.meta.env.DEV) {
            console.error('[HTTP Error]', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.message,
                data: error.response?.data,
            })
        }

        return Promise.reject(error)
    }
)

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY)
}

export default httpClient

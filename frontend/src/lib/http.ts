import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const TOKEN_KEY = 'auth_token'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
})

// Request Interceptor — добавляет Bearer токен
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      const url = `${config.baseURL ?? ''}${config.url ?? ''}`
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${url}`, {
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

// Response Interceptor — обрабатывает ошибки
httpClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`
      console.log(
        `[HTTP Response] ${response.config.method?.toUpperCase()} ${url}`,
        {
          status: response.status,
          data: response.data,
        }
      )
    }
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn('[HTTP] 401 Unauthorized — removing token')
      localStorage.removeItem(TOKEN_KEY)
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      console.error('[HTTP] 403 Forbidden — access denied')
    } else if (status === 422) {
      console.error('[HTTP] 422 Validation Error', error.response?.data)
    } else if (status && status >= 500) {
      console.error('[HTTP] 5xx Server Error', error.response?.data)
    }

    if (import.meta.env.DEV) {
      console.error('[HTTP Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status,
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

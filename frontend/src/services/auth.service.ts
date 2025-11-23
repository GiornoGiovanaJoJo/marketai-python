import api from '@/lib/api'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

/**
 * Authentication Service
 * 
 * Django endpoints:
 * - POST /api/auth/register/
 * - POST /api/auth/login/
 * - POST /api/auth/logout/
 * - GET  /api/auth/me/
 * - POST /api/auth/token/refresh/
 */
class AuthService {
  /**
   * Login user
   * Django endpoint: POST /api/auth/login/
   * Request: { email: string, password: string }
   * Response: { access: string, refresh: string, user: User }
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login/', credentials)
    
    // Django returns: { access, refresh, user }
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    
    return response.data
  }

  /**
   * Register new user
   * Django endpoint: POST /api/auth/register/
   * Request: { email: string, password: string, first_name?: string, last_name?: string }
   * Response: { access: string, refresh: string, user: User }
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    
    return response.data
  }

  /**
   * Logout user
   * Django endpoint: POST /api/auth/logout/
   * Request: { refresh: string }
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken })
      }
    } finally {
      // Always clear tokens, even if API call fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  /**
   * Get current authenticated user
   * Django endpoint: GET /api/auth/me/
   * Response: User object
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me/')
    return response.data
  }

  /**
   * Refresh access token
   * Django endpoint: POST /api/auth/token/refresh/
   * Request: { refresh: string }
   * Response: { access: string }
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken,
    })

    const { access } = response.data
    localStorage.setItem('access_token', access)
    return access
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }
}

export default new AuthService()

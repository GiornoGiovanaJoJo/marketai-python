import api from '@/lib/api'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login/', credentials)
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    return response.data
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      await api.post('/auth/logout/', { refresh: refreshToken })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me/')
    return response.data
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }
}

export default new AuthService()

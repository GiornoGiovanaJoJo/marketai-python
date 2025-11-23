import httpClient, { setToken, removeToken } from './http'
import { AxiosError } from 'axios'
import { UserRole, Permission } from '@/types/roles'
import { toast } from '@/components/ui/use-toast'
// ==================== БАЗОВЫЕ ТИПЫ ====================

export interface User {
    id: number
    name: string
    email: string
    phone: string
    role: UserRole
    company_id?: number | null
    permissions?: Permission[]
    email_verified_at: string | null
    phone_verified_at: string | null
    created_at: string
    updated_at: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface MeResponse {
    id: number
    name: string
    email: string
    phone: string
    role: UserRole
    company_id?: number | null
    permissions?: Permission[]
    email_verified_at: string | null
    phone_verified_at: string | null
    created_at: string
    updated_at: string
}

export interface Company {
    id: number
    name: string
    owner_id: number
    created_at: string
    updated_at: string
}

export interface RoleInfo {
    role: UserRole
    label: string
    description: string
    permissions: Permission[]
}

export enum Marketplace {
    Wildberries = 1,
    Ozon = 2,
    YandexMarket = 3,
}

export enum CampaignStatus {
    Inactive = 0,
    Active = 1,
}

export interface Campaign {
    id: number
    name: string
    key: string
    status: CampaignStatus
    marketplace: Marketplace
    created_at: string
    updated_at: string
}

export interface CampaignCreateData {
    name: string
    key: string
    marketplace: Marketplace
}

export interface CampaignUpdateData {
    name?: string
    key?: string
    status?: CampaignStatus
    marketplace?: Marketplace
}

// ==================== 🔥 НОВЫЕ ТИПЫ ДЛЯ ФИНАНСОВЫХ МЕТРИК 🔥 ====================

export interface FinancialMetricsParams {
    campaignId: number
    dateFrom?: string
    dateTo?: string
}

export interface FinancialMetricsResponse {
    data: FinancialMetric[]
    meta: {
        total: number
        currency: string
        date_from: string | null
        date_to: string | null
    }
}

export interface FinancialMetric {
    nm_id: number
    sa_name: string
    sales_count: number
    refuses_count: number
    percent_refuses: number
    deliveries_count: number
    refund_count: number
    sold_count: number
    retail_amount: number
    refund_retail_amount: number
    sold_retail_amount: number
    delivery_amount: number
    acceptance_amount: number
    retail_price: number
    refund_retail_price: number
    spp_amount: number
    seller_before_refund: number
    seller_refund: number
    seller_total: number
    total_commission_with_spp: number
    total_commission_without_spp: number
    penalty_amount: number
    surcharges_amount: number
}

// ==================== ОШИБКИ ====================

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

const handleApiError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const status = error.response?.status || 500
        const message = error.response?.data?.message || error.message
        const errors = error.response?.data?.errors

        throw new ApiError(status, message, errors)
    }

    throw new ApiError(500, 'Неизвестная ошибка')
}

// ==================== API МЕТОДЫ ====================

export const api = {
    // ========== АУТЕНТИФИКАЦИЯ ==========

    async register(
        name: string,
        email: string,
        phone: string,
        password: string,
        password_confirmation: string
    ): Promise<AuthResponse> {
        try {
            const response = await httpClient.post<AuthResponse>('/auth/register', {
                name,
                email,
                phone,
                password,
                password_confirmation,
            })

            setToken(response.data.token)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async login(phone: string, password: string): Promise<AuthResponse> {
        try {
            const response = await httpClient.post<AuthResponse>('/auth/login', {
                phone,
                password,
            })

            setToken(response.data.token)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async getMe(): Promise<MeResponse> {
        try {
            const response = await httpClient.get<MeResponse>('/auth/me')
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async logout(): Promise<void> {
        try {
            await httpClient.post('/auth/logout')
            removeToken()
        } catch (error) {
            removeToken()
            console.error('Logout error:', error)
        }
    },

    // ========== УПРАВЛЕНИЕ РОЛЯМИ ==========

    async getRoles(): Promise<RoleInfo[]> {
        try {
            const response = await httpClient.get<RoleInfo[]>('/roles')
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async getRolePermissions(role: UserRole): Promise<Permission[]> {
        try {
            const response = await httpClient.get<Permission[]>(`/roles/${role}/permissions`)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async assignRole(userId: number, role: UserRole): Promise<void> {
        try {
            await httpClient.post(`/users/${userId}/role`, { role })
        } catch (error) {
            return handleApiError(error)
        }
    },

    async setUserPermissions(userId: number, permissions: Permission[]): Promise<void> {
        try {
            await httpClient.post(`/users/${userId}/permissions`, { permissions })
        } catch (error) {
            return handleApiError(error)
        }
    },

    // ========== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ==========

    async getAllUsers(params?: {
        page?: number
        per_page?: number
        role?: UserRole
        company_id?: number
    }): Promise<{ data: User[]; total: number; current_page: number; last_page: number }> {
        try {
            const response = await httpClient.get('/users', { params })
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async getUser(userId: number): Promise<User> {
        try {
            const response = await httpClient.get<User>(`/users/${userId}`)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async updateUser(
        userId: number,
        data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<User> {
        try {
            const response = await httpClient.patch<User>(`/users/${userId}`, data)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async deleteUser(userId: number): Promise<void> {
        try {
            await httpClient.delete(`/users/${userId}`)
        } catch (error) {
            return handleApiError(error)
        }
    },

    // ========== УПРАВЛЕНИЕ КОМПАНИЯМИ ==========

    async getCompanies(params?: {
        page?: number
        per_page?: number
    }): Promise<{ data: Company[]; total: number; current_page: number; last_page: number }> {
        try {
            const response = await httpClient.get('/companies', { params })
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async getCompany(companyId: number): Promise<Company> {
        try {
            const response = await httpClient.get<Company>(`/companies/${companyId}`)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async createCompany(data: { name: string; owner_id: number }): Promise<Company> {
        try {
            const response = await httpClient.post<Company>('/companies', data)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async updateCompany(companyId: number, data: { name?: string }): Promise<Company> {
        try {
            const response = await httpClient.patch<Company>(`/companies/${companyId}`, data)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async deleteCompany(companyId: number): Promise<void> {
        try {
            await httpClient.delete(`/companies/${companyId}`)
        } catch (error) {
            return handleApiError(error)
        }
    },

    async getCompanyUsers(companyId: number): Promise<User[]> {
        try {
            const response = await httpClient.get<User[]>(`/companies/${companyId}/users`)
            return response.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async addUserToCompany(companyId: number, userId: number): Promise<void> {
        try {
            await httpClient.post(`/companies/${companyId}/users`, { user_id: userId })
        } catch (error) {
            return handleApiError(error)
        }
    },

    async removeUserFromCompany(companyId: number, userId: number): Promise<void> {
        try {
            await httpClient.delete(`/companies/${companyId}/users/${userId}`)
        } catch (error) {
            return handleApiError(error)
        }
    },

    // ========== УПРАВЛЕНИЕ КАМПАНИЯМИ ==========

    async getCampaigns(params?: {
    marketplace?: Marketplace
    status?: CampaignStatus
}): Promise<Campaign[]> {
    try {
        const response = await httpClient.get<{ data: Campaign[] }>('/campaigns', { params })
        return response.data.data
    } catch (error: any) {
        console.error('getCampaigns error:', error)
        
        // Показываем пользователю уведомление
        if (error.response?.status === 500) {
            toast({
                title: 'Ошибка сервера',
                description: 'Не удалось загрузить кампании. Попробуйте обновить страницу.',
                variant: 'destructive'
            })
        } else {
            // Для других ошибок используем handleApiError
            handleApiError(error)
        }
        
        // Graceful degradation: вернуть пустой массив вместо краша
        return []
    }
},


    async getCampaign(campaignId: number): Promise<Campaign> {
        try {
            const response = await httpClient.get<{ data: Campaign }>(`/campaigns/${campaignId}`)
            return response.data.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async createCampaign(data: CampaignCreateData): Promise<Campaign> {
        try {
            const response = await httpClient.post<{ data: Campaign }>('/campaigns', data)
            return response.data.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async updateCampaign(
        campaignId: number,
        data: CampaignUpdateData
    ): Promise<Campaign> {
        try {
            const response = await httpClient.patch<{ data: Campaign }>(`/campaigns/${campaignId}`, data)
            return response.data.data
        } catch (error) {
            return handleApiError(error)
        }
    },

    async deleteCampaign(campaignId: number): Promise<void> {
        try {
            await httpClient.delete(`/campaigns/${campaignId}`)
        } catch (error) {
            return handleApiError(error)
        }
    },

    // ========== ПРОВЕРКА ДОСТУПА ==========

    async checkPermission(permission: Permission): Promise<boolean> {
        try {
            const response = await httpClient.post<{ has_permission: boolean }>(
                '/auth/check-permission',
                { permission }
            )
            return response.data.has_permission
        } catch (error) {
            console.error('Permission check error:', error)
            return false
        }
    },

    async canManageUser(targetUserId: number): Promise<boolean> {
        try {
            const response = await httpClient.post<{ can_manage: boolean }>(
                '/auth/can-manage-user',
                { target_user_id: targetUserId }
            )
            return response.data.can_manage
        } catch (error) {
            console.error('Can manage user check error:', error)
            return false
        }
    },

    // ========== 🔥 ФИНАНСОВЫЕ МЕТРИКИ (НОВЫЙ МЕТОД) 🔥 ==========

    async getFinancialMetrics(params: FinancialMetricsParams): Promise<FinancialMetricsResponse> {
        const { campaignId, dateFrom, dateTo } = params

        if (!campaignId) {
            throw new ApiError(400, 'campaignId обязателен для запроса финансовых метрик')
        }
        try {
            const requestParams: Record<string, any> = { campaignId }

            if (dateFrom) requestParams.dateFrom = dateFrom
            if (dateTo) requestParams.dateTo = dateTo

            if (import.meta.env.DEV) {
                console.log('[API] Fetching financial metrics:', requestParams)
            }

            const response = await httpClient.get<FinancialMetricsResponse>(
                '/statistics/financial-report',
                { params: requestParams }
            )

            if (import.meta.env.DEV) {
                console.log('[API] Financial metrics received:', {
                    total: response.data.meta?.total || 0,
                    dateRange: {
                        from: response.data.meta?.date_from,
                        to: response.data.meta?.date_to,
                    }
                })
            }

            return response.data
        } catch (error) {
            console.error('[API] Error fetching financial metrics:', error)
            return handleApiError(error)
        }
    },
}

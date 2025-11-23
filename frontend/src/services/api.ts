import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    User,
    AuthResponse,
    LoginRequest,
    RegisterRequest
} from '@/types/auth.types'
import { getToken, setToken, removeToken } from '@/lib/http'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://4895c9d9450e.vps.myjino.ru/api',
    prepareHeaders: (headers) => {
        const token = getToken()
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        headers.set('Accept', 'application/json')
        return headers
    },
})

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User', 'Auth'],
    endpoints: (builder) => ({
        // Логин
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    setToken(data.token)
                } catch (error) {
                    console.error('Login failed:', error)
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),

        // Регистрация
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    setToken(data.token)
                } catch (error) {
                    console.error('Registration failed:', error)
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),

        // Получение текущего пользователя
        getMe: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),

        // Логаут
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (error) {
                    console.error('Logout failed:', error)
                } finally {
                    removeToken()
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useLogoutMutation,
    useLazyGetMeQuery,
} = api

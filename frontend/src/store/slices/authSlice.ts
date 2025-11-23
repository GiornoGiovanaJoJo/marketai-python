import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types/auth.types'
import { api } from '@/services/api'
import { getToken, removeToken } from '@/lib/http'

const initialState: AuthState = {
    user: null,
    token: getToken(),
    isAuthenticated: !!getToken(),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        clearAuth: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            removeToken()
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
            }
        )

        builder.addMatcher(
            api.endpoints.register.matchFulfilled,
            (state, action) => {
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
            }
        )

        builder.addMatcher(
            api.endpoints.getMe.matchFulfilled,
            (state, action) => {
                state.user = action.payload
                state.isAuthenticated = true
            }
        )

        builder.addMatcher(
            api.endpoints.logout.matchFulfilled,
            (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
            }
        )

        builder.addMatcher(
            api.endpoints.getMe.matchRejected,
            (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                removeToken()
            }
        )
    },
})

export const { setCredentials, updateUser, clearAuth } = authSlice.actions
export default authSlice.reducer

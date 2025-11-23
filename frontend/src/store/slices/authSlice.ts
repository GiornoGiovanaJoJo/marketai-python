import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types/auth.types'
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
})

export const { setCredentials, updateUser, clearAuth } = authSlice.actions
export default authSlice.reducer

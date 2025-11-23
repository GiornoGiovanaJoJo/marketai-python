'use client'

import { useEffect } from 'react'
import { useLazyGetMeQuery } from '@/services/api'
import { useAppSelector } from '@/store/hooks'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const [getMe] = useLazyGetMeQuery()
    const token = useAppSelector((state) => state.auth.token)

    useEffect(() => {
        if (token) {
            getMe()
        }
    }, [token, getMe])

    return <>{children}</>
}

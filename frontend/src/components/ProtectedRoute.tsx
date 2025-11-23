'use client'

import React, {useEffect} from 'react'
import {useAppSelector} from '@/store/hooks'
import {useGetMeQuery} from '@/services/api'
import {useNavigate} from "react-router-dom";

export function ProtectedRoute({children}: { children: React.ReactNode }) {
    const {isAuthenticated, token} = useAppSelector((state) => state.auth)
    const {isLoading, isError} = useGetMeQuery(undefined, {
        skip: !token,
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || isError)) {
            navigate('/login')
        }
    }, [isAuthenticated, isError, isLoading])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

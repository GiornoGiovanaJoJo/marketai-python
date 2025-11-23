import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Permission, ROLE_PERMISSIONS, UserRole, ROLE_HIERARCHY } from '@/types/roles'

export function usePermissions() {
    const { user } = useAuth()

    // Получаем разрешения текущего пользователя
    const permissions = useMemo(() => {
        if (!user?.role) return []

        // Если у пользователя есть кастомные разрешения, используем их
        if (user.permissions && user.permissions.length > 0) {
            return user.permissions
        }

        // Иначе используем разрешения по умолчанию для роли
        return ROLE_PERMISSIONS[user.role as UserRole] || []
    }, [user])

    // Проверка наличия разрешения
    const hasPermission = (permission: Permission): boolean => {
        return permissions.includes(permission)
    }

    // Проверка наличия хотя бы одного из разрешений
    const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
        return requiredPermissions.some(permission => permissions.includes(permission))
    }

    // Проверка наличия всех разрешений
    const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
        return requiredPermissions.every(permission => permissions.includes(permission))
    }

    // Проверка роли
    const hasRole = (role: UserRole): boolean => {
        return user?.role === role
    }

    // Проверка, что роль выше или равна указанной
    const hasRoleOrHigher = (role: UserRole): boolean => {
        if (!user?.role) return false

        const userRoleLevel = ROLE_HIERARCHY[user.role as UserRole] || 0
        const requiredRoleLevel = ROLE_HIERARCHY[role] || 0

        return userRoleLevel >= requiredRoleLevel
    }

    // Проверка, может ли пользователь управлять другим пользователем
    const canManageUser = (targetUserRole: UserRole): boolean => {
        if (!user?.role) return false

        const userRoleLevel = ROLE_HIERARCHY[user.role as UserRole] || 0
        const targetRoleLevel = ROLE_HIERARCHY[targetUserRole] || 0

        // Можно управлять пользователями с ролью ниже своей
        return userRoleLevel > targetRoleLevel
    }

    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasRoleOrHigher,
        canManageUser,
    }
}

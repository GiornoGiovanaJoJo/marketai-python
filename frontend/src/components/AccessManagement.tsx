import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { Permission, UserRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/types/roles'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'

interface AccessManagementProps {
    userId: number
    currentRole: UserRole
    currentPermissions: Permission[]
    onUpdate: () => void
}

export function AccessManagement({
                                     userId,
                                     currentRole,
                                     currentPermissions,
                                     onUpdate
                                 }: AccessManagementProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole)
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(currentPermissions)
    const [isLoading, setIsLoading] = useState(false)
    const { canManageUser } = usePermissions()
    const { toast } = useToast()

    // Проверяем, может ли текущий пользователь управлять этим пользователем
    const canManage = canManageUser(currentRole)

    const handleRoleChange = async (role: UserRole) => {
        setSelectedRole(role)

        // Загружаем разрешения по умолчанию для новой роли
        try {
            const defaultPermissions = await api.getRolePermissions(role)
            setSelectedPermissions(defaultPermissions)
        } catch (error) {
            console.error('Failed to load role permissions:', error)
        }
    }

    const handlePermissionToggle = (permission: Permission) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        )
    }

    const handleSave = async () => {
        setIsLoading(true)

        try {
            // Назначаем роль
            await api.assignRole(userId, selectedRole)

            // Устанавливаем кастомные разрешения
            await api.setUserPermissions(userId, selectedPermissions)

            toast({
                title: 'Доступ обновлен',
                description: 'Права пользователя успешно изменены',
            })

            onUpdate()
        } catch (error: any) {
            toast({
                title: 'Ошибка',
                description: error.message || 'Не удалось обновить доступ',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!canManage) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">
                        У вас нет прав для управления этим пользователем
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Управление доступом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Выбор роли */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Роль</label>
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(ROLE_LABELS).map(([role, label]) => (
                                <SelectItem key={role} value={role}>
                                    <div>
                                        <div className="font-medium">{label}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {ROLE_DESCRIPTIONS[role as UserRole]}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Кастомные разрешения */}
                <div className="space-y-4">
                    <label className="text-sm font-medium">Дополнительные разрешения</label>
                    <div className="space-y-2">
                        {Object.values(Permission).map(permission => (
                            <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                    id={permission}
                                    checked={selectedPermissions.includes(permission)}
                                    onCheckedChange={() => handlePermissionToggle(permission)}
                                />
                                <label
                                    htmlFor={permission}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {permission.replace(/_/g, ' ')}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Кнопка сохранения */}
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </CardContent>
        </Card>
    )
}

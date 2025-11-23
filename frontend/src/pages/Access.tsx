import { useState, useEffect } from "react"
import { Search, Plus, Shield, Edit, Trash2, Save, X, Users as UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { usePermissions } from "@/hooks/usePermissions"
import { api, type User } from "@/lib/api"
import {
    UserRole,
    Permission,
    ROLE_LABELS,
    ROLE_DESCRIPTIONS,
    ROLE_PERMISSIONS
} from "@/types/roles"

export function Access() {
    const { toast } = useToast()
    const { hasPermission, canManageUser } = usePermissions()

    // Состояние
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")

    // Редактирование пользователя
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Загрузка пользователей
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await api.getAllUsers({
                per_page: 100,
            })
            setUsers(response.data)
        } catch (error: any) {
            toast({
                title: "Ошибка загрузки",
                description: error.message || "Не удалось загрузить список пользователей",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Фильтрация пользователей
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)

        const matchesRole = roleFilter === "all" || user.role === roleFilter

        return matchesSearch && matchesRole
    })

    // Открыть редактирование
    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setSelectedRole(user.role)
        setSelectedPermissions(user.permissions || ROLE_PERMISSIONS[user.role] || [])
    }

    // Изменение роли
    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role)
        // Автоматически загружаем стандартные разрешения для роли
        setSelectedPermissions(ROLE_PERMISSIONS[role] || [])
    }

    // Переключение разрешения
    const handlePermissionToggle = (permission: Permission) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        )
    }

    // Сохранение изменений
    const handleSaveUser = async () => {
        if (!editingUser || !selectedRole) return

        setIsSaving(true)
        try {
            // Обновляем роль
            await api.assignRole(editingUser.id, selectedRole)

            // Обновляем разрешения
            await api.setUserPermissions(editingUser.id, selectedPermissions)

            toast({
                title: "Доступ обновлен",
                description: `Права пользователя ${editingUser.name} успешно изменены`,
            })

            // Перезагружаем список
            await loadUsers()

            // Закрываем диалог
            setEditingUser(null)
        } catch (error: any) {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось обновить доступ",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Удаление пользователя
    const handleDeleteUser = async (user: User) => {
        if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
            return
        }

        try {
            await api.deleteUser(user.id)

            toast({
                title: "Пользователь удален",
                description: `${user.name} успешно удален`,
            })

            await loadUsers()
        } catch (error: any) {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось удалить пользователя",
                variant: "destructive",
            })
        }
    }

    // Получить цвет роли
    const getRoleBadgeColor = (role: UserRole): string => {
        switch (role) {
            case UserRole.PLATFORM_OWNER:
                return "bg-red-500/20 text-red-500 border-red-500/30"
            case UserRole.COMPANY:
                return "bg-blue-500/20 text-blue-500 border-blue-500/30"
            case UserRole.EMPLOYEE:
                return "bg-green-500/20 text-green-500 border-green-500/30"
            case UserRole.EXECUTOR:
                return "bg-purple-500/20 text-purple-500 border-purple-500/30"
            default:
                return "bg-gray-500/20 text-gray-500 border-gray-500/30"
        }
    }

    // Проверка прав доступа
    const canManageAccess = hasPermission(Permission.MANAGE_PERMISSIONS) ||
        hasPermission(Permission.MANAGE_ALL_USERS) ||
        hasPermission(Permission.MANAGE_COMPANY_USERS)

    if (!canManageAccess) {
        return (
            <div className="min-h-screen p-8">
                <Card>
                    <CardContent className="p-12 text-center">
                        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Нет доступа</h2>
                        <p className="text-muted-foreground">
                            У вас нет прав для управления доступами пользователей
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Заголовок */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                            Управление доступами
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Настройка ролей и разрешений пользователей
                        </p>
                    </div>

                    <Button
                        onClick={() => window.location.href = '/register'}
                        className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить пользователя
                    </Button>
                </div>

                {/* Фильтры */}
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Поиск */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Поиск по имени, email или телефону..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Фильтр по роли */}
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Все роли" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все роли</SelectItem>
                                    {Object.entries(ROLE_LABELS).map(([role, label]) => (
                                        <SelectItem key={role} value={role}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Статистика */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Всего пользователей</p>
                                    <p className="text-2xl font-bold">{users.length}</p>
                                </div>
                                <UsersIcon className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    {Object.entries(ROLE_LABELS).map(([role, label]) => (
                        <Card key={role} className="bg-card/50 border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{label}</p>
                                        <p className="text-2xl font-bold">
                                            {users.filter(u => u.role === role).length}
                                        </p>
                                    </div>
                                    <Shield className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Таблица пользователей */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Пользователи системы</CardTitle>
                        <CardDescription>
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'пользователь' : 'пользователей'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-muted-foreground mt-4">Загрузка...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <UsersIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">Пользователи не найдены</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 hover:bg-transparent">
                                            <TableHead className="font-bold">Пользователь</TableHead>
                                            <TableHead className="font-bold">Контакты</TableHead>
                                            <TableHead className="font-bold">Роль</TableHead>
                                            <TableHead className="font-bold">Компания</TableHead>
                                            <TableHead className="font-bold">Дата создания</TableHead>
                                            <TableHead className="font-bold text-right">Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => {
                                            const canManage = canManageUser(user.role)

                                            return (
                                                <TableRow key={user.id} className="border-b border-border/30 hover:bg-secondary/20">
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            <div>{user.email}</div>
                                                            <div className="text-muted-foreground">{user.phone}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getRoleBadgeColor(user.role)}>
                                                            {ROLE_LABELS[user.role]}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.company_id ? (
                                                            <span className="text-sm">Компания #{user.company_id}</span>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEditUser(user)}
                                                                        disabled={!canManage}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Редактирование доступа</DialogTitle>
                                                                        <DialogDescription>
                                                                            Настройка роли и разрешений для {editingUser?.name}
                                                                        </DialogDescription>
                                                                    </DialogHeader>

                                                                    <div className="space-y-6 py-4">
                                                                        {/* Выбор роли */}
                                                                        <div className="space-y-2">
                                                                            <label className="text-sm font-medium">Роль</label>
                                                                            <Select
                                                                                value={selectedRole || undefined}
                                                                                onValueChange={(value) => handleRoleChange(value as UserRole)}
                                                                            >
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

                                                                        {/* Разрешения */}
                                                                        <div className="space-y-4">
                                                                            <label className="text-sm font-medium">Разрешения</label>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-4 border rounded-lg">
                                                                                {Object.values(Permission).map((permission) => (
                                                                                    <div key={permission} className="flex items-start space-x-2">
                                                                                        <Checkbox
                                                                                            id={permission}
                                                                                            checked={selectedPermissions.includes(permission)}
                                                                                            onCheckedChange={() => handlePermissionToggle(permission)}
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={permission}
                                                                                            className="text-sm leading-none cursor-pointer"
                                                                                        >
                                                                                            {permission.replace(/_/g, ' ')}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => setEditingUser(null)}
                                                                        >
                                                                            <X className="h-4 w-4 mr-2" />
                                                                            Отмена
                                                                        </Button>
                                                                        <Button
                                                                            onClick={handleSaveUser}
                                                                            disabled={isSaving}
                                                                            className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600"
                                                                        >
                                                                            <Save className="h-4 w-4 mr-2" />
                                                                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteUser(user)}
                                                                disabled={!canManage}
                                                                className="hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

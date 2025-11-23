// Роли в системе
export enum UserRole {
    PLATFORM_OWNER = 'platform_owner',
    COMPANY = 'company',
    EMPLOYEE = 'employee',
    EXECUTOR = 'executor',
}

// Разрешения (permissions)
export enum Permission {
    // Управление пользователями
    MANAGE_ALL_USERS = 'manage_all_users',
    MANAGE_COMPANY_USERS = 'manage_company_users',
    VIEW_USERS = 'view_users',

    // Управление компаниями
    MANAGE_COMPANIES = 'manage_companies',
    VIEW_COMPANIES = 'view_companies',

    // Управление данными
    MANAGE_ALL_DATA = 'manage_all_data',
    MANAGE_COMPANY_DATA = 'manage_company_data',
    EDIT_DATA = 'edit_data',
    VIEW_DATA = 'view_data',

    // Управление доступами
    MANAGE_PERMISSIONS = 'manage_permissions',
    MANAGE_ROLES = 'manage_roles',

    // Управление кампаниями
    CREATE_CAMPAIGN = 'create_campaign',
    EDIT_CAMPAIGN = 'edit_campaign',
    DELETE_CAMPAIGN = 'delete_campaign',
    VIEW_CAMPAIGN = 'view_campaign',

    // Финансы
    VIEW_FINANCE = 'view_finance',
    MANAGE_FINANCE = 'manage_finance',

    // Отчеты
    VIEW_REPORTS = 'view_reports',
    EXPORT_REPORTS = 'export_reports',

    // Настройки
    MANAGE_SETTINGS = 'manage_settings',
    VIEW_SETTINGS = 'view_settings',
}

// Маппинг ролей на разрешения
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.PLATFORM_OWNER]: [
        // Владелец платформы имеет все права
        Permission.MANAGE_ALL_USERS,
        Permission.MANAGE_COMPANIES,
        Permission.VIEW_COMPANIES,
        Permission.MANAGE_ALL_DATA,
        Permission.MANAGE_PERMISSIONS,
        Permission.MANAGE_ROLES,
        Permission.CREATE_CAMPAIGN,
        Permission.EDIT_CAMPAIGN,
        Permission.DELETE_CAMPAIGN,
        Permission.VIEW_CAMPAIGN,
        Permission.VIEW_FINANCE,
        Permission.MANAGE_FINANCE,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,
    ],

    [UserRole.COMPANY]: [
        // Компания управляет своими пользователями и данными
        Permission.MANAGE_COMPANY_USERS,
        Permission.VIEW_USERS,
        Permission.MANAGE_COMPANY_DATA,
        Permission.CREATE_CAMPAIGN,
        Permission.EDIT_CAMPAIGN,
        Permission.DELETE_CAMPAIGN,
        Permission.VIEW_CAMPAIGN,
        Permission.VIEW_FINANCE,
        Permission.MANAGE_FINANCE,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,
    ],

    [UserRole.EMPLOYEE]: [
        // Сотрудник может работать с данными компании
        Permission.VIEW_USERS,
        Permission.EDIT_DATA,
        Permission.VIEW_DATA,
        Permission.CREATE_CAMPAIGN,
        Permission.EDIT_CAMPAIGN,
        Permission.VIEW_CAMPAIGN,
        Permission.VIEW_FINANCE,
        Permission.VIEW_REPORTS,
        Permission.VIEW_SETTINGS,
    ],

    [UserRole.EXECUTOR]: [
        // Исполнитель имеет минимальные права
        Permission.VIEW_DATA,
        Permission.VIEW_CAMPAIGN,
        Permission.VIEW_REPORTS,
    ],
}

// Названия ролей на русском
export const ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.PLATFORM_OWNER]: 'Владелец платформы',
    [UserRole.COMPANY]: 'Компания',
    [UserRole.EMPLOYEE]: 'Сотрудник',
    [UserRole.EXECUTOR]: 'Исполнитель',
}

// Описания ролей
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    [UserRole.PLATFORM_OWNER]: 'Полный доступ ко всем функциям платформы',
    [UserRole.COMPANY]: 'Управление компанией и её сотрудниками',
    [UserRole.EMPLOYEE]: 'Работа с данными компании',
    [UserRole.EXECUTOR]: 'Просмотр данных и выполнение задач',
}

// Иерархия ролей (для проверки прав)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.PLATFORM_OWNER]: 4,
    [UserRole.COMPANY]: 3,
    [UserRole.EMPLOYEE]: 2,
    [UserRole.EXECUTOR]: 1,
}

// Структура навигационного меню MarketAI

export interface NavMenuItem {
  id: string;
  label: string;
  path?: string;
  children?: NavMenuItem[];
  disabled?: boolean; // Элемент не реализован
}

export const navMenu: NavMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Дашборд',
    path: '/dashboard',
  },
  {
    id: 'campaigns',
    label: 'Моя организация',
    path: '/campaigns',
  },
  {
    id: 'content-generator',
    label: 'Генератор контента',
    path: '/content-generator',
    disabled: true,
  },
  {
    id: 'management',
    label: 'Управленка',
    children: [
      {
        id: 'opi-dashboard',
        label: 'ОПИУ · Dashboard',
        path: '/management/opi-dashboard',
      },
      {
        id: 'opi-fin-report',
        label: 'ОПИУ · FIN отчёт',
        path: '/management/opi-fin-report',
      },
      {
        id: 'plan-fact',
        label: 'План–Факт',
        path: '/management/plan-fact',
      },
      {
        id: 'unit-economics',
        label: 'Юнит-экономика',
        path: '/management/unit-economics',
      },
      {
        id: 'cashflow',
        label: 'ДДС',
        path: '/management/dds',
      },
      {
        id: 'advertising-rnp',
        label: 'РНП реклама',
        path: '/management/advertising-rnp',
      },
      {
        id: 'heatmap',
        label: 'Тепловая карта',
        path: '/management/heatmap',
      },
      {
        id: 'pre-delivery',
        label: 'До поставки',
        path: '/management/pre-delivery',
      },
      {
        id: 'regions',
        label: 'Регионы',
        path: '/management/regions',
        disabled: true,
      },
      {
        id: 'abc-analysis',
        label: 'ABC-анализ',
        path: '/management/abc-analysis',
        disabled: true,
      },
      {
        id: 'tasks',
        label: 'Задачи',
        path: '/management/tasks',
        disabled: true,
      },
      {
        id: 'ai-automation',
        label: 'ИИ и автоматизация задач',
        path: '/management/ai-automation',
      },
    ],
  },
  {
    id: 'referral',
    label: 'Реферальная программа',
    children: [
      {
        id: 'referral-about',
        label: 'О программе',
        path: '/referral/about',
      },
      {
        id: 'referral-overview',
        label: 'Обзор',
        path: '/referral/overview',
      },
      {
        id: 'referral-network',
        label: 'Моя сеть',
        path: '/referral/network',
      },
      {
        id: 'referral-income',
        label: 'Доход и начисления',
        path: '/referral/income',
      },
      {
        id: 'referral-payments',
        label: 'Выплаты',
        path: '/referral/payments',
      },
      {
        id: 'referral-settings',
        label: 'Настройки',
        path: '/referral/settings',
      },
      {
        id: 'referral-help',
        label: 'Помощь',
        path: '/referral/help',
        disabled: true,
      },
    ],
  },
  {
    id: 'partners',
    label: 'Партнёры',
    path: '/partners',
  },
  {
    id: 'app-store',
    label: 'App Store',
    path: '/app-store',
    disabled: true,
  },
  {
    id: 'white-label',
    label: 'White Label',
    path: '/white-label',
    disabled: true,
  },
  {
    id: 'knowledge-base',
    label: 'База знаний',
    path: '/knowledge-base',
    disabled: true,
  },
  {
    id: 'events',
    label: 'Мероприятия',
    path: '/events',
    disabled: true,
  },
  {
    id: 'settings',
    label: 'Настройки',
    children: [
      {
        id: 'settings-companies',
        label: 'Мои компании',
        path: '/settings/companies',
        disabled: true,
      },
      {
        id: 'settings-employees',
        label: 'Мои сотрудники',
        path: '/settings/employees',
      },
      {
        id: 'settings-access',
        label: 'Доступ сотрудникам',
        path: '/settings/access',
      },
    ],
  },
];

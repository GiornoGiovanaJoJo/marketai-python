# MarketAI Frontend

React + TypeScript + Vite + Tailwind CSS frontend для MarketAI платформы.

## 🚀 Технологии

- **React 18.2** - UI библиотека
- **TypeScript 5.2** - Типизация
- **Vite 5.0** - Сборщик
- **Tailwind CSS 3.3** - Стилизация
- **Radix UI** - Компоненты
- **React Router 6.20** - Роутинг
- **Axios** - HTTP клиент
- **Recharts 3.3** - Графики

## 📦 Установка

```bash
npm install
```

## 🛠 Разработка

```bash
npm run dev
```

Фронтенд запустится на http://localhost:3000

API запросы проксируются на Django backend (http://localhost:8000)

## 🏗 Сборка

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## 📝 Скрипты

- `npm run dev` - Запуск dev сервера
- `npm run build` - Production сборка
- `npm run lint` - Проверка кода
- `npm run preview` - Просмотр production сборки
- `npm run type-check` - Проверка TypeScript типов

## 🔗 API Integration

Все API запросы используют базовый URL: `http://localhost:8000/api/`

Примеры:
- Authentication: `/api/auth/login/`
- Campaigns: `/api/campaigns/`
- Statistics: `/api/statistics/`

## 📁 Структура

```
src/
├── components/     # Переиспользуемые компоненты
├── pages/          # Страницы приложения
├── services/       # API сервисы
├── contexts/       # React Context
├── hooks/          # Custom hooks
├── lib/            # Утилиты
├── store/          # Redux store
├── types/          # TypeScript типы
└── App.tsx         # Главный компонент
```

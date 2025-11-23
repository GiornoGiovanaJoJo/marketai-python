import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@/services/api';

// Импорт всех reducers
import authReducer from './slices/authSlice';
import filtersReducer from './slices/filtersSlice';
import referralReducer from './slices/referralSlice';
import reportsReducer from './slices/reportsSlice';
import organizationReducer from './slices/organizationSlice';
import automationReducer from './slices/automationSlice';
import opiReducer from './slices/opiSlice';
import advertisingReducer from './slices/advertisingSlice';

export const store = configureStore({
  reducer: {
    // API
    [api.reducerPath]: api.reducer,
    
    // Базовые reducers
    auth: authReducer,
    filters: filtersReducer,
    
    // Бизнес-логика
    referral: referralReducer,           // Реферальная программа
    reports: reportsReducer,             // Отчёты (финансовые, план-факт, юнит-экономика, heatmap)
    organization: organizationReducer,   // Организация, сотрудники, партнёры, доступ
    automation: automationReducer,       // Автоматизация и предпоставка
    opi: opiReducer,                     // OPI Dashboard
    advertising: advertisingReducer,     // Реклама (РНП, ДДС)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

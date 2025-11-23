import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для реферальной программы
interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  level: number;
  directReferrals: number;
  totalReferrals: number;
  earnings: number;
}

interface ReferralIncome {
  id: string;
  date: string;
  amount: number;
  type: 'direct' | 'indirect';
  fromUser: string;
  status: 'pending' | 'paid';
}

interface ReferralPayout {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
}

interface ReferralStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  averageEarningPerReferral: number;
}

interface ReferralSettings {
  referralCode: string;
  referralLink: string;
  autoWithdraw: boolean;
  minWithdrawAmount: number;
  notifications: {
    newReferral: boolean;
    earningsUpdate: boolean;
    payoutProcessed: boolean;
  };
}

interface ReferralState {
  // Данные
  stats: ReferralStats | null;
  network: ReferralUser[];
  income: ReferralIncome[];
  payouts: ReferralPayout[];
  settings: ReferralSettings | null;
  
  // UI состояние
  loading: boolean;
  error: string | null;
  
  // Пагинация
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  
  // Фильтры
  filters: {
    period: 'week' | 'month' | 'quarter' | 'year' | 'all';
    status: 'all' | 'active' | 'inactive';
    sortBy: 'date' | 'earnings' | 'referrals';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: ReferralState = {
  stats: null,
  network: [],
  income: [],
  payouts: [],
  settings: null,
  
  loading: false,
  error: null,
  
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 20,
  
  filters: {
    period: 'month',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    // Загрузка статистики
    setStats(state, action: PayloadAction<ReferralStats>) {
      state.stats = action.payload;
    },
    
    // Загрузка сети рефералов
    setNetwork(state, action: PayloadAction<ReferralUser[]>) {
      state.network = action.payload;
    },
    
    // Загрузка доходов
    setIncome(state, action: PayloadAction<ReferralIncome[]>) {
      state.income = action.payload;
    },
    
    // Загрузка выплат
    setPayouts(state, action: PayloadAction<ReferralPayout[]>) {
      state.payouts = action.payload;
    },
    
    // Загрузка настроек
    setSettings(state, action: PayloadAction<ReferralSettings>) {
      state.settings = action.payload;
    },
    
    // Обновление настроек
    updateSettings(state, action: PayloadAction<Partial<ReferralSettings>>) {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
    
    // Добавление нового реферала
    addReferral(state, action: PayloadAction<ReferralUser>) {
      state.network.unshift(action.payload);
      if (state.stats) {
        state.stats.totalReferrals += 1;
        state.stats.activeReferrals += 1;
      }
    },
    
    // Обновление статуса реферала
    updateReferralStatus(state, action: PayloadAction<{ id: string; status: 'active' | 'inactive' }>) {
      const referral = state.network.find(r => r.id === action.payload.id);
      if (referral) {
        referral.status = action.payload.status;
      }
    },
    
    // Добавление нового дохода
    addIncome(state, action: PayloadAction<ReferralIncome>) {
      state.income.unshift(action.payload);
      if (state.stats) {
        state.stats.pendingEarnings += action.payload.amount;
        state.stats.totalEarnings += action.payload.amount;
      }
    },
    
    // Обновление статуса выплаты
    updatePayoutStatus(state, action: PayloadAction<{ id: string; status: ReferralPayout['status'] }>) {
      const payout = state.payouts.find(p => p.id === action.payload.id);
      if (payout) {
        payout.status = action.payload.status;
      }
    },
    
    // Фильтры
    setFilters(state, action: PayloadAction<Partial<ReferralState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    
    // Пагинация
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    
    // Состояние загрузки
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError(state) {
      state.error = null;
    },
    
    // Сброс состояния
    resetReferralState() {
      return initialState;
    },
  },
});

export const {
  setStats,
  setNetwork,
  setIncome,
  setPayouts,
  setSettings,
  updateSettings,
  addReferral,
  updateReferralStatus,
  addIncome,
  updatePayoutStatus,
  setFilters,
  resetFilters,
  setPage,
  setTotalPages,
  setLoading,
  setError,
  clearError,
  resetReferralState,
} = referralSlice.actions;

export default referralSlice.reducer;

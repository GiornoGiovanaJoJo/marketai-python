import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для рекламных кампаний (РНП и ДДС)
interface AdvertisingCampaign {
  id: string;
  name: string;
  type: 'rnp' | 'dds'; // РНП (реклама в поиске) или ДДС (динамические дисконты)
  status: 'active' | 'paused' | 'draft' | 'archived';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
  ctr: number; // Click-Through Rate
  cpc: number; // Cost Per Click
  roas: number; // Return on Ad Spend
  startDate: string;
  endDate?: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  averageCTR: number;
  averageCPC: number;
  averageROAS: number;
}

interface AdvertisingState {
  // Данные
  campaigns: AdvertisingCampaign[];
  selectedCampaign: AdvertisingCampaign | null;
  stats: CampaignStats | null;
  
  // UI состояние
  loading: {
    campaigns: boolean;
    stats: boolean;
  };
  
  error: string | null;
  
  // Фильтры
  filters: {
    type: 'all' | 'rnp' | 'dds';
    status: 'all' | 'active' | 'paused' | 'draft';
    search: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  
  // Сортировка
  sorting: {
    field: 'name' | 'budget' | 'spent' | 'roas' | 'ctr';
    order: 'asc' | 'desc';
  };
  
  // Модальные окна
  modals: {
    createCampaign: boolean;
    editCampaign: boolean;
    campaignDetails: boolean;
  };
}

const initialState: AdvertisingState = {
  campaigns: [],
  selectedCampaign: null,
  stats: null,
  
  loading: {
    campaigns: false,
    stats: false,
  },
  
  error: null,
  
  filters: {
    type: 'all',
    status: 'all',
    search: '',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  },
  
  sorting: {
    field: 'spent',
    order: 'desc',
  },
  
  modals: {
    createCampaign: false,
    editCampaign: false,
    campaignDetails: false,
  },
};

const advertisingSlice = createSlice({
  name: 'advertising',
  initialState,
  reducers: {
    // Кампании
    setCampaigns(state, action: PayloadAction<AdvertisingCampaign[]>) {
      state.campaigns = action.payload;
    },
    
    addCampaign(state, action: PayloadAction<AdvertisingCampaign>) {
      state.campaigns.unshift(action.payload);
    },
    
    updateCampaign(state, action: PayloadAction<AdvertisingCampaign>) {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    
    deleteCampaign(state, action: PayloadAction<string>) {
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },
    
    setSelectedCampaign(state, action: PayloadAction<AdvertisingCampaign | null>) {
      state.selectedCampaign = action.payload;
    },
    
    updateCampaignStatus(state, action: PayloadAction<{ id: string; status: AdvertisingCampaign['status'] }>) {
      const campaign = state.campaigns.find(c => c.id === action.payload.id);
      if (campaign) {
        campaign.status = action.payload.status;
      }
    },
    
    // Статистика
    setStats(state, action: PayloadAction<CampaignStats>) {
      state.stats = action.payload;
    },
    
    // Фильтры
    setFilters(state, action: PayloadAction<Partial<AdvertisingState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    setType(state, action: PayloadAction<AdvertisingState['filters']['type']>) {
      state.filters.type = action.payload;
    },
    
    setStatus(state, action: PayloadAction<AdvertisingState['filters']['status']>) {
      state.filters.status = action.payload;
    },
    
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    
    setDateRange(state, action: PayloadAction<{ start: string; end: string }>) {
      state.filters.dateRange = action.payload;
    },
    
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    
    // Сортировка
    setSorting(state, action: PayloadAction<AdvertisingState['sorting']>) {
      state.sorting = action.payload;
    },
    
    toggleSortOrder(state) {
      state.sorting.order = state.sorting.order === 'asc' ? 'desc' : 'asc';
    },
    
    // Модальные окна
    openModal(state, action: PayloadAction<keyof AdvertisingState['modals']>) {
      state.modals[action.payload] = true;
    },
    
    closeModal(state, action: PayloadAction<keyof AdvertisingState['modals']>) {
      state.modals[action.payload] = false;
    },
    
    closeAllModals(state) {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof AdvertisingState['modals']] = false;
      });
    },
    
    // Загрузка
    setLoading(state, action: PayloadAction<{ type: keyof AdvertisingState['loading']; value: boolean }>) {
      state.loading[action.payload.type] = action.payload.value;
      if (action.payload.value) {
        state.error = null;
      }
    },
    
    setAllLoading(state, action: PayloadAction<boolean>) {
      state.loading.campaigns = action.payload;
      state.loading.stats = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading.campaigns = false;
      state.loading.stats = false;
    },
    
    clearError(state) {
      state.error = null;
    },
    
    // Сброс
    resetAdvertisingState() {
      return initialState;
    },
  },
});

export const {
  setCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  setSelectedCampaign,
  updateCampaignStatus,
  setStats,
  setFilters,
  setType,
  setStatus,
  setSearch,
  setDateRange,
  resetFilters,
  setSorting,
  toggleSortOrder,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setAllLoading,
  setError,
  clearError,
  resetAdvertisingState,
} = advertisingSlice.actions;

export default advertisingSlice.reducer;

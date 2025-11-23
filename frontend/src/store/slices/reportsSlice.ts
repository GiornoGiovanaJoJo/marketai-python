import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для отчётов
interface FinancialReportData {
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  roi: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

interface PlanFactData {
  period: string;
  category: string;
  plan: number;
  fact: number;
  deviation: number;
  deviationPercent: number;
  status: 'above' | 'ontrack' | 'below';
}

interface UnitEconomicsData {
  period: string;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  paybackPeriod: number;
  churnRate: number;
  arpu: number; // Average Revenue Per User
  breakeven: number;
}

interface MetricsData {
  date: string;
  metric: string;
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

interface HeatmapData {
  date: string;
  hour: number;
  value: number;
  category: string;
}

interface ReportsState {
  // Данные отчётов
  financial: {
    data: FinancialReportData[];
    summary: {
      totalRevenue: number;
      totalCosts: number;
      totalProfit: number;
      averageMargin: number;
    } | null;
  };
  
  planFact: {
    data: PlanFactData[];
    summary: {
      totalPlan: number;
      totalFact: number;
      totalDeviation: number;
      achievementRate: number;
    } | null;
  };
  
  unitEconomics: {
    data: UnitEconomicsData[];
    current: UnitEconomicsData | null;
  };
  
  metrics: {
    data: MetricsData[];
    selectedMetrics: string[];
  };
  
  heatmap: {
    data: HeatmapData[];
    config: {
      metric: string;
      granularity: 'hour' | 'day' | 'week';
    };
  };
  
  // UI состояние
  loading: {
    financial: boolean;
    planFact: boolean;
    unitEconomics: boolean;
    metrics: boolean;
    heatmap: boolean;
  };
  
  error: string | null;
  
  // Фильтры
  filters: {
    dateRange: {
      start: string;
      end: string;
    };
    period: 'day' | 'week' | 'month' | 'quarter' | 'year';
    categories: string[];
    groupBy: 'day' | 'week' | 'month';
  };
  
  // Экспорт
  exporting: boolean;
  exportFormat: 'pdf' | 'excel' | 'csv';
}

const initialState: ReportsState = {
  financial: {
    data: [],
    summary: null,
  },
  
  planFact: {
    data: [],
    summary: null,
  },
  
  unitEconomics: {
    data: [],
    current: null,
  },
  
  metrics: {
    data: [],
    selectedMetrics: ['revenue', 'orders', 'conversion'],
  },
  
  heatmap: {
    data: [],
    config: {
      metric: 'orders',
      granularity: 'hour',
    },
  },
  
  loading: {
    financial: false,
    planFact: false,
    unitEconomics: false,
    metrics: false,
    heatmap: false,
  },
  
  error: null,
  
  filters: {
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    period: 'month',
    categories: [],
    groupBy: 'day',
  },
  
  exporting: false,
  exportFormat: 'pdf',
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Финансовый отчёт
    setFinancialReport(state, action: PayloadAction<FinancialReportData[]>) {
      state.financial.data = action.payload;
    },
    
    setFinancialSummary(state, action: PayloadAction<ReportsState['financial']['summary']>) {
      state.financial.summary = action.payload;
    },
    
    // План-факт
    setPlanFact(state, action: PayloadAction<PlanFactData[]>) {
      state.planFact.data = action.payload;
    },
    
    setPlanFactSummary(state, action: PayloadAction<ReportsState['planFact']['summary']>) {
      state.planFact.summary = action.payload;
    },
    
    // Юнит-экономика
    setUnitEconomics(state, action: PayloadAction<UnitEconomicsData[]>) {
      state.unitEconomics.data = action.payload;
      if (action.payload.length > 0) {
        state.unitEconomics.current = action.payload[action.payload.length - 1];
      }
    },
    
    setCurrentUnitEconomics(state, action: PayloadAction<UnitEconomicsData>) {
      state.unitEconomics.current = action.payload;
    },
    
    // Метрики
    setMetrics(state, action: PayloadAction<MetricsData[]>) {
      state.metrics.data = action.payload;
    },
    
    setSelectedMetrics(state, action: PayloadAction<string[]>) {
      state.metrics.selectedMetrics = action.payload;
    },
    
    toggleMetric(state, action: PayloadAction<string>) {
      const metric = action.payload;
      const index = state.metrics.selectedMetrics.indexOf(metric);
      if (index > -1) {
        state.metrics.selectedMetrics.splice(index, 1);
      } else {
        state.metrics.selectedMetrics.push(metric);
      }
    },
    
    // Heatmap
    setHeatmap(state, action: PayloadAction<HeatmapData[]>) {
      state.heatmap.data = action.payload;
    },
    
    setHeatmapConfig(state, action: PayloadAction<Partial<ReportsState['heatmap']['config']>>) {
      state.heatmap.config = { ...state.heatmap.config, ...action.payload };
    },
    
    // Фильтры
    setFilters(state, action: PayloadAction<Partial<ReportsState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    setDateRange(state, action: PayloadAction<{ start: string; end: string }>) {
      state.filters.dateRange = action.payload;
    },
    
    setPeriod(state, action: PayloadAction<ReportsState['filters']['period']>) {
      state.filters.period = action.payload;
    },
    
    setCategories(state, action: PayloadAction<string[]>) {
      state.filters.categories = action.payload;
    },
    
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    
    // Загрузка
    setLoading(state, action: PayloadAction<{ type: keyof ReportsState['loading']; value: boolean }>) {
      state.loading[action.payload.type] = action.payload.value;
      if (action.payload.value) {
        state.error = null;
      }
    },
    
    setAllLoading(state, action: PayloadAction<boolean>) {
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof ReportsState['loading']] = action.payload;
      });
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof ReportsState['loading']] = false;
      });
    },
    
    clearError(state) {
      state.error = null;
    },
    
    // Экспорт
    setExporting(state, action: PayloadAction<boolean>) {
      state.exporting = action.payload;
    },
    
    setExportFormat(state, action: PayloadAction<ReportsState['exportFormat']>) {
      state.exportFormat = action.payload;
    },
    
    // Сброс
    resetReportsState() {
      return initialState;
    },
  },
});

export const {
  setFinancialReport,
  setFinancialSummary,
  setPlanFact,
  setPlanFactSummary,
  setUnitEconomics,
  setCurrentUnitEconomics,
  setMetrics,
  setSelectedMetrics,
  toggleMetric,
  setHeatmap,
  setHeatmapConfig,
  setFilters,
  setDateRange,
  setPeriod,
  setCategories,
  resetFilters,
  setLoading,
  setAllLoading,
  setError,
  clearError,
  setExporting,
  setExportFormat,
  resetReportsState,
} = reportsSlice.actions;

export default reportsSlice.reducer;

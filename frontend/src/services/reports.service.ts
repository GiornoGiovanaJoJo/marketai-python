import api from './api';

// Типы для отчётов
interface DateRange {
  start: string;
  end: string;
}

interface ReportFilters {
  dateRange?: DateRange;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  categories?: string[];
  groupBy?: 'day' | 'week' | 'month';
}

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
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  churnRate: number;
  arpu: number;
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

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  filters?: ReportFilters;
}

// API методы
export const reportsService = {
  // Финансовый отчёт
  async getFinancialReport(filters?: ReportFilters): Promise<FinancialReportData[]> {
    const response = await api.get('/api/reports/financial', { params: filters });
    return response.data;
  },

  async getFinancialSummary(filters?: ReportFilters): Promise<any> {
    const response = await api.get('/api/reports/financial/summary', { params: filters });
    return response.data;
  },

  // План-факт
  async getPlanFact(filters?: ReportFilters): Promise<PlanFactData[]> {
    const response = await api.get('/api/reports/plan-fact', { params: filters });
    return response.data;
  },

  async getPlanFactSummary(filters?: ReportFilters): Promise<any> {
    const response = await api.get('/api/reports/plan-fact/summary', { params: filters });
    return response.data;
  },

  // Юнит-экономика
  async getUnitEconomics(filters?: ReportFilters): Promise<UnitEconomicsData[]> {
    const response = await api.get('/api/reports/unit-economics', { params: filters });
    return response.data;
  },

  async getCurrentUnitEconomics(): Promise<UnitEconomicsData> {
    const response = await api.get('/api/reports/unit-economics/current');
    return response.data;
  },

  // Метрики
  async getMetrics(metrics: string[], filters?: ReportFilters): Promise<MetricsData[]> {
    const response = await api.get('/api/reports/metrics', {
      params: { ...filters, metrics: metrics.join(',') },
    });
    return response.data;
  },

  // Heatmap
  async getHeatmap(metric: string, filters?: ReportFilters): Promise<HeatmapData[]> {
    const response = await api.get('/api/reports/heatmap', {
      params: { ...filters, metric },
    });
    return response.data;
  },

  // Экспорт отчётов
  async exportFinancialReport(options: ExportOptions): Promise<Blob> {
    const response = await api.post(
      '/api/reports/financial/export',
      options,
      { responseType: 'blob' }
    );
    return response.data;
  },

  async exportPlanFact(options: ExportOptions): Promise<Blob> {
    const response = await api.post(
      '/api/reports/plan-fact/export',
      options,
      { responseType: 'blob' }
    );
    return response.data;
  },

  async exportUnitEconomics(options: ExportOptions): Promise<Blob> {
    const response = await api.post(
      '/api/reports/unit-economics/export',
      options,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Сравнение периодов
  async comparePeriods(
    period1: DateRange,
    period2: DateRange,
    metrics: string[]
  ): Promise<any> {
    const response = await api.post('/api/reports/compare', {
      period1,
      period2,
      metrics,
    });
    return response.data;
  },

  // Получить доступные метрики
  async getAvailableMetrics(): Promise<string[]> {
    const response = await api.get('/api/reports/metrics/available');
    return response.data;
  },
};

export default reportsService;

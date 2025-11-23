import api from './api';

// Типы для OPI
interface OPIMetric {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  updatedAt: string;
}

interface OPIFilters {
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  categories?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// API методы
export const opiService = {
  // Получить все метрики
  async getMetrics(filters?: OPIFilters): Promise<OPIMetric[]> {
    const response = await api.get('/api/opi/metrics', { params: filters });
    return response.data;
  },

  // Получить конкретную метрику
  async getMetric(id: string): Promise<OPIMetric> {
    const response = await api.get(`/api/opi/metrics/${id}`);
    return response.data;
  },

  // Обновить метрики (получить свежие данные)
  async refreshMetrics(): Promise<OPIMetric[]> {
    const response = await api.post('/api/opi/metrics/refresh');
    return response.data;
  },

  // Получить доступные категории
  async getCategories(): Promise<string[]> {
    const response = await api.get('/api/opi/categories');
    return response.data;
  },

  // Получить историю метрики
  async getMetricHistory(
    metricId: string,
    filters?: OPIFilters
  ): Promise<Array<{ date: string; value: number }>> {
    const response = await api.get(`/api/opi/metrics/${metricId}/history`, {
      params: filters,
    });
    return response.data;
  },

  // Экспорт dashboard
  async exportDashboard(
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<Blob> {
    const response = await api.post(
      '/api/opi/export',
      { format },
      { responseType: 'blob' }
    );
    return response.data;
  },
};

export default opiService;

import api from '@/lib/api'
import { DashboardStats, FinancialReport } from '@/types/statistics'

class StatisticsService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/statistics/dashboard/')
    return response.data
  }

  async getFinancialReport(params?: {
    start_date?: string
    end_date?: string
  }): Promise<FinancialReport> {
    const response = await api.get<FinancialReport>('/statistics/financial-report/', {
      params,
    })
    return response.data
  }

  async getCampaignPerformance(campaignId: number): Promise<any> {
    const response = await api.get(`/statistics/campaign-performance/${campaignId}/`)
    return response.data
  }
}

export default new StatisticsService()

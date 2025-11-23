import api from '@/lib/api'
import { DashboardStats, FinancialReport } from '@/types/statistics'

/**
 * Statistics Service
 * 
 * Django endpoints:
 * - GET /api/statistics/dashboard/                              - Dashboard stats
 * - GET /api/statistics/financial-report/                       - Financial report
 * - GET /api/statistics/campaigns/{id}/performance/             - Campaign performance
 * - GET /api/statistics/campaigns/{id}/detailed/                - Detailed stats
 * - GET /api/statistics/campaigns/{id}/chart/                   - Chart data
 * - GET /api/statistics/campaigns/{id}/top-products/            - Top products for campaign
 * - GET /api/statistics/top-products/                           - Overall top products
 * 
 * ViewSet endpoints:
 * - GET /api/statistics/campaign-statistics/                    - List campaign statistics
 * - GET /api/statistics/product-statistics/                     - List product statistics
 * - GET /api/statistics/daily-user-statistics/                  - List daily user statistics
 */
class StatisticsService {
  /**
   * Get dashboard statistics
   * Django endpoint: GET /api/statistics/dashboard/
   * Response: { total_campaigns, active_campaigns, total_revenue, ... }
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/statistics/dashboard/')
    return response.data
  }

  /**
   * Get financial report
   * Django endpoint: GET /api/statistics/financial-report/
   * Query params: start_date, end_date (YYYY-MM-DD format)
   * Response: FinancialReport object
   */
  async getFinancialReport(params?: {
    start_date?: string
    end_date?: string
  }): Promise<FinancialReport> {
    const response = await api.get<FinancialReport>('/statistics/financial-report/', {
      params,
    })
    return response.data
  }

  /**
   * Get campaign performance metrics
   * Django endpoint: GET /api/statistics/campaigns/{id}/performance/
   * Response: Performance metrics for specific campaign
   */
  async getCampaignPerformance(
    campaignId: number,
    params?: {
      start_date?: string
      end_date?: string
    }
  ): Promise<any> {
    const response = await api.get(
      `/statistics/campaigns/${campaignId}/performance/`,
      { params }
    )
    return response.data
  }

  /**
   * Get detailed campaign statistics
   * Django endpoint: GET /api/statistics/campaigns/{id}/detailed/
   * Response: Detailed statistics including products, conversions, etc.
   */
  async getCampaignDetailedStats(campaignId: number): Promise<any> {
    const response = await api.get(`/statistics/campaigns/${campaignId}/detailed/`)
    return response.data
  }

  /**
   * Get campaign chart data
   * Django endpoint: GET /api/statistics/campaigns/{id}/chart/
   * Response: Time-series data for charts (views, clicks, conversions over time)
   */
  async getCampaignChartData(
    campaignId: number,
    params?: {
      period?: 'day' | 'week' | 'month'
      start_date?: string
      end_date?: string
    }
  ): Promise<any> {
    const response = await api.get(
      `/statistics/campaigns/${campaignId}/chart/`,
      { params }
    )
    return response.data
  }

  /**
   * Get top products for a campaign
   * Django endpoint: GET /api/statistics/campaigns/{id}/top-products/
   * Response: Array of top performing products in the campaign
   */
  async getCampaignTopProducts(
    campaignId: number,
    params?: {
      limit?: number
      metric?: 'revenue' | 'clicks' | 'conversions'
    }
  ): Promise<any> {
    const response = await api.get(
      `/statistics/campaigns/${campaignId}/top-products/`,
      { params }
    )
    return response.data
  }

  /**
   * Get overall top products
   * Django endpoint: GET /api/statistics/top-products/
   * Response: Array of top performing products across all campaigns
   */
  async getTopProducts(params?: {
    limit?: number
    start_date?: string
    end_date?: string
  }): Promise<any> {
    const response = await api.get('/statistics/top-products/', { params })
    return response.data
  }

  /**
   * Get campaign statistics list (ViewSet)
   * Django endpoint: GET /api/statistics/campaign-statistics/
   * Response: Paginated list of campaign statistics
   */
  async getCampaignStatisticsList(params?: {
    page?: number
    page_size?: number
    campaign?: number
  }): Promise<any> {
    const response = await api.get('/statistics/campaign-statistics/', { params })
    return response.data
  }

  /**
   * Get product statistics list (ViewSet)
   * Django endpoint: GET /api/statistics/product-statistics/
   * Response: Paginated list of product statistics
   */
  async getProductStatisticsList(params?: {
    page?: number
    page_size?: number
    product?: string
  }): Promise<any> {
    const response = await api.get('/statistics/product-statistics/', { params })
    return response.data
  }

  /**
   * Get daily user statistics (ViewSet)
   * Django endpoint: GET /api/statistics/daily-user-statistics/
   * Response: Paginated list of daily user statistics
   */
  async getDailyUserStatistics(params?: {
    page?: number
    page_size?: number
    date?: string
    start_date?: string
    end_date?: string
  }): Promise<any> {
    const response = await api.get('/statistics/daily-user-statistics/', { params })
    return response.data
  }
}

export default new StatisticsService()

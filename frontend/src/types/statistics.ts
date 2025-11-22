export interface DashboardStats {
  total_campaigns: number
  active_campaigns: number
  total_spent: number
  total_revenue: number
  total_orders: number
  average_roi: number
  period_comparison: {
    spent_change: number
    revenue_change: number
    orders_change: number
  }
}

export interface FinancialReport {
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    total_revenue: number
    total_spent: number
    net_profit: number
    roi: number
    margin: number
  }
  by_campaign: Array<{
    campaign_id: number
    campaign_name: string
    revenue: number
    spent: number
    profit: number
    roi: number
  }>
  daily_stats: Array<{
    date: string
    revenue: number
    spent: number
    orders: number
  }>
}

export interface CampaignPerformance {
  campaign_id: number
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    spent: number
    orders: number
    revenue: number
    roi: number
    conversion_rate: number
  }
  daily_data: Array<{
    date: string
    impressions: number
    clicks: number
    spent: number
    orders: number
    revenue: number
  }>
}

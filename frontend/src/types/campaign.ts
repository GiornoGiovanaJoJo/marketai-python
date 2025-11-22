export interface Campaign {
  id: number
  name: string
  type: 'search' | 'catalog' | 'auto'
  status: 'active' | 'paused' | 'completed'
  budget: number
  daily_budget?: number
  start_date: string
  end_date?: string
  
  // Metrics
  impressions?: number
  clicks?: number
  ctr?: number
  spent?: number
  orders?: number
  revenue?: number
  roi?: number
  conversion_rate?: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CampaignCreate {
  name: string
  type: 'search' | 'catalog' | 'auto'
  budget: number
  daily_budget?: number
  start_date: string
  end_date?: string
}

export interface CampaignUpdate {
  name?: string
  status?: 'active' | 'paused' | 'completed'
  budget?: number
  daily_budget?: number
  end_date?: string
}

export interface CampaignStats {
  campaign_id: number
  date: string
  impressions: number
  clicks: number
  spent: number
  orders: number
  revenue: number
}

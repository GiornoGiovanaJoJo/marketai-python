export interface MetricCard {
    id: string
    title: string
    previousValue: number
    currentValue: number
    change: number
    trend: 'up' | 'down'
    unit: string
}

export interface RevenueChartData {
    month: string
    revenue: number
    profit: number
}

export interface CategoryBreakdownRow {
    id: string
    category: string
    feb25_1: number
    feb25_2: number
    total: number
    subcategories?: CategoryBreakdownRow[]
}

export interface FinancialMetric {
    nm_id: number
    sa_name: string
    sales_count: number
    refuses_count: number
    percent_refuses: number
    deliveries_count: number
    refund_count: number
    sold_count: number
    retail_amount: number
    retail_price: number
    spp_amount: number
    total_commission_with_spp: number
    seller_total: number
    delivery_amount: number
    acceptance_amount: number
    penalty_amount: number
    surcharges_amount: number
}

export interface Campaign {
    id: number
    name: string
}

export type DateRange = {
    from?: Date
    to?: Date
}

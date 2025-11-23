import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart'
import type { RevenueChartData } from '@/types/financial.types'

const CHART_DATA: RevenueChartData[] = [
    { month: 'фев 25', revenue: 1.5, profit: 0.5 },
    { month: 'март 25', revenue: 3.2, profit: 1.2 },
    { month: 'май 25', revenue: 6.5, profit: 2.8 },
    { month: 'июнь 25', revenue: 9.0, profit: 4.8 },
    { month: 'октябрь 25', revenue: 7.8, profit: 3.5 },
    { month: 'ноябрь 25', revenue: 11.2, profit: 6.2 },
    { month: 'декабрь 25', revenue: 15.0, profit: 9.5 },
]

const CHART_CONFIG = {
    revenue: {
        label: 'Выручка',
        color: 'rgb(59, 130, 246)',
    },
    profit: {
        label: 'Марж. прибыль',
        color: 'rgb(239, 68, 68)',
    },
}

export function RevenueChart() {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Динамика выручки и прибыли</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={CHART_CONFIG} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                fill={CHART_CONFIG.revenue.color}
                                stroke={CHART_CONFIG.revenue.color}
                                fillOpacity={0.1}
                            />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                fill={CHART_CONFIG.profit.color}
                                stroke={CHART_CONFIG.profit.color}
                                fillOpacity={0.1}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

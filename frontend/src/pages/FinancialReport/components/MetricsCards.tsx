import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MetricCard } from '@/types/financial.types'

const METRIC_CARDS: MetricCard[] = [
    {
        id: 'variable-costs',
        title: 'Переменные расходы',
        previousValue: 12.3,
        currentValue: 24.6,
        change: 50,
        trend: 'up',
        unit: 'млн',
    },
    {
        id: 'marginal-profit',
        title: 'Марж. прибыль',
        previousValue: 5.8,
        currentValue: 2.9,
        change: -37,
        trend: 'down',
        unit: 'млн',
    },
    {
        id: 'revenue',
        title: 'Выручка (Доход)',
        previousValue: 15.8,
        currentValue: 30.4,
        change: 50,
        trend: 'up',
        unit: 'млн',
    },
    {
        id: 'net-profit',
        title: 'Чистая прибыль',
        previousValue: 1.3,
        currentValue: 1.5,
        change: -37,
        trend: 'down',
        unit: 'млн',
    },
]

export function MetricsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {METRIC_CARDS.map((metric) => (
                <Card key={metric.id}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold">
                                {metric.currentValue} {metric.unit}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Было: {metric.previousValue} {metric.unit}
                                </span>
                                <Badge
                                    variant={metric.change > 0 ? 'default' : 'destructive'}
                                    className="flex items-center gap-1"
                                >
                                    {metric.trend === 'up' ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(metric.change)}%
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

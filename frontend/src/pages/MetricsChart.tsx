import { useState, useMemo } from "react"
import { LineChart as LineChartIcon, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Mock данные для метрик с графиками
const metrics = [
  { id: "redemption", label: "Выкуп", color: "rgb(34, 197, 94)", enabled: true },
  { id: "return-amount", label: "Сумма возврата", color: "rgb(239, 68, 68)", enabled: true },
  { id: "expenses", label: "Расходы", color: "rgb(168, 85, 247)", enabled: true },
  { id: "commission", label: "Комиссия", color: "rgb(59, 130, 246)", enabled: true },
  { id: "logistics", label: "Логистика", color: "rgb(234, 179, 8)", enabled: true },
  { id: "advertising", label: "Расходы РК", color: "rgb(236, 72, 153)", enabled: true },
  { id: "avg-check", label: "Средний чек", color: "rgb(20, 184, 166)", enabled: true },
  { id: "returns-count", label: "Кол-во возвратов", color: "rgb(251, 146, 60)", enabled: true },
  { id: "total-pay", label: "Итого к оплате", color: "rgb(139, 92, 246)", enabled: true },
  { id: "cost-price", label: "Себестоимость", color: "rgb(14, 165, 233)", enabled: true },
  { id: "storage", label: "Хранение", color: "rgb(245, 158, 11)", enabled: true },
  { id: "taxes", label: "Налоги", color: "rgb(220, 38, 127)", enabled: true },
  { id: "orders", label: "Заказы", color: "rgb(96, 165, 250)", enabled: true },
  { id: "margin", label: "Маржа", color: "rgb(34, 197, 94)", enabled: true },
  { id: "revenue", label: "Выручка", color: "rgb(168, 85, 247)", enabled: true },
]

// Mock данные для графика (6 недель)
const generateChartData = () => {
  const weeks = ["Нед. 1", "Нед. 2", "Нед. 3", "Нед. 4", "Нед. 5", "Нед. 6"]
  const data: Array<Record<string, number | string>> = []
  
  weeks.forEach((week, weekIndex) => {
    const weekData: Record<string, number | string> = { week }
    metrics.forEach((metric) => {
      const baseValue = 8000000 + weekIndex * 500000
      const variation = (Math.random() - 0.5) * 2000000
      weekData[metric.id] = Math.max(0, baseValue + variation)
    })
    data.push(weekData)
  })
  
  return { weeks, data }
}

// Конфигурация графика
const chartConfig: Record<string, { label: string; color: string }> = {}
metrics.forEach((metric) => {
  chartConfig[metric.id] = {
    label: metric.label,
    color: metric.color,
  }
})

export function MetricsChart() {
  const { toast } = useToast()
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(
    new Set(metrics.map((m) => m.id))
  )
  const { weeks, data: allChartData } = generateChartData()
  
  // Фильтруем данные для выбранных метрик
  const chartData = useMemo(() => {
    return allChartData.map((weekData) => {
      const filtered: Record<string, number | string> = { week: weekData.week }
      metrics.forEach((metric) => {
        if (enabledMetrics.has(metric.id)) {
          filtered[metric.id] = weekData[metric.id] as number
        }
      })
      return filtered
    })
  }, [allChartData, enabledMetrics])

  const toggleMetric = (metricId: string) => {
    setEnabledMetrics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(metricId)) {
        newSet.delete(metricId)
      } else {
        newSet.add(metricId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    setEnabledMetrics(new Set(metrics.map((m) => m.id)))
    toast({
      title: "Все метрики выбраны",
      description: "Все метрики добавлены на график",
      variant: "success",
    })
  }

  const deselectAll = () => {
    setEnabledMetrics(new Set())
    toast({
      title: "Метрики сняты",
      description: "Все метрики удалены с графика",
      variant: "default",
    })
  }

  const getEnabledMetricsData = () => {
    return metrics.filter((m) => enabledMetrics.has(m.id))
  }

  const enabledMetricsList = getEnabledMetricsData()
  
  // Фильтруем конфигурацию для выбранных метрик
  const filteredChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    enabledMetricsList.forEach((metric) => {
      config[metric.id] = chartConfig[metric.id]
    })
    return config
  }, [enabledMetricsList])

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок */}
        <div className="space-y-2 mt-12 md:mt-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <LineChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">График метрик</h1>
          </div>
        </div>

        {/* Чекбоксы метрик */}
        <Card className="glass-effect">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={enabledMetrics.has(metric.id)}
                    onCheckedChange={() => toggleMetric(metric.id)}
                    style={{
                      backgroundColor: enabledMetrics.has(metric.id)
                        ? metric.color
                        : undefined,
                    }}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    {metric.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Кнопки управления */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={selectAll}
            variant="default"
            className="gap-2 bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm sm:text-base">Добавить все</span>
          </Button>
          <Button
            onClick={deselectAll}
            variant="destructive"
            className="gap-2 w-full sm:w-auto"
          >
            <X className="h-4 w-4" />
            <span className="text-sm sm:text-base">Удалить все</span>
          </Button>
        </div>

        {/* График */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>График метрик</CardTitle>
          </CardHeader>
          <CardContent>
            {enabledMetricsList.length > 0 ? (
              <ChartContainer config={filteredChartConfig} className="h-[400px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}М`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <ChartLegend content={<ChartLegendContent payload={[]} />} />
                  {enabledMetricsList.map((metric) => (
                    <Line
                      key={metric.id}
                      type="monotone"
                      dataKey={metric.id}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={{ fill: metric.color, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Выберите метрики для отображения на графике
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


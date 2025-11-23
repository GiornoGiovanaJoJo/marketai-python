import { useState, useMemo } from "react"
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { FilterPanel, FilterConfig } from "@/components/FilterPanel"
import { BlockVisibilityManager, PageBlock } from "@/components/BlockVisibilityManager"
import { usePageBlocks } from "@/hooks/usePageBlocks"
import { usePageContainer } from "@/hooks/usePageContainer"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Mock данные для больших карточек
const mainMetrics = [
  {
    id: "orders",
    title: "Заказы",
    actualRub: 33416470,
    targetRub: 30000000,
    planRub: 39973630,
    targetPlanRub: 35000000,
    quantity: 20790,
    targetQuantity: 18000,
    forecast: 83.6,
    targetForecast: 80,
    color: "bg-purple-500",
    chartColor: "rgb(168, 85, 247)",
  },
  {
    id: "sales",
    title: "Продажи",
    actualRub: 30344978,
    targetRub: 28000000,
    planRub: 36516741,
    targetPlanRub: 32000000,
    quantity: 19570,
    targetQuantity: 17000,
    forecast: 83.1,
    targetForecast: 78,
    color: "bg-blue-400",
    chartColor: "rgb(96, 165, 250)",
  },
  {
    id: "margin",
    title: "Маржинальная прибыль",
    actualRub: 5902973,
    targetRub: 5000000,
    planRub: 8044688,
    targetPlanRub: 7000000,
    marginPercent: 19,
    targetMarginPercent: 18,
    forecast: 73.4,
    targetForecast: 70,
    color: "bg-green-400",
    chartColor: "rgb(74, 222, 128)",
  },
]

// Mock данные для маленьких карточек
const smallMetrics = [
  { id: "redemption", label: "% Выкупа", value: 94, unit: "%", change: 2.5, changeType: "positive" },
  { id: "return-amount", label: "Сумма возврат", value: 429155, unit: "₽", change: -5.2, changeType: "negative" },
  { id: "penalties", label: "Штрафы", value: 24476538, unit: "₽", change: 12.3, changeType: "negative" },
  { id: "commission", label: "Комиссия", value: 4068842, unit: "₽", change: 3.1, changeType: "negative" },
  { id: "logistics", label: "Логистика", value: 1458842, unit: "₽", change: -2.8, changeType: "positive" },
  {
    id: "advertising",
    label: "Расходы РК",
    value: 8068842,
    unit: "₽",
    change: 8.5,
    changeType: "negative",
  },
  { id: "avg-check", label: "Средний чек", value: 6691, unit: "₽", change: 4.2, changeType: "positive" },
  { id: "returns-count", label: "Кол-во возвратов", value: 193, unit: "", change: -10.5, changeType: "positive" },
  { id: "total-pay", label: "Итого к оплате", value: 121, unit: "₽", change: 15.3, changeType: "positive" },
  { id: "cost-price", label: "Себестоимость", value: 12220465, unit: "₽", change: 6.7, changeType: "negative" },
  { id: "storage", label: "Хранение", value: 123123, unit: "₽", change: -1.2, changeType: "positive" },
  { id: "taxes", label: "Налоги", value: 9123123, unit: "₽", change: 0, changeType: "neutral" },
]

// Mock данные для фильтров
const markets = ["Все", "Wildberries", "Ozon", "Яндекс.Маркет"]
const cabinets = ["Все", "Кабинет 1", "Кабинет 2", "Кабинет 3"]
const brands = ["Все", "Бренд A", "Бренд B", "Бренд C"]
const categories = ["Все", "Электроника", "Одежда", "Бытовая техника"]
const articles = ["Все", "Артикул 001", "Артикул 002", "Артикул 003"]
const bundles = ["Все", "Связка 1", "Связка 2", "Связка 3"]

// Mock данные для метрик с графиками
const chartMetrics = [
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

// Генерация данных для графика
const generateChartData = () => {
  const weeks = ["Нед. 1", "Нед. 2", "Нед. 3", "Нед. 4", "Нед. 5", "Нед. 6"]
  const data: Array<Record<string, number | string>> = []
  
  weeks.forEach((week, weekIndex) => {
    const weekData: Record<string, number | string> = { week }
    chartMetrics.forEach((metric) => {
      const baseValue = 8000000 + weekIndex * 500000
      const variation = (Math.random() - 0.5) * 2000000
      weekData[metric.id] = Math.max(0, baseValue + variation)
    })
    data.push(weekData)
  })
  
  return data
}

// Конфигурация графика
const chartConfig: Record<string, { label: string; color: string }> = {}
chartMetrics.forEach((metric) => {
  chartConfig[metric.id] = {
    label: metric.label,
    color: metric.color,
  }
})

export function OPIDashboard() {
  const { toast } = useToast()
  const { containerClassName } = usePageContainer()
  const [excelDownloaded, setExcelDownloaded] = useState(false)
  const [filters, setFilters] = useState<FilterConfig>({})
  const [enabledChartMetrics, setEnabledChartMetrics] = useState<Set<string>>(
    new Set(chartMetrics.map((m) => m.id))
  )
  const chartData = useMemo(() => generateChartData(), [])

  // Определяем блоки страницы - каждый блок отдельно
  const pageBlocks: PageBlock[] = [
    // Основные метрики
    ...mainMetrics.map((metric) => ({
      id: `main-metric-${metric.id}`,
      title: metric.title,
      description: `Основная метрика: ${metric.title}`,
    })),
    // Дополнительные метрики
    ...smallMetrics.map((metric) => ({
      id: `small-metric-${metric.id}`,
      title: metric.label,
      description: `Дополнительная метрика: ${metric.label}`,
    })),
  ]

  // Используем хук для управления видимостью блоков
  const { isBlockVisible, setVisibleBlocks } = usePageBlocks(pageBlocks, {
    storageKey: "opi-dashboard-blocks",
    defaultVisible: pageBlocks.map((b) => b.id),
  })

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
    toast({
      title: "Фильтры применены",
      description: "Данные обновлены согласно выбранным фильтрам",
    })
  }

  const handleDownloadExcel = () => {
    setExcelDownloaded(true)
    setTimeout(() => setExcelDownloaded(false), 3000)
    toast({
      title: "Экспорт завершён",
      description: "Файл Excel успешно сгенерирован и готов к скачиванию",
      variant: "success",
    })
  }

  const handleGetInvestments = () => {
    toast({
      title: "Инвестиции доступны",
      description: "Ваш бизнес подходит для получения инвестиций. Ожидайте предложения.",
      variant: "default",
    })
  }


  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  // Функции для управления графиком
  const toggleChartMetric = (metricId: string) => {
    setEnabledChartMetrics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(metricId)) {
        newSet.delete(metricId)
      } else {
        newSet.add(metricId)
      }
      return newSet
    })
  }

  const selectAllChartMetrics = () => {
    setEnabledChartMetrics(new Set(chartMetrics.map((m) => m.id)))
    toast({
      title: "Все метрики выбраны",
      description: "Все метрики добавлены на график",
      variant: "success",
    })
  }

  const deselectAllChartMetrics = () => {
    setEnabledChartMetrics(new Set())
    toast({
      title: "Метрики сняты",
      description: "Все метрики удалены с графика",
      variant: "default",
    })
  }

  const enabledChartMetricsList = chartMetrics.filter((m) => enabledChartMetrics.has(m.id))
  
  // Фильтруем данные для выбранных метрик
  const filteredChartData = useMemo(() => {
    return chartData.map((weekData) => {
      const filtered: Record<string, number | string> = { week: weekData.week }
      chartMetrics.forEach((metric) => {
        if (enabledChartMetrics.has(metric.id)) {
          filtered[metric.id] = weekData[metric.id] as number
        }
      })
      return filtered
    })
  }, [chartData, enabledChartMetrics])

  // Фильтруем конфигурацию для выбранных метрик
  const filteredChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    enabledChartMetricsList.forEach((metric) => {
      config[metric.id] = chartConfig[metric.id]
    })
    return config
  }, [enabledChartMetricsList])

  return (
    <div className="min-h-screen p-4 sm:p-8 w-full">
      <div className={cn(containerClassName, "space-y-6")}>
        {/* Заголовок */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                ОПИУ · Dashboard
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              {/* Кнопки действий */}
              <div className="flex gap-2">
                <FilterPanel
                  onFilterChange={handleFilterChange}
                  availableFilters={{
                    markets: markets.slice(1), // Убираем "Все"
                    cabinets: cabinets.slice(1),
                    brands: brands.slice(1),
                    categories: categories.slice(1),
                    articles: articles.slice(1),
                    bundles: bundles.slice(1),
                  }}
                />
                <BlockVisibilityManager
                  blocks={pageBlocks}
                  storageKey="opi-dashboard-blocks"
                  onVisibilityChange={(visibleIds) => {
                    setVisibleBlocks(visibleIds)
                    toast({
                      title: "Настройки применены",
                      description: `Отображается блоков: ${visibleIds.length} из ${pageBlocks.length}`,
                    })
                  }}
                />
                <Button
                  onClick={handleDownloadExcel}
                  variant="default"
                  size="sm"
                  className="gap-1.5 glow-effect"
                  disabled={excelDownloaded}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {excelDownloaded ? "Готово" : "Скачать Excel"}
                  </span>
                </Button>
                <Button
                  onClick={handleGetInvestments}
                  variant="default"
                  size="sm"
                  className="gap-1.5 glow-effect"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs">Получите инвестиции</span>
                </Button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Аналитика и метрики продаж на маркетплейсах
          </p>
        </div>


        {/* Большие карточки метрик */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold gradient-text">Основные метрики</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mainMetrics.map((metric) => {
              if (!isBlockVisible(`main-metric-${metric.id}`)) return null
              
              const actualPercent =
                (metric.actualRub / metric.targetRub) * 100
              const planPercent = (metric.planRub / metric.targetPlanRub) * 100
              const quantityPercent =
                metric.quantity && metric.targetQuantity
                  ? (metric.quantity / metric.targetQuantity) * 100
                  : 0

              return (
              <Card
                key={metric.id}
                className="glass-effect opi-dashboard-card"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 relative">
                    {/* Левая колонка */}
                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Факт, руб.
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">
                            {formatNumber(metric.actualRub)}
                          </span>
                          {actualPercent >= 100 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Цель: {formatNumber(metric.targetRub)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          План, руб.
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">
                            {formatNumber(metric.planRub)}
                          </span>
                          {planPercent >= 100 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Цель: {formatNumber(metric.targetPlanRub)}
                        </div>
                      </div>
                    </div>

                    {/* Правая колонка */}
                    <div className="space-y-2">
                      {metric.quantity !== undefined ? (
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">
                            Кол-во
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">
                              {formatNumber(metric.quantity)}
                            </span>
                            {quantityPercent >= 100 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Цель: {formatNumber(metric.targetQuantity)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">
                            % маржи
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">
                              {metric.marginPercent}%
                            </span>
                            {metric.marginPercent >= metric.targetMarginPercent ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Цель: {metric.targetMarginPercent}%
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-0.5">
                          Прогноз
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold">
                            {metric.forecast.toFixed(1)}%
                          </span>
                          {metric.forecast >= metric.targetForecast ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Цель: {metric.targetForecast}%
                        </div>
                      </div>
                    </div>

                    {/* Компактный индикатор прогноза справа вверху */}
                    <div className="absolute top-0 right-0 z-10">
                      <div className="relative w-11 h-11 flex items-center justify-center">
                        <svg 
                          width="44" 
                          height="44" 
                          className="transform -rotate-90"
                          style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                          <circle
                            cx="22"
                            cy="22"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-muted/20"
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="20"
                            stroke={metric.chartColor}
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - metric.forecast / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <span 
                          className="text-[10px] font-bold relative z-10" 
                          style={{ color: metric.chartColor }}
                        >
                          {metric.forecast.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        </div>

        {/* Сетка маленьких карточек */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold gradient-text">Дополнительные метрики</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
          </div>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {smallMetrics.map((metric) => {
              if (!isBlockVisible(`small-metric-${metric.id}`)) return null
              
              const changeValue = metric.change || 0
              const changeType = metric.changeType || "neutral"
              const isPositive = changeType === "positive"
              const isNegative = changeType === "negative"
              const showChange = changeValue !== 0

              return (
              <Card
                key={metric.id}
                className="glass-effect opi-small-metric-card"
              >
                <CardContent className="p-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-muted-foreground">
                      {metric.label}
                    </div>
                    <div className="text-lg font-bold">
                      {formatNumber(metric.value)}
                      {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                    </div>
                    {showChange && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {changeValue > 0 ? (
                          <TrendingUp className={`h-2.5 w-2.5 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                        ) : changeValue < 0 ? (
                          <TrendingDown className={`h-2.5 w-2.5 ${isPositive ? "text-red-500" : "text-green-500"}`} />
                        ) : null}
                        <span
                          className={`text-[10px] font-medium ${
                            (changeValue > 0 && isPositive) || (changeValue < 0 && !isPositive)
                              ? "text-green-500"
                              : (changeValue > 0 && !isPositive) || (changeValue < 0 && isPositive)
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {changeValue > 0 ? "+" : ""}
                          {changeValue.toFixed(1)}% за период
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        </div>

        {/* График метрик */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold gradient-text">График метрик</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
          </div>

          {/* Чекбоксы метрик */}
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {chartMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={enabledChartMetrics.has(metric.id)}
                      onCheckedChange={() => toggleChartMetric(metric.id)}
                      style={{
                        backgroundColor: enabledChartMetrics.has(metric.id)
                          ? metric.color
                          : undefined,
                      }}
                    />
                    <label className="text-xs font-medium cursor-pointer">
                      {metric.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Кнопки управления */}
          <div className="flex gap-2">
            <Button
              onClick={selectAllChartMetrics}
              variant="default"
              size="sm"
              className="gap-1.5 bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span className="text-xs">Добавить все</span>
            </Button>
            <Button
              onClick={deselectAllChartMetrics}
              variant="destructive"
              size="sm"
              className="gap-1.5"
            >
              <X className="h-3 w-3" />
              <span className="text-xs">Удалить все</span>
            </Button>
          </div>

          {/* График */}
          <Card className="glass-effect">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">График метрик</CardTitle>
            </CardHeader>
            <CardContent>
              {enabledChartMetricsList.length > 0 ? (
                <ChartContainer config={filteredChartConfig} className="h-[400px]">
                  <LineChart data={filteredChartData}>
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
                    {enabledChartMetricsList.map((metric) => (
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
                <div className="h-[400px] flex items-center justify-center text-muted-foreground text-sm">
                  Выберите метрики для отображения на графике
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


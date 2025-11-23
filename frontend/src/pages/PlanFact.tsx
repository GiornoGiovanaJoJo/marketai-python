import React, { useState, useMemo } from "react"
import { BarChart3, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterPanel, FilterConfig } from "@/components/FilterPanel"
import { BlockVisibilityManager, PageBlock } from "@/components/BlockVisibilityManager"
import { usePageBlocks } from "@/hooks/usePageBlocks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Mock данные для фильтров
const categories = ["Все категории", "Электроника", "Одежда", "Бытовая техника"]
const managers = ["Все", "Менеджер 1", "Менеджер 2", "Менеджер 3"]

// Mock данные для графика нарастающего итога
const cumulativeChartData = [
  { date: "сен 07", marginProfit: 0.5, planMargin: 0.3 },
  { date: "сен 14", marginProfit: 1.2, planMargin: 0.9 },
  { date: "сен 21", marginProfit: 2.1, planMargin: 1.8 },
  { date: "сен 28", marginProfit: 3.2, planMargin: 2.9 },
]

// Конфигурация для графика нарастающего итога
const cumulativeChartConfig = {
  marginProfit: {
    label: "Марж. прибыль НИ",
    color: "rgb(59, 130, 246)",
  },
  planMargin: {
    label: "План маржа НИ",
    color: "rgb(236, 72, 153)",
  },
}

// Mock данные для графика динамики
const dynamicsChartData = [
  { date: "сен 07", margin: 1.5, orders: 850, sales: 720 },
  { date: "сен 10", margin: 2.8, orders: 1200, sales: 1050 },
  { date: "сен 14", margin: 3.0, orders: 1450, sales: 1280 },
  { date: "сен 18", margin: 1.0, orders: 900, sales: 800 },
  { date: "сен 21", margin: 2.0, orders: 1100, sales: 950 },
  { date: "сен 24", margin: 1.8, orders: 1000, sales: 880 },
  { date: "сен 28", margin: 1.75, orders: 980, sales: 860 },
]

// Конфигурация для графика динамики
const dynamicsChartConfig = {
  margin: {
    label: "Маржа",
    color: "rgb(59, 130, 246)",
  },
  orders: {
    label: "Заказы",
    color: "rgb(59, 130, 246)",
  },
  sales: {
    label: "Продажи",
    color: "rgb(59, 130, 246)",
  },
}

// Mock данные для таблицы
const tableData = [
  {
    id: "79",
    category: "Категория_79",
    marginFact: 1154641,
    marginPlan: 297060,
    marginPercent: 389,
    marginRate: 23,
    ordersFact: 2278,
    ordersPlan: 945,
    ordersPercent: 241.1,
    salesFact: 1909,
    salesPlan: 1014,
    salesPercent: 188.3,
    buyoutPercent: 93,
  },
  {
    id: "84",
    category: "Категория_84",
    marginFact: 842567,
    marginPlan: 415020,
    marginPercent: 203,
    marginRate: 21,
    ordersFact: 1890,
    ordersPlan: 1105,
    ordersPercent: 171.1,
    salesFact: 1620,
    salesPlan: 985,
    salesPercent: 164.5,
    buyoutPercent: 92,
  },
  {
    id: "91",
    category: "Категория_91",
    marginFact: 623456,
    marginPlan: 462080,
    marginPercent: 135,
    marginRate: 19,
    ordersFact: 1432,
    ordersPlan: 505,
    ordersPercent: 283.3,
    salesFact: 1280,
    salesPlan: 450,
    salesPercent: 284.4,
    buyoutPercent: 89,
  },
  {
    id: "105",
    category: "Категория_105",
    marginFact: 456789,
    marginPlan: 171780,
    marginPercent: 266,
    marginRate: 22,
    ordersFact: 1024,
    ordersPlan: 456,
    ordersPercent: 224.6,
    salesFact: 890,
    salesPlan: 398,
    salesPercent: 223.6,
    buyoutPercent: 87,
  },
  {
    id: "112",
    category: "Категория_112",
    marginFact: 389456,
    marginPlan: 52620,
    marginPercent: 740,
    marginRate: 25,
    ordersFact: 567,
    ordersPlan: 267,
    ordersPercent: 212.5,
    salesFact: 485,
    salesPlan: 234,
    salesPercent: 207.3,
    buyoutPercent: 85,
  },
  {
    id: "128",
    category: "Категория_128",
    marginFact: 345678,
    marginPlan: 173640,
    marginPercent: 199,
    marginRate: 20,
    ordersFact: 890,
    ordersPlan: 454,
    ordersPercent: 196,
    salesFact: 780,
    salesPlan: 398,
    salesPercent: 195.9,
    buyoutPercent: 88,
  },
  {
    id: "141",
    category: "Категория_141",
    marginFact: 234567,
    marginPlan: 892560,
    marginPercent: 26.3,
    marginRate: 19,
    ordersFact: 165,
    ordersPlan: 1137,
    ordersPercent: 14.5,
    salesFact: 121,
    salesPlan: 1297,
    salesPercent: 9.3,
    buyoutPercent: 90,
  },
]

export function PlanFact() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<FilterConfig>({})
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [activeDynamicsTab, setActiveDynamicsTab] = useState("margin")

  // Определяем блоки страницы - каждый блок отдельно
  const pageBlocks: PageBlock[] = [
    { id: "charts-block", title: "Графики и аналитика", description: "Графики динамики и нарастающего итога" },
    { id: "dynamics-chart", title: "График динамики", description: "График динамики маржи/заказов/продаж" },
    { id: "cumulative-chart", title: "Нарастающий итог", description: "График нарастающего итога за месяц" },
    { id: "metrics-block", title: "Блок метрик", description: "Метрики заказов и маржи" },
    { id: "orders-metric", title: "Метрика заказов", description: "План и факт заказов" },
    { id: "margin-metric", title: "Метрика маржи", description: "План и факт маржи" },
    { id: "categories-table", title: "Таблица категорий", description: "Детализация по категориям" },
  ]

  // Используем хук для управления видимостью блоков
  const { isBlockVisible, setVisibleBlocks } = usePageBlocks(pageBlocks, {
    storageKey: "plan-fact-blocks",
    defaultVisible: pageBlocks.map((b) => b.id),
  })

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
    toast({
      title: "Фильтры применены",
      description: "Данные обновлены согласно выбранным фильтрам",
    })
  }

  const toggleRow = (rowId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId)
    } else {
      newExpanded.add(rowId)
    }
    setExpandedRows(newExpanded)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  // Метрики
  const planOrders = 7892
  const factOrders = 9361
  const ordersFulfillment = (factOrders / planOrders) * 100

  const planMargin = 1871642
  const factMargin = 3243837
  const marginFulfillment = (factMargin / planMargin) * 100

  // Получаем конфигурацию для графика динамики в зависимости от выбранной вкладки
  const getDynamicsConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    const key = activeDynamicsTab
    if (dynamicsChartConfig[key as keyof typeof dynamicsChartConfig]) {
      config[key] = dynamicsChartConfig[key as keyof typeof dynamicsChartConfig]
    }
    return config
  }, [activeDynamicsTab])

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок */}
        <div className="space-y-2 mt-12 md:mt-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
                План-Факт • MarketAI
              </h1>
            </div>
            <div className="flex gap-2">
              <FilterPanel
                onFilterChange={handleFilterChange}
                availableFilters={{
                  categories: categories.slice(1),
                }}
              />
              <BlockVisibilityManager
                blocks={pageBlocks}
                storageKey="plan-fact-blocks"
                onVisibilityChange={setVisibleBlocks}
              />
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Аналитика выполнения плана по заказам и марже
          </p>
        </div>


        {/* Графики слева и справа */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* График динамики */}
          {isBlockVisible("dynamics-chart") && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Динамика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeDynamicsTab} onValueChange={setActiveDynamicsTab}>
                  <TabsList className="w-auto">
                    <TabsTrigger value="margin">Маржа</TabsTrigger>
                    <TabsTrigger value="orders">Заказы</TabsTrigger>
                    <TabsTrigger value="sales">Продажи</TabsTrigger>
                  </TabsList>
                </Tabs>
                <ChartContainer config={getDynamicsConfig} className="h-[300px]">
                  <AreaChart data={dynamicsChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        if (activeDynamicsTab === "margin") {
                          return `${value.toFixed(1)}`
                        }
                        return `${value}`
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      type="monotone"
                      dataKey={activeDynamicsTab}
                      stroke="rgb(59, 130, 246)"
                      fill="rgb(59, 130, 246)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ fill: "rgb(59, 130, 246)", r: 4 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* График нарастающего итога */}
          {isBlockVisible("cumulative-chart") && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Нарастающий итог за месяц</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Легенда */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs sm:text-sm">Марж. прибыль НИ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-xs sm:text-sm">План маржа НИ</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    НИ — нарастающий итог
                  </div>
                </div>
                <ChartContainer config={cumulativeChartConfig} className="h-[300px]">
                  <AreaChart data={cumulativeChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value.toFixed(1)}`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                      <ChartLegend content={<ChartLegendContent payload={[]} />} />
                    <Area
                      type="monotone"
                      dataKey="marginProfit"
                      stroke="rgb(59, 130, 246)"
                      fill="rgb(59, 130, 246)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ fill: "rgb(59, 130, 246)", r: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="planMargin"
                      stroke="rgb(236, 72, 153)"
                      fill="rgb(236, 72, 153)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      dot={{ fill: "rgb(236, 72, 153)", r: 4 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Блок метрик под графиками */}
        {isBlockVisible("metrics-block") && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Метрики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Блок 1: Заказы */}
                {isBlockVisible("orders-metric") && (
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-4">
                        {/* Слева: План и факт */}
                        <div className="space-y-3 flex-1">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">План заказы</div>
                            <div className="text-lg sm:text-xl font-bold">{formatNumber(planOrders)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Факт заказы</div>
                            <div className="text-lg sm:text-xl font-bold">{formatNumber(factOrders)}</div>
                          </div>
                        </div>
                        {/* Справа: Процент и круговой график */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-xs text-muted-foreground">Выполнение</div>
                          <div className="text-2xl sm:text-3xl font-bold text-green-500">
                            {ordersFulfillment.toFixed(1)}%
                          </div>
                          <div className="relative">
                            <ChartContainer
                              config={{
                                fulfillment: {
                                  label: "Выполнение",
                                  color: "hsl(var(--chart-1))",
                                },
                              }}
                              className="h-[100px] w-[100px]"
                            >
                              <PieChart>
                                <Pie
                                  data={[
                                    {
                                      name: "Выполнено",
                                      value: Math.min(ordersFulfillment, 100),
                                      fill: "#22c55e",
                                    },
                                    {
                                      name: "Осталось",
                                      value: Math.max(0, 100 - Math.min(ordersFulfillment, 100)),
                                      fill: "#e5e7eb",
                                    },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={28}
                                  outerRadius={42}
                                  startAngle={90}
                                  endAngle={-270}
                                  dataKey="value"
                                >
                                  <Cell key="cell-0" fill="#22c55e" />
                                  <Cell key="cell-1" fill="#e5e7eb" />
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                              </PieChart>
                            </ChartContainer>
                            {ordersFulfillment > 100 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-xs font-semibold text-green-500">+{(ordersFulfillment - 100).toFixed(1)}%</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Блок 2: Маржа */}
                {isBlockVisible("margin-metric") && (
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Маржа</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-4">
                        {/* Слева: План и факт */}
                        <div className="space-y-3 flex-1">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">План маржа</div>
                            <div className="text-lg sm:text-xl font-bold">{formatNumber(planMargin)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Марж. прибыль</div>
                            <div className="text-lg sm:text-xl font-bold">{formatNumber(factMargin)}</div>
                          </div>
                        </div>
                        {/* Справа: Процент и круговой график */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-xs text-muted-foreground">Выполнение</div>
                          <div className="text-2xl sm:text-3xl font-bold text-purple-500">
                            {marginFulfillment.toFixed(1)}%
                          </div>
                          <div className="relative">
                            <ChartContainer
                              config={{
                                fulfillment: {
                                  label: "Выполнение",
                                  color: "hsl(var(--chart-2))",
                                },
                              }}
                              className="h-[100px] w-[100px]"
                            >
                              <PieChart>
                                <Pie
                                  data={[
                                    {
                                      name: "Выполнено",
                                      value: Math.min(marginFulfillment, 100),
                                      fill: "#a855f7",
                                    },
                                    {
                                      name: "Осталось",
                                      value: Math.max(0, 100 - Math.min(marginFulfillment, 100)),
                                      fill: "#e5e7eb",
                                    },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={28}
                                  outerRadius={42}
                                  startAngle={90}
                                  endAngle={-270}
                                  dataKey="value"
                                >
                                  <Cell key="cell-0" fill="#a855f7" />
                                  <Cell key="cell-1" fill="#e5e7eb" />
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                              </PieChart>
                            </ChartContainer>
                            {marginFulfillment > 100 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-xs font-semibold text-purple-500">+{(marginFulfillment - 100).toFixed(1)}%</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Таблица */}
        {isBlockVisible("categories-table") && (
          <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Детализация по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Предмет / Артикул</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20 border-l-2 border-l-green-500">МАРЖА факт</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20">план</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20">% выполнения</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20">% маржи</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-blue-50/30 dark:bg-blue-950/20 border-l-2 border-l-blue-500">ЗАКАЗЫ факт</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-blue-50/30 dark:bg-blue-950/20">план</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-blue-50/30 dark:bg-blue-950/20">% выполнения</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20 border-l-2 border-l-purple-500">ПРОДАЖИ факт</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20">план</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20">% выполнения</TableHead>
                    <TableHead className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20">% выкупа</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => {
                    const isExpanded = expandedRows.has(row.id)
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => toggleRow(row.id)}
                        >
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <ChevronRight
                                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                              />
                              {row.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20 border-l-2 border-l-green-500">
                            {formatNumber(row.marginFact)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20">
                            {formatNumber(row.marginPlan)}
                          </TableCell>
                          <TableCell
                            className={`text-xs sm:text-sm font-semibold bg-green-50/30 dark:bg-green-950/20 ${
                              row.marginPercent >= 100
                                ? "text-green-500"
                                : row.marginPercent < 50
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {row.marginPercent.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-green-50/30 dark:bg-green-950/20">
                            {row.marginRate}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-blue-50/30 dark:bg-blue-950/20 border-l-2 border-l-blue-500">
                            {formatNumber(row.ordersFact)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-blue-50/30 dark:bg-blue-950/20">
                            {formatNumber(row.ordersPlan)}
                          </TableCell>
                          <TableCell
                            className={`text-xs sm:text-sm font-semibold bg-blue-50/30 dark:bg-blue-950/20 ${
                              row.ordersPercent >= 100
                                ? "text-green-500"
                                : row.ordersPercent < 50
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {row.ordersPercent.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20 border-l-2 border-l-purple-500">
                            {formatNumber(row.salesFact)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20">
                            {formatNumber(row.salesPlan)}
                          </TableCell>
                          <TableCell
                            className={`text-xs sm:text-sm font-semibold bg-purple-50/30 dark:bg-purple-950/20 ${
                              row.salesPercent >= 100
                                ? "text-green-500"
                                : row.salesPercent < 50
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {row.salesPercent.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm bg-purple-50/30 dark:bg-purple-950/20">
                            {row.buyoutPercent}%
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={12} className="bg-muted/30">
                              <div className="p-4 text-sm">
                                <p className="text-muted-foreground">
                                  Детальная информация по {row.category}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
              Скролл по горизонтали внутри таблицы. Клик по строке раскроет детали.
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}


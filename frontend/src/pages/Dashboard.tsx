import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Eye,
  BarChart3,
  Wallet,
  Boxes,
  BellRing,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FilterPanel, FilterConfig } from "@/components/FilterPanel"
import { BlockVisibilityManager, PageBlock } from "@/components/BlockVisibilityManager"
import { usePageBlocks } from "@/hooks/usePageBlocks"
import { usePageContainer } from "@/hooks/usePageContainer"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock данные для метрик
const metrics = [
  {
    id: "sales",
    title: "Продажи",
    value: "2 450 000 ₽",
    change: "+12.5%",
    trend: "up",
    period: "за месяц",
    icon: DollarSign,
    week: "+4.2%",
    month: "+12.5%",
  },
  {
    id: "orders",
    title: "Заказы",
    value: "1 234",
    change: "+8.2%",
    trend: "up",
    period: "за месяц",
    icon: ShoppingCart,
    week: "+2.7%",
    month: "+8.2%",
  },
  {
    id: "products",
    title: "Товаров в продаже",
    value: "567",
    change: "+23",
    trend: "up",
    period: "новых",
    icon: Package,
    week: "+6",
    month: "+23",
  },
  {
    id: "views",
    title: "Просмотры",
    value: "45 678",
    change: "-3.1%",
    trend: "down",
    period: "за неделю",
    icon: Eye,
    week: "-3.1%",
    month: "-1.8%",
  },
  {
    id: "conversion",
    title: "Конверсия",
    value: "3.2%",
    change: "+0.5%",
    trend: "up",
    period: "рост",
    icon: BarChart3,
    week: "+0.2%",
    month: "+0.5%",
  },
  {
    id: "customers",
    title: "Покупатели",
    value: "8 901",
    change: "+156",
    trend: "up",
    period: "новых",
    icon: Users,
    week: "+54",
    month: "+156",
  },
]

// Mock данные для графиков продаж по маркетплейсам
const marketplaceStats = [
  { name: "Wildberries", sales: 1200000, orders: 567, color: "bg-blue-500" },
  { name: "Ozon", sales: 890000, orders: 423, color: "bg-green-500" },
  { name: "Яндекс.Маркет", sales: 360000, orders: 244, color: "bg-yellow-500" },
]

// Mock данные для топ товаров
const topProducts = [
  { name: "Смартфон Galaxy Pro", sales: 245000, orders: 123, rating: 4.8 },
  { name: "Наушники Wireless", sales: 189000, orders: 89, rating: 4.6 },
  { name: "Планшет Tablet X", sales: 156000, orders: 67, rating: 4.7 },
  { name: "Часы Smart Watch", sales: 134000, orders: 56, rating: 4.5 },
  { name: "Портативная колонка", sales: 98000, orders: 45, rating: 4.4 },
]

export function Dashboard() {
  const { containerClassName } = usePageContainer()
  const [filters, setFilters] = useState<FilterConfig>({})

  // Список действий, требующих внимания
  const ctaActions = [
    {
      id: "budget",
      title: "Добавьте бюджет",
      description: "Реклама WB на 72% израсходовала лимит. Пополните бюджет, чтобы не потерять трафик.",
      button: "Открыть кампании",
      icon: Wallet,
    },
    {
      id: "stock",
      title: "Пополните склад",
      description: "5 топовых SKU по Ozon закончатся через 3 дня. Резервируйте поставку сейчас.",
      button: "Запланировать поставку",
      icon: Boxes,
    },
    {
      id: "alerts",
      title: "Проверьте алерты",
      description: "Новое отклонение карточек на Яндексе. Разберите причину и запустите заново.",
      button: "Перейти к алертам",
      icon: BellRing,
    },
  ]

  // Данные для сводного блока изменений
  const risingMetrics = metrics.filter((metric) => metric.trend === "up")
  const fallingMetrics = metrics.filter((metric) => metric.trend === "down")

  // Определяем блоки страницы - каждый блок отдельно
  const pageBlocks: PageBlock[] = [
    // Метрики
    ...metrics.map((metric) => ({
      id: `metric-${metric.id}`,
      title: metric.title,
      description: `Метрика: ${metric.title}`,
    })),
    // Продажи по маркетплейсам
    { id: "marketplace-stats", title: "Продажи по маркетплейсам", description: "Распределение продаж" },
    // Топ товаров
    { id: "top-products", title: "Топ товаров", description: "Самые продаваемые товары" },
    // Динамика продаж
    { id: "sales-chart", title: "Динамика продаж", description: "График продаж за период" },
  ]

  // Используем хук для управления видимостью блоков
  const { isBlockVisible, setVisibleBlocks } = usePageBlocks(pageBlocks, {
    storageKey: "dashboard-blocks",
    defaultVisible: pageBlocks.map((b) => b.id),
  })

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 w-full">
      <div className={cn(containerClassName)}>
        {/* Заголовок */}
        <div className="space-y-2 mt-12 md:mt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">Дашборд</h1>
            </div>
            <div className="flex gap-2">
              <FilterPanel
                onFilterChange={handleFilterChange}
                availableFilters={{
                  markets: ["Wildberries", "Ozon", "Яндекс.Маркет"],
                }}
              />
              <BlockVisibilityManager
                blocks={pageBlocks}
                storageKey="dashboard-blocks"
                onVisibilityChange={setVisibleBlocks}
              />
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Аналитика продаж товаров на маркетплейсах
          </p>
        </div>

        {/* Блок «Что выросло / Что просело» */}
        <div className="grid gap-4 lg:grid-cols-2 mt-6">
          {[{ title: "Что выросло", data: risingMetrics }, { title: "Что просело", data: fallingMetrics }].map(
            ({ title, data }) => (
              <Card key={title} className="glass-effect h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary">{data.length} показателя</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Нет показателей для отображения.</p>
                  ) : (
                    data.slice(0, 3).map((metric) => {
                      const isUp = metric.trend === "up"
                      return (
                        <div
                          key={metric.id}
                          className="p-3 rounded-lg border border-border/40 flex items-center justify-between hover:bg-accent/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{metric.title}</p>
                              <span className="text-xs text-muted-foreground">За последние 7 дней: {metric.week}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-sm font-semibold", isUp ? "text-emerald-500" : "text-rose-500")}>
                              {metric.change}
                            </p>
                            <span className="text-xs text-muted-foreground block">{metric.period}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* CTA блок с действиями */}
        <Card className="glass-effect mt-6 border border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Что сделать прямо сейчас</CardTitle>
            <CardDescription>Подборка приоритетных шагов по данным интеграций</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {ctaActions.map((action) => {
                const Icon = action.icon
                return (
                  <div
                    key={action.id}
                    className="p-4 rounded-xl border border-border/40 bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        </div>
                        <Button size="sm" variant="outline" className="w-full justify-center">
                          {action.button}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Тренды за 7/30 дней */}
        <Card className="glass-effect mt-6">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Тренды 7/30 дней</CardTitle>
              <CardDescription>Быстрый срез по ключевым показателям</CardDescription>
            </div>
            <Badge variant="outline">Обновлено 15 минут назад</Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="7d" className="w-full">
              <TabsList className="grid grid-cols-2 md:w-auto md:inline-flex">
                <TabsTrigger value="7d">За 7 дней</TabsTrigger>
                <TabsTrigger value="30d">За 30 дней</TabsTrigger>
              </TabsList>
              <TabsContent value="7d" className="mt-4 space-y-3">
                {metrics.map((metric) => {
                  const isPositive = !metric.week.toString().startsWith("-")
                  return (
                    <div
                      key={`week-${metric.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{metric.title}</span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isPositive ? "text-emerald-500" : "text-rose-500"
                        )}
                      >
                        {metric.week}
                      </span>
                    </div>
                  )
                })}
              </TabsContent>
              <TabsContent value="30d" className="mt-4 space-y-3">
                {metrics.map((metric) => {
                  const isPositive = !metric.month.toString().startsWith("-")
                  return (
                    <div
                      key={`month-${metric.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3"
                    >
                      <span className="text-sm font-medium">{metric.title}</span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isPositive ? "text-emerald-500" : "text-rose-500"
                        )}
                      >
                        {metric.month}
                      </span>
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Метрики */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            if (!isBlockVisible(`metric-${metric.id}`)) return null
            
            const Icon = metric.icon
            const isUp = metric.trend === "up"
            return (
              <Card key={metric.id} className="glass-effect dashboard-metric-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="flex items-center gap-2 text-xs">
                    {isUp ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={isUp ? "text-green-500" : "text-red-500"}
                    >
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground">
                      {metric.period}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Продажи по маркетплейсам */}
          {isBlockVisible("marketplace-stats") && (
            <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Продажи по маркетплейсам</CardTitle>
              <CardDescription>
                Распределение продаж за текущий месяц
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketplaceStats.map((marketplace) => {
                const percentage = Math.round(
                  (marketplace.sales /
                    marketplaceStats.reduce(
                      (sum, m) => sum + m.sales,
                      0
                    )) *
                    100
                )
                return (
                  <div key={marketplace.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{marketplace.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {marketplace.orders} заказов
                        </span>
                        <Badge variant="secondary">
                          {marketplace.sales.toLocaleString()} ₽
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${marketplace.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage}% от общих продаж
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          )}

          {/* Топ товаров */}
          {isBlockVisible("top-products") && (
            <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Топ товаров</CardTitle>
              <CardDescription>
                Самые продаваемые товары за период
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{product.orders} заказов</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            ⭐ {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {product.sales.toLocaleString()} ₽
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* График динамики продаж */}
        {isBlockVisible("sales-chart") && (
          <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Динамика продаж</CardTitle>
            <CardDescription>
              Продажи за последние 30 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.random() * 80 + 20
                const isWeekend = i % 7 === 0 || i % 7 === 6
                return (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-all duration-300 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {Math.round((height / 100) * 2450000)} ₽
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>30 дней назад</span>
              <span>Сегодня</span>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}

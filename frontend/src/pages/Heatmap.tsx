import { useState, useMemo } from "react"
import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { format } from "date-fns"

// Mock данные для фильтров
const marketplaces = ["Все", "Wildberries", "Ozon", "Яндекс.Маркет"]
const sources = ["Все", "Источник 1", "Источник 2"]
const categories = ["Все", "Категория 1", "Категория 2", "Категория 3"]
const articles = ["Все", "Артикул 1", "Артикул 2", "Артикул 3"]
const regions = ["Все", "Регион 1", "Регион 2", "Регион 3"]
const brands = ["Все", "Бренд 1", "Бренд 2", "Бренд 3"]

// Генерация данных для тепловой карты (24 часа × 7 дней)
const generateHeatmapData = () => {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00-${i.toString().padStart(2, '0')}:59`,
    hourIndex: i,
  }))

  const data: Record<string, number>[] = hours.map((h) => {
      const row: Record<string, number> = {
          hour: Number(h.hour),
          hourIndex: h.hourIndex
      };
    let total = 0

    days.forEach((day) => {
      // Генерируем реалистичные данные с пиками в дневное время
      let value = 0
      if (h.hourIndex >= 8 && h.hourIndex <= 20) {
        // Дневное время - больше заказов
        value = Math.floor(Math.random() * 150) + 50
      } else if (h.hourIndex >= 21 || h.hourIndex <= 7) {
        // Ночное время - меньше заказов
        value = Math.floor(Math.random() * 80) + 20
      }
      row[day] = value
      total += value
    })

    row["Итого"] = total
    return row
  })

  return { days, hours, data }
}

// Mock данные для таблицы артикулов
const articleBreakdown = [
  {
    id: "1",
    category: "Категория_51",
    ordersCount: 4567,
    ordersRub: 1234567,
    percentOfTotal: 20.5,
    avgPerDay: 152,
    avgCheck: 270,
  },
  {
    id: "2",
    category: "Категория_79",
    ordersCount: 3890,
    ordersRub: 1089234,
    percentOfTotal: 17.2,
    avgPerDay: 130,
    avgCheck: 280,
  },
  {
    id: "3",
    category: "Категория_84",
    ordersCount: 3245,
    ordersRub: 987654,
    percentOfTotal: 14.3,
    avgPerDay: 108,
    avgCheck: 304,
  },
  {
    id: "4",
    category: "Категория_91",
    ordersCount: 2890,
    ordersRub: 876543,
    percentOfTotal: 12.8,
    avgPerDay: 96,
    avgCheck: 303,
  },
  {
    id: "5",
    category: "Категория_105",
    ordersCount: 2456,
    ordersRub: 765432,
    percentOfTotal: 10.9,
    avgPerDay: 82,
    avgCheck: 312,
  },
  {
    id: "6",
    category: "Категория_112",
    ordersCount: 2123,
    ordersRub: 654321,
    percentOfTotal: 9.4,
    avgPerDay: 71,
    avgCheck: 308,
  },
  {
    id: "7",
    category: "Категория_128",
    ordersCount: 1890,
    ordersRub: 543210,
    percentOfTotal: 8.4,
    avgPerDay: 63,
    avgCheck: 287,
  },
]

// Mock данные для графика динамики заказов
const generateOrderDynamicsData = (period: "days" | "weeks" | "months") => {
  const data = []
  let labels: string[] = []

  if (period === "days") {
    labels = Array.from({ length: 14 }, (_, i) => `День ${i + 1}`)
    labels.forEach((_, index) => {
      data.push({
        date: labels[index],
        orders: Math.floor(Math.random() * 400) + 500,
      })
    })
  } else if (period === "weeks") {
    labels = Array.from({ length: 8 }, (_, i) => `Неделя ${i + 1}`)
    labels.forEach((_, index) => {
      data.push({
        date: labels[index],
        orders: Math.floor(Math.random() * 500) + 600,
      })
    })
  } else {
    labels = Array.from({ length: 6 }, (_, i) => `Месяц ${i + 1}`)
    labels.forEach((_, index) => {
      data.push({
        date: labels[index],
        orders: Math.floor(Math.random() * 600) + 700,
      })
    })
  }

  return data
}

// Функция для вычисления интенсивности цвета (от 0 до 1)
const getIntensity = (value: number, min: number, max: number) => {
  if (max === min) return 0.5
  return (value - min) / (max - min)
}

// Функция для получения цвета ячейки тепловой карты
const getHeatmapColor = (intensity: number) => {
  // Градиент от бесцветного (почти белого) к приятно зеленому
  // Минимальное значение - почти белый с легким зеленым оттенком
  const minR = 245
  const minG = 250
  const minB = 245
  
  // Максимальное значение - приятный зеленый (tailwind green-500)
  const maxR = 34
  const maxG = 197
  const maxB = 94

  // Используем квадратичную функцию для более плавного перехода
  const smoothIntensity = intensity * intensity

  const r = Math.floor(minR - (minR - maxR) * smoothIntensity)
  const g = Math.floor(minG - (minG - maxG) * smoothIntensity)
  const b = Math.floor(minB - (minB - maxB) * smoothIntensity)

  return `rgb(${r}, ${g}, ${b})`
}

// Функция для вычисления яркости цвета (для определения контраста текста)
const getLuminance = (r: number, g: number, b: number) => {
  // Формула относительной яркости
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Функция для получения цвета текста на основе яркости фона
const getTextColor = (intensity: number) => {
  // Вычисляем цвет фона для определения яркости
  const minR = 245
  const minG = 250
  const minB = 245
  const maxR = 34
  const maxG = 197
  const maxB = 94
  const smoothIntensity = intensity * intensity
  
  const r = Math.floor(minR - (minR - maxR) * smoothIntensity)
  const g = Math.floor(minG - (minG - maxG) * smoothIntensity)
  const b = Math.floor(minB - (minB - maxB) * smoothIntensity)
  
  // Если яркость фона высокая (светлый фон), используем темный текст
  // Если яркость низкая (темный фон), используем белый текст
  const luminance = getLuminance(r, g, b)
  // Используем более контрастные цвета для лучшей читаемости
  return luminance > 0.5 ? "text-gray-900 dark:text-gray-50" : "text-white"
}

export function Heatmap() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedMarketplace, setSelectedMarketplace] = useState("Wildberries")
  const [selectedSource, setSelectedSource] = useState("Все")
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [selectedArticle, setSelectedArticle] = useState("Все")
  const [selectedRegion, setSelectedRegion] = useState("Все")
  const [selectedBrand, setSelectedBrand] = useState("Все")
  const [chartPeriod, setChartPeriod] = useState<"days" | "weeks" | "months">("days")

  const { days, hours, data: heatmapData } = generateHeatmapData()

  // Вычисляем мин и макс значения для нормализации цветов
  const allValues = useMemo(() => {
    const values: number[] = []
    heatmapData.forEach((row) => {
      days.forEach((day) => {
        if (row[day] !== undefined) {
          values.push(row[day])
        }
      })
    })
    return values
  }, [heatmapData, days])

  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace("₽", "₽")
  }

  const chartData = useMemo(
    () => generateOrderDynamicsData(chartPeriod),
    [chartPeriod]
  )

  const chartConfig = {
    orders: {
      label: "Заказы",
      color: "rgb(168, 85, 247)",
    },
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок и настройки */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 md:mt-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Map className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
              Тепловая карта
            </h1>
          </div>

        </div>

        {/* Фильтры */}
        <Card className="glass-effect">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Период дд-ММ-ГГГГ</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                  placeholder="дд-мм-гггг"
                  className="w-full text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Маркетплейс</label>
                <Select
                  value={selectedMarketplace}
                  onValueChange={setSelectedMarketplace}
                >
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Wildberries" />
                  </SelectTrigger>
                  <SelectContent>
                    {marketplaces.map((mp) => (
                      <SelectItem key={mp} value={mp}>
                        {mp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Источник</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Категория</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Артикул</label>
                <Select value={selectedArticle} onValueChange={setSelectedArticle}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {articles.map((article) => (
                      <SelectItem key={article} value={article}>
                        {article}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Регион / Склад</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Бренд</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Основной контент: две панели */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Левая панель: Тепловая карта */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Тепловая карта заказы по часам x дням
              </CardTitle>
              {/* Легенда для тепловой карты */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Интенсивность:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-6 h-4 rounded"
                      style={{
                        backgroundColor: getHeatmapColor(0),
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{minValue}</span>
                  </div>
                  <div className="flex-1 h-4 rounded overflow-hidden" style={{ width: "100px" }}>
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(to right, ${getHeatmapColor(0)}, ${getHeatmapColor(1)})`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-6 h-4 rounded"
                      style={{
                        backgroundColor: getHeatmapColor(1),
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{maxValue}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-[580px]">
                  <Table className="min-w-[580px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[10px] sm:text-xs font-medium sticky left-0 z-10 bg-card/95 backdrop-blur-sm w-[95px] py-2">
                          Час
                        </TableHead>
                        {days.map((day) => (
                          <TableHead
                            key={day}
                            className="text-[10px] sm:text-xs font-medium text-center w-[60px] py-2"
                            style={{ minWidth: "60px", width: "60px" }}
                          >
                            {day}
                          </TableHead>
                        ))}
                        <TableHead 
                          className="text-[10px] sm:text-xs font-medium text-center w-[60px] py-2"
                          style={{ minWidth: "60px", width: "60px" }}
                        >
                          Итого
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heatmapData.map((row, rowIndex) => {
                        const total = row["Итого"] || 0
                        return (
                          <TableRow key={rowIndex} className="hover:bg-transparent group">
                            <TableCell 
                              className="text-[10px] sm:text-xs font-medium sticky left-0 z-10 bg-card/95 backdrop-blur-sm border-r border-border/50 group-hover:bg-card/98 transition-colors py-1.5 whitespace-nowrap"
                              style={{ width: "95px", minWidth: "95px" }}
                            >
                              {row.hour}
                            </TableCell>
                            {days.map((day) => {
                              const value = row[day] || 0
                              const intensity = getIntensity(value, minValue, maxValue)
                              const bgColor = getHeatmapColor(intensity)
                              const textColor = getTextColor(intensity)

                              return (
                                <TableCell
                                  key={day}
                                  className={`text-[10px] sm:text-xs text-center font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-20 cursor-pointer relative py-1.5 ${textColor}`}
                                  style={{
                                    backgroundColor: bgColor,
                                    minWidth: "60px",
                                    width: "60px",
                                    position: "relative",
                                  }}
                                  title={`${day}: ${value} заказов`}
                                >
                                  <span className="relative z-10">{value}</span>
                                  <div
                                    className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                                    style={{
                                      backgroundColor: "white",
                                    }}
                                  />
                                </TableCell>
                              )
                            })}
                            <TableCell
                              className="text-[10px] sm:text-xs text-center font-bold bg-muted/30 hover:bg-muted/50 transition-colors py-1.5"
                              style={{ minWidth: "60px", width: "60px" }}
                            >
                              {formatNumber(total)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Правая панель: Разбивка по артикулам */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Предмет / артикул разбивка и доля
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Предмет / артикул</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right bg-blue-50/30 dark:bg-blue-950/20 border-l-2 border-l-blue-500">Заказы, шт.</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right bg-blue-50/30 dark:bg-blue-950/20">Заказы, руб.</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right">% от общ.</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right">Средн. в дн.</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right">Средн. чек</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articleBreakdown.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-xs sm:text-sm font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right bg-blue-50/30 dark:bg-blue-950/20 border-l-2 border-l-blue-500">
                          {formatNumber(item.ordersCount)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right bg-blue-50/30 dark:bg-blue-950/20">
                          {formatCurrency(item.ordersRub)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-right min-w-[50px] font-medium">
                              {item.percentOfTotal.toFixed(1)}%
                            </span>
                            <div className="w-24 h-2.5 bg-muted/50 rounded-full overflow-hidden relative">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out shadow-sm hover:shadow-md"
                                style={{
                                  width: `${item.percentOfTotal}%`,
                                  backgroundColor: `rgb(34, 197, 94)`, // Приятный зеленый (green-500)
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right">
                          {formatNumber(item.avgPerDay)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right">
                          {formatCurrency(item.avgCheck)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* График динамики заказов */}
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-base sm:text-lg">
                Динамика кол-ва заказов
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={chartPeriod === "days" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartPeriod("days")}
                  className="text-xs sm:text-sm"
                >
                  Дни
                </Button>
                <Button
                  variant={chartPeriod === "weeks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartPeriod("weeks")}
                  className="text-xs sm:text-sm"
                >
                  Недели
                </Button>
                <Button
                  variant={chartPeriod === "months" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartPeriod("months")}
                  className="text-xs sm:text-sm"
                >
                  Месяцы
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(168, 85, 247)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgb(168, 85, 247)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="rgb(168, 85, 247)"
                  strokeWidth={2}
                  fill="url(#colorOrders)"
                  dot={{ fill: "rgb(168, 85, 247)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


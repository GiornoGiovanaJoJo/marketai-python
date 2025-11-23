import { useState } from "react"
import {
  Search,
  Calculator,
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для карточек метрик
const summaryCards = [
  {
    id: "positions",
    title: "Позиции",
    value: "4",
  },
  {
    id: "recommended",
    title: "Рекомендовано к отгрузке",
    value: "143",
  },
  {
    id: "regions-no-localization",
    title: "Регионов без локализации",
    value: "3",
  },
  {
    id: "pallets",
    title: "Палеты (оценка)",
    value: "0.1",
  },
]

// Mock данные для таблицы
const deliveryData = [
  {
    id: "1",
    sku: "123456",
    name: "Массажёр 22",
    region: "Казань",
    nearestWarehouse: "Казань",
    currentWarehouse: "Каледино",
    salesPerDay: 3.8,
    planDays: 20,
    remainingNearest: 0,
    recommended: 76,
    status: "Нет локализации",
    statusType: "error",
    justification: "3.80×20 – 0 = 76 шт, отгрузка с Каледино",
    selected: false,
  },
  {
    id: "2",
    sku: "123456",
    name: "Массажёр 22",
    region: "Краснодар",
    nearestWarehouse: "Краснодар",
    currentWarehouse: "Каледино",
    salesPerDay: 1.9,
    planDays: 20,
    remainingNearest: 0,
    recommended: 38,
    status: "Нет локализации",
    statusType: "error",
    justification: "1.90×20 – 0 = 38 шт, отгрузка с Каледино",
    selected: false,
  },
  {
    id: "3",
    sku: "123456",
    name: "Массажёр 22",
    region: "Москва",
    nearestWarehouse: "Каледино",
    currentWarehouse: "Каледино",
    salesPerDay: 0.95,
    planDays: 20,
    remainingNearest: 150,
    recommended: 0,
    status: "Норма",
    statusType: "success",
    justification: "0.95×20 – 150 = 0 шт",
    selected: false,
  },
  {
    id: "4",
    sku: "777000",
    name: "Пила зеленая",
    region: "Казань",
    nearestWarehouse: "Казань",
    currentWarehouse: "Каледино",
    salesPerDay: 1.42,
    planDays: 20,
    remainingNearest: 0,
    recommended: 29,
    status: "Нет локализации",
    statusType: "error",
    justification: "1.42×20 – 0 = 29 шт, отгрузка с Каледино",
    selected: true,
  },
]

// Mock данные для локализации
const localizationFromData = [
  {
    id: "1",
    region: "Москва",
    quantity: 7675,
    amount: 17710493,
    percent: 88.6,
    stock: 16231,
    localizationIndex: 44,
  },
  {
    id: "2",
    region: "Татарстан",
    quantity: 663,
    amount: 1084951,
    percent: 5.4,
    stock: 399,
    localizationIndex: 55,
  },
  {
    id: "3",
    region: "Краснодарский",
    quantity: 402,
    amount: 502520,
    percent: 2.5,
    stock: 725,
    localizationIndex: 86,
  },
  {
    id: "4",
    region: "Рязанская",
    quantity: 392,
    amount: 326939,
    percent: 1.6,
    stock: 271,
    localizationIndex: 47,
  },
  {
    id: "5",
    region: "Тульская",
    quantity: 53,
    amount: 105528,
    percent: 0.5,
    stock: 52,
    localizationIndex: 35,
  },
]

const localizationToData = [
  {
    id: "1",
    region: "Московская",
    quantity: 1280,
    amount: 2567537,
    percent: 12.8,
    avgQuantity: 42.7,
    avgCheck: 2006,
  },
  {
    id: "2",
    region: "Москва",
    quantity: 1101,
    amount: 2151758,
    percent: 10.8,
    avgQuantity: 36.7,
    avgCheck: 1954,
  },
  {
    id: "3",
    region: "Краснодарский",
    quantity: 487,
    amount: 1093876,
    percent: 5.5,
    avgQuantity: 16.2,
    avgCheck: 2246,
  },
  {
    id: "4",
    region: "Санкт-Петербург",
    quantity: 419,
    amount: 858305,
    percent: 4.3,
    avgQuantity: 14.0,
    avgCheck: 2048,
  },
  {
    id: "5",
    region: "Ростовская",
    quantity: 322,
    amount: 735652,
    percent: 3.7,
    avgQuantity: 10.7,
    avgCheck: 2285,
  },
]

const articles = [
  { id: "123456", name: "Массажёр 22" },
  { id: "777000", name: "Пила зелёная" },
]

export function PreDelivery() {
  const { toast } = useToast()
  const [darkTheme, setDarkTheme] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("planning")
  const [localizationPlatform, setLocalizationPlatform] = useState("wb")
  const [selectedArticles, setSelectedArticles] = useState<string[]>(["123456", "777000"])
  
  // Уведомления
  const [notificationWarehouses, setNotificationWarehouses] = useState<string[]>(["Каледино", "Казань"])
  const [keepStockAll, setKeepStockAll] = useState("Да")
  const [notificationArticle, setNotificationArticle] = useState("777000")
  const [targetStockDays, setTargetStockDays] = useState("20")
  const [notificationChannel, setNotificationChannel] = useState("Telegram")
  const [notificationFrequency, setNotificationFrequency] = useState("Ежедневно 09:00")

  // Фильтры
  const [turnoverFromDate, setTurnoverFromDate] = useState<Date | undefined>(
    new Date(2025, 9, 29)
  )
  const [turnoverToDate, setTurnoverToDate] = useState<Date | undefined>(
    new Date(2025, 10, 5)
  )
  const [deliveryFromDate, setDeliveryFromDate] = useState<Date | undefined>(
    new Date(2025, 10, 6)
  )
  const [deliveryToDate, setDeliveryToDate] = useState<Date | undefined>(
    new Date(2025, 10, 12)
  )
  const [shipmentDate, setShipmentDate] = useState<Date | undefined>(
    new Date(2025, 10, 8)
  )
  const [warehouseGroup, setWarehouseGroup] = useState("none")
  const [warehouse, setWarehouse] = useState("Каледино")
  const [plannedDays, setPlannedDays] = useState("20")
  const [minRecommendation, setMinRecommendation] = useState("0")
  const [skipDaysWithoutStock, setSkipDaysWithoutStock] = useState(false)
  const [calculateByOrders, setCalculateByOrders] = useState(true)
  const [showOnlyNoLocalization, setShowOnlyNoLocalization] = useState(false)

  const handleCalculateShipment = () => {
    toast({
      title: "Расчёт отгрузки",
      description: "Расчёт отгрузки выполнен успешно",
      variant: "default",
    })
  }

  const handleToggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(deliveryData.map((row) => row.id))
    } else {
      setSelectedRows([])
    }
  }

  const filteredData = deliveryData.filter((row) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        row.sku.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query) ||
        row.region.toLowerCase().includes(query)
      )
    }
    return true
  })

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  const formatCurrency = (num: number) => {
    return `${formatNumber(num)} ₽`
  }

  // Вычисление максимального значения для градиентных баров
  const maxFromQuantity = Math.max(...localizationFromData.map((d) => d.quantity))
  const maxFromAmount = Math.max(...localizationFromData.map((d) => d.amount))
  const maxToQuantity = Math.max(...localizationToData.map((d) => d.quantity))
  const maxToAmount = Math.max(...localizationToData.map((d) => d.amount))

  const handleSaveNotificationRule = () => {
    toast({
      title: "Правило сохранено",
      description: "Правило уведомления успешно сохранено",
      variant: "default",
    })
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и поиск */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Поставки</h1>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по SKU/названию/региону"
                className="pl-10"
              />
            </div>
            <Button onClick={handleCalculateShipment} className="gap-2">
              <Calculator className="h-4 w-4" />
              Рассчитать отгрузку
            </Button>
            <Button
              variant="outline"
              onClick={() => setDarkTheme(!darkTheme)}
              className="gap-2"
            >
              {darkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Тема
            </Button>
          </div>
        </div>

        {/* Карточки метрик */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <Card key={card.id} className="glass-effect">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </div>
                  <div className="text-3xl font-bold">{card.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Табы */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="planning">Планирование</TabsTrigger>
            <TabsTrigger value="localization">Локализация</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="planning" className="space-y-6 mt-6">
            {/* Фильтры и параметры */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Фильтры и параметры
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Период для анализа оборачиваемости */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Период для анализа оборачиваемости от
                    </label>
                    <DatePicker
                      date={turnoverFromDate}
                      onDateChange={setTurnoverFromDate}
                      placeholder="29-10-2025"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      до
                    </label>
                    <DatePicker
                      date={turnoverToDate}
                      onDateChange={setTurnoverToDate}
                      placeholder="05-11-2025"
                      className="w-full"
                    />
                  </div>

                  {/* Планируемые даты поставки */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Планируемые даты поставки — от
                    </label>
                    <DatePicker
                      date={deliveryFromDate}
                      onDateChange={setDeliveryFromDate}
                      placeholder="06-11-2025"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      до
                    </label>
                    <DatePicker
                      date={deliveryToDate}
                      onDateChange={setDeliveryToDate}
                      placeholder="12-11-2025"
                      className="w-full"
                    />
                  </div>

                  {/* Дата отгрузки */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Дата отгрузки
                    </label>
                    <DatePicker
                      date={shipmentDate}
                      onDateChange={setShipmentDate}
                      placeholder="08-11-2025"
                      className="w-full"
                    />
                  </div>

                  {/* Группа складов */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Группа складов
                    </label>
                    <Select value={warehouseGroup} onValueChange={setWarehouseGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="- не выбрано -" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">- не выбрано -</SelectItem>
                        <SelectItem value="group1">Группа 1</SelectItem>
                        <SelectItem value="group2">Группа 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Склад */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Склад
                    </label>
                    <Select value={warehouse} onValueChange={setWarehouse}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Каледино">Каледино</SelectItem>
                        <SelectItem value="Казань">Казань</SelectItem>
                        <SelectItem value="Краснодар">Краснодар</SelectItem>
                        <SelectItem value="Москва">Москва</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Планируемое дней запаса */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Планируемое дней запаса
                    </label>
                    <Input
                      value={plannedDays}
                      onChange={(e) => setPlannedDays(e.target.value)}
                      placeholder="20"
                      type="number"
                    />
                  </div>

                  {/* Минимальная рекомендация */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Минимальная рекомендация, шт
                    </label>
                    <Input
                      value={minRecommendation}
                      onChange={(e) => setMinRecommendation(e.target.value)}
                      placeholder="0"
                      type="number"
                    />
                  </div>
                </div>

                {/* Чекбоксы */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skip-days"
                      checked={skipDaysWithoutStock}
                      onCheckedChange={(v) => setSkipDaysWithoutStock(!!v)}
                    />
                    <label
                      htmlFor="skip-days"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Пропускать дни без остатка
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="calculate-orders"
                      checked={calculateByOrders}
                      onCheckedChange={(v) => setCalculateByOrders(!!v)}
                    />
                    <label
                      htmlFor="calculate-orders"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Делать расчёт по заказам
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-localization"
                      checked={showOnlyNoLocalization}
                      onCheckedChange={(v) => setShowOnlyNoLocalization(!!v)}
                    />
                    <label
                      htmlFor="no-localization"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Показывать только регионы без локализации
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Таблица */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedRows.length === filteredData.length &&
                              filteredData.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Регион</TableHead>
                        <TableHead>Ближайший склад</TableHead>
                        <TableHead>Текущий склад</TableHead>
                        <TableHead className="text-right bg-purple-50/30 dark:bg-purple-950/20 border-l-2 border-l-purple-500">Продажи/день</TableHead>
                        <TableHead className="text-right">План (дн.)</TableHead>
                        <TableHead className="text-right">Остаток ближ.</TableHead>
                        <TableHead className="text-right">Реком., шт</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Обоснование</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row) => (
                        <TableRow
                          key={row.id}
                          className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                            selectedRows.includes(row.id) ? "bg-muted/30" : ""
                          }`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(row.id)}
                              onCheckedChange={() => handleToggleRow(row.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{row.sku}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.region}</TableCell>
                          <TableCell>{row.nearestWarehouse}</TableCell>
                          <TableCell>{row.currentWarehouse}</TableCell>
                          <TableCell className="text-right font-mono bg-purple-50/30 dark:bg-purple-950/20 border-l-2 border-l-purple-500">
                            {row.salesPerDay.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">{row.planDays}</TableCell>
                          <TableCell className="text-right">
                            {row.remainingNearest}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {row.recommended}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.statusType === "error"
                                  ? "destructive"
                                  : row.statusType === "success"
                                  ? "success"
                                  : "default"
                              }
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-md">
                            {row.justification}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Формула */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Рекомендация</strong> = max(0, Продажи/день × ПланДней – Остаток ближайшего склада).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="localization" className="space-y-6 mt-6">
            {/* Фильтр по артикулам и табы площадок */}
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Фильтр по артикулам
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {articles.map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <span className="text-sm">
                            {article.id} — {article.name}
                          </span>
                          <button
                            onClick={() =>
                              setSelectedArticles((prev) =>
                                prev.includes(article.id)
                                  ? prev.filter((id) => id !== article.id)
                                  : [...prev, article.id]
                              )
                            }
                            className="ml-2"
                          >
                            {selectedArticles.includes(article.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Табы площадок */}
                  <Tabs value={localizationPlatform} onValueChange={setLocalizationPlatform}>
                    <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-transparent border-0 p-0 gap-2">
                      <TabsTrigger
                        value="wb"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                      >
                        WB
                      </TabsTrigger>
                      <TabsTrigger
                        value="ozon"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                      >
                        OZON
                      </TabsTrigger>
                      <TabsTrigger
                        value="ym"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                      >
                        YM
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Две таблицы рядом */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Таблица "Откуда заказ" */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Откуда заказ: Регион / Склад
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Регион</TableHead>
                          <TableHead className="text-right">Кол-во</TableHead>
                          <TableHead className="text-right">Сумма, ₽</TableHead>
                          <TableHead className="text-right">% от общ.</TableHead>
                          <TableHead className="text-right">Остатки</TableHead>
                          <TableHead>Индекс локал.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {localizationFromData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">
                              {row.region}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{formatNumber(row.quantity)}</span>
                                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{
                                      width: `${(row.quantity / maxFromQuantity) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{formatCurrency(row.amount)}</span>
                                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{
                                      width: `${(row.amount / maxFromAmount) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {row.percent}%
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(row.stock)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  {row.localizationIndex}%
                                </div>
                                <Progress value={row.localizationIndex} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Таблица "Куда заказ" */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Куда заказ, по регионам
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Регион</TableHead>
                          <TableHead className="text-right">Кол-во</TableHead>
                          <TableHead className="text-right">Сумма, ₽</TableHead>
                          <TableHead className="text-right">% от общ.</TableHead>
                          <TableHead className="text-right">Ср. кол-во</TableHead>
                          <TableHead className="text-right">Средн. чек</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {localizationToData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">
                              {row.region}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{formatNumber(row.quantity)}</span>
                                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{
                                      width: `${(row.quantity / maxToQuantity) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{formatCurrency(row.amount)}</span>
                                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{
                                      width: `${(row.amount / maxToAmount) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {row.percent}%
                            </TableCell>
                            <TableCell className="text-right">
                              {row.avgQuantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(row.avgCheck)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Правила (слева) */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">Правила</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Склады</label>
                    <div className="flex flex-wrap gap-2">
                      {["Каледино", "Казань", "Краснодар", "Москва"].map(
                        (warehouse) => (
                          <div
                            key={warehouse}
                            className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background"
                          >
                            <Checkbox
                              checked={notificationWarehouses.includes(warehouse)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNotificationWarehouses((prev) => [
                                    ...prev,
                                    warehouse,
                                  ])
                                } else {
                                  setNotificationWarehouses((prev) =>
                                    prev.filter((w) => w !== warehouse)
                                  )
                                }
                              }}
                            />
                            <span className="text-sm">{warehouse}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Держать наличие на всех выбранных
                    </label>
                    <Select value={keepStockAll} onValueChange={setKeepStockAll}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Да">Да</SelectItem>
                        <SelectItem value="Нет">Нет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Артикул для контроля
                    </label>
                    <Select
                      value={notificationArticle}
                      onValueChange={setNotificationArticle}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {articles.map((article) => (
                          <SelectItem key={article.id} value={article.id}>
                            {article.id} — {article.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Целевой запас, дни
                    </label>
                    <Input
                      type="number"
                      value={targetStockDays}
                      onChange={(e) => setTargetStockDays(e.target.value)}
                      placeholder="20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Канал</label>
                    <Select
                      value={notificationChannel}
                      onValueChange={setNotificationChannel}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Telegram">Telegram</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Частота</label>
                    <Select
                      value={notificationFrequency}
                      onValueChange={setNotificationFrequency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ежедневно 09:00">
                          Ежедневно 09:00
                        </SelectItem>
                        <SelectItem value="Ежедневно 18:00">
                          Ежедневно 18:00
                        </SelectItem>
                        <SelectItem value="Еженедельно">Еженедельно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSaveNotificationRule}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                  >
                    Сохранить правило
                  </Button>
                </CardContent>
              </Card>

              {/* Предпросмотр (справа) */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">Предпросмотр</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notificationWarehouses.map((warehouse) => (
                    <Card key={warehouse} className="glass-effect">
                      <CardContent className="p-4">
                        <p className="text-sm">
                          {notificationArticle} — {warehouse} — Нарушение: запас
                          0.0 дн &lt; {targetStockDays} дн
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


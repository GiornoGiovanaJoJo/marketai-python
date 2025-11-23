import React, { useState } from "react"
import {
  BarChart3,
  Upload,
  Download,
  RotateCcw,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterPanel, FilterConfig } from "@/components/FilterPanel"
import { BlockVisibilityManager, PageBlock } from "@/components/BlockVisibilityManager"
import { usePageBlocks } from "@/hooks/usePageBlocks"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для фильтров
const categories = ["Все категории", "Электроника", "Одежда", "Бытовая техника"]
const warehouses = ["Все склады", "Склад 1", "Склад 2", "Склад 3"]

// Mock данные для таблицы
const tableData = [
  {
    id: "619",
    product: "Артикул_619",
    marginProfit: 330219,
    marginPercent: 32.6,
    revenue: 1014484,
    redemptions: 409,
    compensations: 0,
    cost: 386044,
    costPercent: 38.0,
    commission: 142028,
    commissionPercent: 14.0,
    logistics: 39484,
    logisticsPercent: 3.9,
    storage: 3044,
    storagePercent: 0.3,
    advertisingH: 0,
    marginH: 330219,
    marginHPercent: 32.6,
    deltaToFact: 0,
  },
  {
    id: "561",
    product: "Артикул_561",
    marginProfit: 245678,
    marginPercent: 28.5,
    revenue: 862456,
    redemptions: 345,
    compensations: 0,
    cost: 345678,
    costPercent: 40.1,
    commission: 120744,
    commissionPercent: 14.0,
    logistics: 34567,
    logisticsPercent: 4.0,
    storage: 2589,
    storagePercent: 0.3,
    advertisingH: 0,
    marginH: 245678,
    marginHPercent: 28.5,
    deltaToFact: 0,
  },
  {
    id: "621",
    product: "Артикул_621",
    marginProfit: 412345,
    marginPercent: 35.2,
    revenue: 1168567,
    redemptions: 487,
    compensations: 0,
    cost: 453456,
    costPercent: 38.8,
    commission: 163599,
    commissionPercent: 14.0,
    logistics: 46789,
    logisticsPercent: 4.0,
    storage: 3501,
    storagePercent: 0.3,
    advertisingH: 0,
    marginH: 412345,
    marginHPercent: 35.2,
    deltaToFact: 0,
  },
]

export function UnitEconomics() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<FilterConfig>({})
  // Переключатель: суммарные показатели (false) / показатели на единицу (true)
  const [isPerUnit, setIsPerUnit] = useState(false)
  // Переключатель: абсолютные (false) / доли (true)
  const [isShares, setIsShares] = useState(false)
  const [activeHypothesis, setActiveHypothesis] = useState<"h1" | "h2">("h1")

  // Определяем блоки страницы - каждый блок отдельно
  const pageBlocks: PageBlock[] = [
    { id: "switches", title: "Переключатели", description: "Переключатели режимов отображения" },
    { id: "hypothesis-h1", title: "Гипотеза 1", description: "Параметры гипотезы 1" },
    { id: "hypothesis-h2", title: "Гипотеза 2", description: "Параметры гипотезы 2" },
    { id: "products-table", title: "Таблица товаров", description: "Детализация по товарам" },
  ]

  // Используем хук для управления видимостью блоков
  const { isBlockVisible, setVisibleBlocks } = usePageBlocks(pageBlocks, {
    storageKey: "unit-economics-blocks",
    defaultVisible: pageBlocks.map((b) => b.id),
  })

  const handleFilterChange = (newFilters: FilterConfig) => {
    setFilters(newFilters)
    toast({
      title: "Фильтры применены",
      description: "Данные обновлены согласно выбранным фильтрам",
    })
  }

  // Параметры гипотез
  const [h1Params, setH1Params] = useState({
    costDelta: "0",
    commission: "",
    logistics: "",
    adShare: "0",
  })
  const [h2Params, setH2Params] = useState({
    costDelta: "0",
    commission: "",
    logistics: "",
    adShare: "0",
  })

  const handleHypothesisSwitch = (hypothesis: "h1" | "h2") => {
    setActiveHypothesis(hypothesis)
    toast({
      title: `Переключено на ${hypothesis === "h1" ? "Гипотезу 1" : "Гипотезу 2"}`,
      description: `Активна ${hypothesis === "h1" ? "Гипотеза 1" : "Гипотеза 2"}`,
    })
  }

  const handleResetHypotheses = () => {
    setH1Params({ costDelta: "0", commission: "", logistics: "", adShare: "0" })
    setH2Params({ costDelta: "0", commission: "", logistics: "", adShare: "0" })
    toast({
      title: "Гипотезы сброшены",
      description: "Все параметры гипотез сброшены к значениям по умолчанию",
    })
  }

  const handleApplyHypothesis = (hypothesis: "h1" | "h2") => {
    const params = hypothesis === "h1" ? h1Params : h2Params
    toast({
      title: `Гипотеза ${hypothesis === "h1" ? "1" : "2"} применена`,
      description: "Параметры применены к данным",
    })
  }

  const handleUpdateHypothesis = (hypothesis: "h1" | "h2") => {
    const params = hypothesis === "h1" ? h1Params : h2Params
    toast({
      title: `Гипотеза ${hypothesis === "h1" ? "1" : "2"} обновлена`,
      description: "Данные обновлены согласно параметрам",
    })
  }

  const handleImportCSV = () => {
    toast({
      title: "Импорт CSV",
      description: "Функция импорта CSV будет реализована",
    })
  }

  const handleExportCSV = () => {
    toast({
      title: "Экспорт CSV",
      description: "Данные экспортированы в CSV",
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  // Расчет значения в зависимости от переключателей
  const calculateValue = (absoluteValue: number, percentValue: number, redemptions: number) => {
    let value = absoluteValue
    
    // Если выбраны показатели на единицу, делим на количество выкупов
    if (isPerUnit && redemptions > 0) {
      value = absoluteValue / redemptions
    }
    
    // Если выбраны доли, используем процентное значение
    if (isShares) {
      value = percentValue
    }
    
    return value
  }

  // Форматирование значения для отображения
  const formatValue = (absoluteValue: number, percentValue: number, redemptions: number) => {
    const value = calculateValue(absoluteValue, percentValue, redemptions)
    
    if (isShares) {
      return `${value.toFixed(1)}%`
    }
    
    return formatNumber(Math.round(value))
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок с табами */}
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
                Юнит-экономика
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
                storageKey="unit-economics-blocks"
                onVisibilityChange={setVisibleBlocks}
              />
              {/* Кнопки управления гипотезами */}
              <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant={activeHypothesis === "h1" ? "default" : "outline"}
                size="sm"
                onClick={() => handleHypothesisSwitch("h1")}
                className="gap-2 text-xs sm:text-sm"
              >
                Гипотеза 1
              </Button>
              <Button
                variant={activeHypothesis === "h2" ? "default" : "outline"}
                size="sm"
                onClick={() => handleHypothesisSwitch("h2")}
                className="gap-2 text-xs sm:text-sm"
              >
                Гипотеза 2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetHypotheses}
                className="gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Сброс гипотез</span>
              </Button>
              </div>
            </div>
          </div>

          {/* Переключатели */}
          {isBlockVisible("switches") && (
            <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Переключатель: Суммарные показатели / Показатели на единицу */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Суммарные показатели
                  </span>
                  <Switch
                    checked={isPerUnit}
                    onCheckedChange={setIsPerUnit}
                  />
                  <span className="text-sm font-medium">
                    Показатели на единицу
                  </span>
                </div>

                {/* Переключатель: Абсолютные / Доли */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Абсолютные
                  </span>
                  <Switch
                    checked={isShares}
                    onCheckedChange={setIsShares}
                  />
                  <span className="text-sm font-medium">
                    Доли
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Параметры гипотез */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Гипотеза 1 */}
          {isBlockVisible("hypothesis-h1") && (
            <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Параметры — Гипотеза 1
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Δ Себестоимость, %
                </label>
                <Input
                  type="number"
                  value={h1Params.costDelta}
                  onChange={(e) =>
                    setH1Params({ ...h1Params, costDelta: e.target.value })
                  }
                  placeholder="0"
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Комиссия, % от выручки
                </label>
                <Input
                  type="number"
                  value={h1Params.commission}
                  onChange={(e) =>
                    setH1Params({ ...h1Params, commission: e.target.value })
                  }
                  placeholder=""
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Логистика, ₽ за единицу
                </label>
                <Input
                  type="number"
                  value={h1Params.logistics}
                  onChange={(e) =>
                    setH1Params({ ...h1Params, logistics: e.target.value })
                  }
                  placeholder=""
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Доля РК (Ad), % от выручки
                </label>
                <Input
                  type="number"
                  value={h1Params.adShare}
                  onChange={(e) =>
                    setH1Params({ ...h1Params, adShare: e.target.value })
                  }
                  placeholder="0"
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApplyHypothesis("h1")}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Применить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateHypothesis("h1")}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Обновить Н1
                </Button>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Гипотеза 2 */}
          {isBlockVisible("hypothesis-h2") && (
            <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Параметры — Гипотеза 2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Δ Себестоимость, %
                </label>
                <Input
                  type="number"
                  value={h2Params.costDelta}
                  onChange={(e) =>
                    setH2Params({ ...h2Params, costDelta: e.target.value })
                  }
                  placeholder="0"
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Комиссия, % от выручки
                </label>
                <Input
                  type="number"
                  value={h2Params.commission}
                  onChange={(e) =>
                    setH2Params({ ...h2Params, commission: e.target.value })
                  }
                  placeholder=""
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Логистика, ₽ за единицу
                </label>
                <Input
                  type="number"
                  value={h2Params.logistics}
                  onChange={(e) =>
                    setH2Params({ ...h2Params, logistics: e.target.value })
                  }
                  placeholder=""
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">
                  Доля РК (Ad), % от выручки
                </label>
                <Input
                  type="number"
                  value={h2Params.adShare}
                  onChange={(e) =>
                    setH2Params({ ...h2Params, adShare: e.target.value })
                  }
                  placeholder="0"
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApplyHypothesis("h2")}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Применить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpdateHypothesis("h2")}
                  className="flex-1 text-xs sm:text-sm"
                >
                  Обновить Н2
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Таблица */}
        {isBlockVisible("products-table") && (
          <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Детализация по товарам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Товар</TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "% Маржи" : isPerUnit ? "Марж. прибыль на ед." : "Марж. прибыль"}
                    </TableHead>
                    {!isShares && (
                      <TableHead className="text-xs sm:text-sm">% Маржи</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Выручка, %" : isPerUnit ? "Выручка на ед." : "Выручка"}
                    </TableHead>
                    {!isPerUnit && (
                      <TableHead className="text-xs sm:text-sm">Выкупы, шт.</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Компенсации, %" : isPerUnit ? "Компенсации на ед." : "Компенсации"}
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Себ-ть, %" : isPerUnit ? "Себестоим. на ед." : "Себестоим."}
                    </TableHead>
                    {!isShares && (
                      <TableHead className="text-xs sm:text-sm">Себ-ть, %</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Комиссия, %" : isPerUnit ? "Комиссия на ед." : "Комиссия"}
                    </TableHead>
                    {!isShares && (
                      <TableHead className="text-xs sm:text-sm">Комиссия, %</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Логистика, %" : isPerUnit ? "Логистика на ед." : "Логистика"}
                    </TableHead>
                    {!isShares && (
                      <TableHead className="text-xs sm:text-sm">Логистика, %</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Хранение, %" : isPerUnit ? "Хранение на ед." : "Хранение"}
                    </TableHead>
                    {!isShares && (
                      <TableHead className="text-xs sm:text-sm">Хранение, %</TableHead>
                    )}
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Реклама (H*), %" : isPerUnit ? "Реклама (H*) на ед." : "Реклама (H*)"}
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      {isShares ? "Маржа H*, %" : isPerUnit ? "Маржа H* на ед." : "Маржа H*"}
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Δ к факту</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {row.product}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.marginProfit, row.marginPercent, row.redemptions)}
                      </TableCell>
                      {!isShares && (
                        <TableCell className="text-xs sm:text-sm">
                          {row.marginPercent.toFixed(1)}%
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {isShares ? "100.0%" : formatValue(row.revenue, 0, row.redemptions)}
                      </TableCell>
                      {!isPerUnit && (
                        <TableCell className="text-xs sm:text-sm">
                          {formatNumber(row.redemptions)}
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.compensations, row.revenue > 0 ? (row.compensations / row.revenue) * 100 : 0, row.redemptions)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.cost, row.costPercent, row.redemptions)}
                      </TableCell>
                      {!isShares && (
                        <TableCell className="text-xs sm:text-sm">
                          {row.costPercent.toFixed(1)}%
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.commission, row.commissionPercent, row.redemptions)}
                      </TableCell>
                      {!isShares && (
                        <TableCell className="text-xs sm:text-sm">
                          {row.commissionPercent.toFixed(1)}%
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.logistics, row.logisticsPercent, row.redemptions)}
                      </TableCell>
                      {!isShares && (
                        <TableCell className="text-xs sm:text-sm">
                          {row.logisticsPercent.toFixed(1)}%
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.storage, row.storagePercent, row.redemptions)}
                      </TableCell>
                      {!isShares && (
                        <TableCell className="text-xs sm:text-sm">
                          {row.storagePercent.toFixed(1)}%
                        </TableCell>
                      )}
                      <TableCell className="text-xs sm:text-sm">
                        {formatValue(row.advertisingH, row.revenue > 0 ? (row.advertisingH / row.revenue) * 100 : 0, row.redemptions)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {isShares ? (
                          row.marginHPercent.toFixed(1) + "%"
                        ) : (
                          <div className="flex flex-col">
                            <span>{formatValue(row.marginH, row.marginHPercent, row.redemptions)}</span>
                            {!isPerUnit && (
                              <span className="text-muted-foreground">
                                {row.marginHPercent.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <span className="text-green-500 font-semibold">
                          +{row.deltaToFact}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
              Подсказка: нажмите Н для переключения между Н1 и Н2, U — режим «на единицу», Т — тема.
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}


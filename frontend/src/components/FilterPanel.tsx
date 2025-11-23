import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Типы для фильтров
export interface FilterConfig {
  markets?: string[]
  cabinets?: string[]
  brands?: string[]
  categories?: string[]
  articles?: string[]
  bundles?: string[]
  dateRange?: {
    startDate?: Date
    endDate?: Date
  }
  comparisonEnabled?: boolean
  filterType?: "by-date" | "by-week" | "by-month"
}

interface FilterPanelProps {
  onFilterChange?: (filters: FilterConfig) => void
  initialFilters?: FilterConfig
  // Конфигурация доступных фильтров
  availableFilters?: {
    markets?: string[]
    cabinets?: string[]
    brands?: string[]
    categories?: string[]
    articles?: string[]
    bundles?: string[]
  }
}

export function FilterPanel({
  onFilterChange,
  initialFilters,
  availableFilters = {},
}: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialFilters?.dateRange?.startDate || new Date()
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialFilters?.dateRange?.endDate || new Date()
  )
  const [comparisonEnabled, setComparisonEnabled] = useState(
    initialFilters?.comparisonEnabled || false
  )
  const [filterType, setFilterType] = useState<"by-date" | "by-week" | "by-month">(
    initialFilters?.filterType || "by-date"
  )
  const [selectedMarket, setSelectedMarket] = useState(
    initialFilters?.markets?.[0] || "Все"
  )
  const [selectedCabinet, setSelectedCabinet] = useState(
    initialFilters?.cabinets?.[0] || "Все"
  )
  const [selectedBrand, setSelectedBrand] = useState(
    initialFilters?.brands?.[0] || "Все"
  )
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters?.categories?.[0] || "Все"
  )
  const [selectedArticle, setSelectedArticle] = useState(
    initialFilters?.articles?.[0] || "Все"
  )
  const [selectedBundle, setSelectedBundle] = useState(
    initialFilters?.bundles?.[0] || "Все"
  )

  // Значения по умолчанию
  const markets = availableFilters.markets || ["Все", "Wildberries", "Ozon", "Яндекс.Маркет"]
  const cabinets = availableFilters.cabinets || ["Все", "Кабинет 1", "Кабинет 2", "Кабинет 3"]
  const brands = availableFilters.brands || ["Все", "Бренд A", "Бренд B", "Бренд C"]
  const categories = availableFilters.categories || ["Все", "Электроника", "Одежда", "Бытовая техника"]
  const articles = availableFilters.articles || ["Все", "Артикул 001", "Артикул 002", "Артикул 003"]
  const bundles = availableFilters.bundles || ["Все", "Связка 1", "Связка 2", "Связка 3"]

  const handleApplyFilters = () => {
    const filters: FilterConfig = {
      markets: selectedMarket !== "Все" ? [selectedMarket] : undefined,
      cabinets: selectedCabinet !== "Все" ? [selectedCabinet] : undefined,
      brands: selectedBrand !== "Все" ? [selectedBrand] : undefined,
      categories: selectedCategory !== "Все" ? [selectedCategory] : undefined,
      articles: selectedArticle !== "Все" ? [selectedArticle] : undefined,
      bundles: selectedBundle !== "Все" ? [selectedBundle] : undefined,
      dateRange: {
        startDate,
        endDate,
      },
      comparisonEnabled,
      filterType,
    }

    onFilterChange?.(filters)
    setOpen(false)
  }

  const handleResetFilters = () => {
    setStartDate(new Date())
    setEndDate(new Date())
    setComparisonEnabled(false)
    setFilterType("by-date")
    setSelectedMarket("Все")
    setSelectedCabinet("Все")
    setSelectedBrand("Все")
    setSelectedCategory("Все")
    setSelectedArticle("Все")
    setSelectedBundle("Все")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Тип фильтра */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Тип фильтра</label>
            <Select value={filterType} onValueChange={(value: "by-date" | "by-week" | "by-month") => setFilterType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="По датам" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="by-date">По датам</SelectItem>
                <SelectItem value="by-week">По неделям</SelectItem>
                <SelectItem value="by-month">По месяцам</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Период */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Период</label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
              placeholder="Выберите период"
            />
          </div>

          {/* Сравнение */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Сравнение</label>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={comparisonEnabled}
                onCheckedChange={(v) => setComparisonEnabled(v === true)}
              />
              <span className="text-sm text-muted-foreground">
                Включить сравнение
              </span>
            </div>
          </div>

          {/* Маркет */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Маркет</label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите маркет" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Кабинет */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Кабинет</label>
            <Select value={selectedCabinet} onValueChange={setSelectedCabinet}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите кабинет" />
              </SelectTrigger>
              <SelectContent>
                {cabinets.map((cabinet) => (
                  <SelectItem key={cabinet} value={cabinet}>
                    {cabinet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Бренд */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Бренд</label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите бренд" />
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

          {/* Категория */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Категория</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите категорию" />
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

          {/* Артикул */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Артикул</label>
            <Select value={selectedArticle} onValueChange={setSelectedArticle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите артикул" />
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

          {/* Связка */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Связка</label>
            <Select value={selectedBundle} onValueChange={setSelectedBundle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите связку" />
              </SelectTrigger>
              <SelectContent>
                {bundles.map((bundle) => (
                  <SelectItem key={bundle} value={bundle}>
                    {bundle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Применить
            </Button>
            <Button onClick={handleResetFilters} variant="outline" className="flex-1">
              Сбросить
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


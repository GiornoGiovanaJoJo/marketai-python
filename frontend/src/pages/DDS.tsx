import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CreditCard,
  Building2,
  Plus,
  Upload,
  Download,
  FileDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

// Mock данные для фильтров
const platforms = ["Все", "Wildberries", "Ozon", "Яндекс.Маркет"]
const brands = ["Все", "Бренд 1", "Бренд 2", "Бренд 3"]
const managers = ["Все", "Менеджер 1", "Менеджер 2", "Менеджер 3"]
const legalEntities = ["Все", "ИП Васильев", "ООО MarketAI"]
const reportTypes = ["Факт", "План"]
const groupings = ["По дням", "По неделям", "По месяцам"]

// Mock данные для счетов
const accounts = [
  {
    id: "1",
    name: "Карта Альфа-Банк",
    bank: "Альфа-Банк",
    balance: 120000,
    initialBalance: 120000,
  },
  {
    id: "2",
    name: "Карта Тинькофф",
    bank: "Тинькофф",
    balance: 85000,
    initialBalance: 85000,
  },
  {
    id: "3",
    name: "Расчётный счёт Тинькофф",
    bank: "Тинькофф",
    balance: 430000,
    initialBalance: 430000,
  },
  {
    id: "4",
    name: "Расчётный счёт Сбербанк",
    bank: "Сбербанк",
    balance: 210000,
    initialBalance: 210000,
  },
]

// Mock данные для таблицы ДДС
const ddsTableData: any[] = []

export function DDS() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("fact")
  const [darkTheme, setDarkTheme] = useState(true)
  const [apuEnabled, setApuEnabled] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 9, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 9, 31))
  const [selectedPlatform, setSelectedPlatform] = useState("Все")
  const [selectedBrand, setSelectedBrand] = useState("Все")
  const [articleSearch, setArticleSearch] = useState("")
  const [selectedManager, setSelectedManager] = useState("Все")
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("Все")
  const [selectedReportType, setSelectedReportType] = useState("Факт")
  const [selectedGrouping, setSelectedGrouping] = useState("По дням")
  const [accountBalances, setAccountBalances] = useState(accounts)
  const [tableTab, setTableTab] = useState("by-article")
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [newAccountName, setNewAccountName] = useState("")
  const [newAccountBank, setNewAccountBank] = useState("")

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleFixBalances = () => {
    toast({
      title: "Остатки зафиксированы",
      description: "Начальные остатки на счетах успешно зафиксированы",
    })
  }

  const handleInitialBalanceChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setAccountBalances((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, initialBalance: numValue } : acc
      )
    )
  }

  const handleAddOperation = () => {
    toast({
      title: "Добавление операции",
      description: "Открывается форма добавления операции",
    })
  }

  const handleImportExcel = () => {
    toast({
      title: "Импорт Excel",
      description: "Функция импорта Excel будет реализована",
    })
  }

  const handleUploadBank = () => {
    toast({
      title: "Подгрузка банка",
      description: "Загрузка данных из банка...",
    })
  }

  const handleExport = () => {
    toast({
      title: "Экспорт",
      description: "Данные экспортируются...",
    })
  }

  // Обработчик добавления нового счёта
  const handleAddAccount = () => {
    if (!newAccountName.trim() || !newAccountBank.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      })
      return
    }

    const accountName = newAccountName.trim()
    const accountBank = newAccountBank.trim()

    const newAccount = {
      id: String(accountBalances.length + 1),
      name: accountName,
      bank: accountBank,
      balance: 0,
      initialBalance: 0,
    }

    setAccountBalances((prev) => [...prev, newAccount])
    setNewAccountName("")
    setNewAccountBank("")
    setIsAddAccountOpen(false)
    toast({
      title: "Счёт добавлен",
      description: `Счёт "${accountName}" успешно добавлен`,
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace("₽", "₽")
  }

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd.MM.yy")} — ${format(endDate, "dd.MM.yy")}`
    }
    return "01.10.25 — 31.10.25"
  }

  // Метрики
  const incoming = 0
  const outgoing = 0
  const cashflow = 0
  const totalBalance = accountBalances.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок и настройки */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 md:mt-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
              ДДС
            </h1>
          </div>

          {/* Настройки справа */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                APU закрывает комиссии/логистику/рекламу МП
              </span>
              <Checkbox
                checked={apuEnabled}
                onCheckedChange={(checked) => setApuEnabled(checked === true)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Тёмная тема</span>
              <Switch checked={darkTheme} onCheckedChange={setDarkTheme} />
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <Card className="glass-effect">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Период</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                  placeholder={formatDateRange()}
                  className="w-full text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Площадка</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
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

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Артикул</label>
                <Input
                  placeholder="напр. 370240817"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Менеджер</label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Юрлицо</label>
                <Select
                  value={selectedLegalEntity}
                  onValueChange={setSelectedLegalEntity}
                >
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalEntities.map((entity) => (
                      <SelectItem key={entity} value={entity}>
                        {entity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Тип отчёта</label>
                <Select
                  value={selectedReportType}
                  onValueChange={setSelectedReportType}
                >
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="Факт" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Группировка</label>
                <Select value={selectedGrouping} onValueChange={setSelectedGrouping}>
                  <SelectTrigger className="w-full text-xs sm:text-sm">
                    <SelectValue placeholder="По дням" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupings.map((grouping) => (
                      <SelectItem key={grouping} value={grouping}>
                        {grouping}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Табы */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-transparent border-0 p-0 gap-2">
            <TabsTrigger 
              value="fact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
            >
              Факт
            </TabsTrigger>
            <TabsTrigger 
              value="by-articles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
            >
              По артикулам
            </TabsTrigger>
            <TabsTrigger 
              value="legal-entities"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
            >
              Юрлица
            </TabsTrigger>
          </TabsList>

          {/* Контент вкладки "Факт" */}
          <TabsContent value="fact" className="space-y-4 sm:space-y-6 mt-6">
            {/* Карточки метрик */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Входящие */}
              <Card className="glass-effect dashboard-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Входящие</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-bold text-green-500">
                      {incoming >= 0 ? "+" : ""}
                      {formatNumber(incoming)}
                    </div>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      Вне МП
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Исходящий денежный поток */}
              <Card className="glass-effect dashboard-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Исходящий денежный поток
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-bold text-red-500">
                      {outgoing >= 0 ? "-" : "+"}
                      {formatNumber(Math.abs(outgoing))}
                    </div>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      Off-MP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Кэшфлоу */}
              <Card className="glass-effect dashboard-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Кэшфлоу</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {formatNumber(cashflow)}
                    </div>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      Факт
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Остаток на счетах */}
              <Card className="glass-effect dashboard-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Остаток на счетах (итого)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {formatNumber(totalBalance)}
                    </div>
                    <Button
                      size="sm"
                      className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      Банки
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Остатки на счетах */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Остаток на счетах</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      Можно зафиксировать стартовые суммы. При операциях списания/зачисления
                      баланс обновляется.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddAccountOpen(true)}
                    className="text-xs sm:text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить счёт
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accountBalances.map((account) => (
                    <Card key={account.id} className="glass-effect">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-1">{account.name}</h4>
                            <p className="text-xs text-muted-foreground mb-1">{account.bank}</p>
                            <div className="text-xl font-bold">
                              {formatNumber(account.balance)}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">
                              Начальный остаток
                            </label>
                            <Input
                              type="number"
                              value={account.initialBalance}
                              onChange={(e) =>
                                handleInitialBalanceChange(account.id, e.target.value)
                              }
                              className="text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleFixBalances} className="text-xs sm:text-sm">
                    Зафиксировать остатки
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Навигационные табы для таблицы */}
            <Tabs value={tableTab} onValueChange={setTableTab}>
              <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-transparent border-0 p-0 gap-2">
                <TabsTrigger 
                  value="by-article"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                >
                  По артикулу
                </TabsTrigger>
                <TabsTrigger 
                  value="by-legal-entity"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                >
                  По юрлицу
                </TabsTrigger>
                <TabsTrigger 
                  value="company"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
                >
                  Компания
                </TabsTrigger>
              </TabsList>

              <TabsContent value="by-article" className="space-y-4 sm:space-y-6 mt-6">
                {/* Графики */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="glass-effect">
                    <CardContent className="p-6 h-64 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Линейный график: Входящие / Исходящие / Кэшфлоу (placeholder)
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="glass-effect">
                    <CardContent className="p-6 h-64 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Структура расходов по категориям (placeholder)
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="glass-effect">
                    <CardContent className="p-6 h-64 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Stacked bar: вклад юрлиц (placeholder)
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Таблица ДДС */}
                <Card className="glass-effect">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="text-base sm:text-lg">Таблица ДДС</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddOperation}
                          className="text-xs sm:text-sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Добавить операцию
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleImportExcel}
                          className="text-xs sm:text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Импорт Excel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleUploadBank}
                          className="text-xs sm:text-sm bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Подгрузить банк
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExport}
                          className="text-xs sm:text-sm"
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Экспорт
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border overflow-hidden overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Дата</TableHead>
                            <TableHead className="text-xs sm:text-sm">Артикул</TableHead>
                            <TableHead className="text-xs sm:text-sm">Юрлицо</TableHead>
                            <TableHead className="text-xs sm:text-sm">Категория</TableHead>
                            <TableHead className="text-xs sm:text-sm">Тип</TableHead>
                            <TableHead className="text-xs sm:text-sm">Сумма</TableHead>
                            <TableHead className="text-xs sm:text-sm">Счёт</TableHead>
                            <TableHead className="text-xs sm:text-sm">Скоп</TableHead>
                            <TableHead className="text-xs sm:text-sm">Описание</TableHead>
                            <TableHead className="text-xs sm:text-sm">Менеджер</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ddsTableData.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={10}
                                className="text-center text-sm text-muted-foreground py-8"
                              >
                                Нет данных для отображения
                              </TableCell>
                            </TableRow>
                          ) : (
                            ddsTableData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.date}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.article}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.legalEntity}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.category}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.type}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.amount}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.account}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.scope}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.description}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {row.manager}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                      Компания → можно распределять по артикулу/категории/бренду по формуле
                      (доля выручки / шт / маржа / ручное %), либо не распределять и учитывать
                      только в ДДС.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="by-legal-entity" className="space-y-4 sm:space-y-6 mt-6">
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Контент по юрлицу (placeholder)
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-4 sm:space-y-6 mt-6">
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Контент по компании (placeholder)
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="by-articles" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Контент по артикулам (placeholder)
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal-entities" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center py-8">
                  Контент по юрлицам (placeholder)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Диалог добавления счёта */}
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogContent className="sm:max-w-[500px] border-2 border-primary/20 shadow-2xl">
            <DialogHeader className="space-y-3 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Добавить счёт
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    Заполните информацию о новом счёте
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              {/* Поле "Название" */}
              <div className="space-y-3">
                <label 
                  htmlFor="account-name" 
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  Название счёта
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <Input
                    id="account-name"
                    placeholder="Например: Расчётный счёт"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="pl-10 h-11 border-2 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 backdrop-blur-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newAccountName.trim() && newAccountBank.trim()) {
                        handleAddAccount()
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-1">
                  Укажите название счёта для идентификации
                </p>
              </div>

              {/* Поле "Банк" */}
              <div className="space-y-3">
                <label 
                  htmlFor="account-bank" 
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-primary" />
                  Банк
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <Input
                    id="account-bank"
                    placeholder="Например: Сбербанк, Тинькофф, Альфа-Банк"
                    value={newAccountBank}
                    onChange={(e) => setNewAccountBank(e.target.value)}
                    className="pl-10 h-11 border-2 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 backdrop-blur-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newAccountName.trim() && newAccountBank.trim()) {
                        handleAddAccount()
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-1">
                  Укажите название банка, где открыт счёт
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddAccountOpen(false)
                  setNewAccountName("")
                  setNewAccountBank("")
                }}
                className="flex-1 sm:flex-initial border-2 hover:bg-muted/50 transition-all duration-200"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleAddAccount}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                disabled={!newAccountName.trim() || !newAccountBank.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить счёт
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


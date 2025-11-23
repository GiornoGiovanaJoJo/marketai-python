import { useState } from "react"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для сводки сети
const networkSummary = {
  total: 134,
  level1: 28,
  level2: 64,
  level3: 42,
}

// Mock данные для партнёров
const partners = [
  {
    id: 1,
    level: 2,
    username: "@partner001",
    underWhom: null,
    contact: "+7 926 437-97-58",
    registrationDate: "2025-01-09",
    lastVisit: "2025-01-20",
    lastPayment: null,
    subscriptionStatus: "unpaid",
    income: 0,
  },
  {
    id: 2,
    level: 3,
    username: "@partner002",
    underWhom: "@partner001",
    contact: "+7 988 274-20-59",
    registrationDate: "2025-05-11",
    lastVisit: "2025-06-27",
    lastPayment: "2025-06-22",
    subscriptionStatus: "paid",
    income: 450,
  },
  {
    id: 3,
    level: 1,
    username: "@partner003",
    underWhom: null,
    contact: "+7 949 550-40-13",
    registrationDate: "2025-02-16",
    lastVisit: "2025-05-20",
    lastPayment: "2025-05-05",
    subscriptionStatus: "paid",
    income: 4500,
  },
  {
    id: 4,
    level: 1,
    username: "@partner004",
    underWhom: null,
    contact: "+7 950 563-51-21",
    registrationDate: "2024-12-24",
    lastVisit: "2025-09-10",
    lastPayment: null,
    subscriptionStatus: "expired",
    income: 0,
  },
  {
    id: 5,
    level: 2,
    username: "@partner005",
    underWhom: "@partner003",
    contact: "+7 912 345-67-89",
    registrationDate: "2025-03-10",
    lastVisit: "2025-07-15",
    lastPayment: "2025-07-01",
    subscriptionStatus: "paid",
    income: 1200,
  },
  {
    id: 6,
    level: 3,
    username: "@partner006",
    underWhom: "@partner002",
    contact: "+7 987 654-32-10",
    registrationDate: "2025-04-20",
    lastVisit: "2025-08-05",
    lastPayment: null,
    subscriptionStatus: "unpaid",
    income: 0,
  },
  {
    id: 7,
    level: 1,
    username: "@partner007",
    underWhom: null,
    contact: "+7 911 222-33-44",
    registrationDate: "2025-01-05",
    lastVisit: "2025-06-30",
    lastPayment: "2025-06-15",
    subscriptionStatus: "paid",
    income: 3000,
  },
  {
    id: 8,
    level: 2,
    username: "@partner008",
    underWhom: "@partner007",
    contact: "+7 999 888-77-66",
    registrationDate: "2025-02-28",
    lastVisit: "2025-07-20",
    lastPayment: "2025-07-10",
    subscriptionStatus: "paid",
    income: 750,
  },
]

export function ReferralNetwork() {
  const { toast } = useToast()
  const [levelFilter, setLevelFilter] = useState("all")
  const [dateField, setDateField] = useState("registration")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Применение фильтров
  const handleApplyFilters = () => {
    // TODO: Обработка применения фильтров
    toast({
      title: "Фильтры применены",
      description: "Фильтры успешно применены к таблице",
    })
  }

  // Получение цвета для уровня
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "text-purple-500"
      case 2:
        return "text-blue-500"
      case 3:
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Получение цвета точки для уровня
  const getLevelDotColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-purple-500"
      case 2:
        return "bg-blue-500"
      case 3:
        return "bg-purple-500"
      default:
        return "bg-muted-foreground"
    }
  }

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return dateString
  }

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount)
  }

  // Получение статуса подписки
  const getSubscriptionStatus = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Оплатил",
          variant: "default" as const,
          className: "bg-green-500/20 text-green-500 border-green-500/30",
          icon: CheckCircle,
        }
      case "unpaid":
        return {
          label: "Не оплатил",
          variant: "secondary" as const,
          className: "bg-orange-500/20 text-orange-500 border-orange-500/30",
          icon: XCircle,
        }
      case "expired":
        return {
          label: "Истекла",
          variant: "destructive" as const,
          className: "bg-red-500/20 text-red-500 border-red-500/30",
          icon: Clock,
        }
      default:
        return {
          label: "Неизвестно",
          variant: "secondary" as const,
          className: "bg-muted text-muted-foreground",
          icon: XCircle,
        }
    }
  }

  // Фильтрация партнёров
  const filteredPartners = partners.filter((partner) => {
    if (levelFilter !== "all" && partner.level.toString() !== levelFilter) {
      return false
    }
    // TODO: Добавить фильтрацию по датам
    return true
  })

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Заголовок и сводка */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Моя сеть
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Всего в сети: {formatAmount(networkSummary.total)} партнёра (L1/L2/L3: {networkSummary.level1}/{networkSummary.level2}/{networkSummary.level3})
          </p>
        </div>

        {/* Фильтры */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Фильтр по уровню:
                  </label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Все" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="1">1-й уровень</SelectItem>
                      <SelectItem value="2">2-й уровень</SelectItem>
                      <SelectItem value="3">3-й уровень</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Поле даты:
                  </label>
                  <Select value={dateField} onValueChange={setDateField}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Регистрация" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration">Регистрация</SelectItem>
                      <SelectItem value="lastVisit">Последний визит</SelectItem>
                      <SelectItem value="lastPayment">Последняя оплата</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">С:</label>
                  <DatePicker
                    date={startDate}
                    onDateChange={setStartDate}
                    placeholder="YYYY-MM-DD"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">по:</label>
                  <DatePicker
                    date={endDate}
                    onDateChange={setEndDate}
                    placeholder="YYYY-MM-DD"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Применить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица партнёров */}
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 hover:bg-transparent">
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      УРОВЕНЬ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ПАРТНЁР
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ПОД КЕМ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      КОНТАКТ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ДАТА РЕГИСТРАЦИИ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ПОСЛЕДНИЙ ВИЗИТ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ПОСЛЕДНЯЯ ОПЛАТА
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      СТАТУС ПОДПИСКИ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground text-right whitespace-nowrap">
                      ДОХОД ДЛЯ ВАС
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => {
                    const status = getSubscriptionStatus(partner.subscriptionStatus)
                    const StatusIcon = status.icon
                    return (
                      <TableRow
                        key={partner.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getLevelDotColor(partner.level)}`} />
                            <span className={`font-semibold ${getLevelColor(partner.level)}`}>
                              Уровень {partner.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 font-mono text-sm text-foreground whitespace-nowrap">
                          {partner.username}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {partner.underWhom || "—"}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {partner.level === 2 || partner.level === 3 ? "—" : partner.contact}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(partner.registrationDate)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(partner.lastVisit)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(partner.lastPayment)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={status.variant}
                            className={status.className}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                          {formatAmount(partner.income)} ₽
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


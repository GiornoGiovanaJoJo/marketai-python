import { useState } from "react"
import { CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Mock данные для транзакций
const transactions = [
  {
    id: 1,
    paymentDate: "2025-02-10",
    partner: "@partner042",
    level: 2,
    payment: 2500,
    rate: 20,
    commission: 500,
    status: "hold",
    creditedDate: "2025-02-17",
  },
  {
    id: 2,
    paymentDate: "2025-02-24",
    partner: "@partner032",
    level: 1,
    payment: 4500,
    rate: 5,
    commission: 225,
    status: "available",
    creditedDate: null,
  },
  {
    id: 3,
    paymentDate: "2025-07-24",
    partner: "@partner014",
    level: 2,
    payment: 1000,
    rate: 30,
    commission: 300,
    status: "hold",
    creditedDate: "2025-08-01",
  },
  {
    id: 4,
    paymentDate: "2025-05-20",
    partner: "@partner023",
    level: 3,
    payment: 5000,
    rate: 30,
    commission: 1500,
    status: "hold",
    creditedDate: "2025-05-31",
  },
  {
    id: 5,
    paymentDate: "2025-03-15",
    partner: "@partner051",
    level: 1,
    payment: 3000,
    rate: 30,
    commission: 900,
    status: "available",
    creditedDate: null,
  },
  {
    id: 6,
    paymentDate: "2025-06-10",
    partner: "@partner067",
    level: 2,
    payment: 1500,
    rate: 10,
    commission: 150,
    status: "hold",
    creditedDate: "2025-06-24",
  },
  {
    id: 7,
    paymentDate: "2025-04-28",
    partner: "@partner089",
    level: 3,
    payment: 2000,
    rate: 5,
    commission: 100,
    status: "available",
    creditedDate: null,
  },
  {
    id: 8,
    paymentDate: "2025-01-12",
    partner: "@partner012",
    level: 1,
    payment: 6000,
    rate: 30,
    commission: 1800,
    status: "available",
    creditedDate: null,
  },
  {
    id: 9,
    paymentDate: "2025-08-05",
    partner: "@partner078",
    level: 2,
    payment: 3500,
    rate: 10,
    commission: 350,
    status: "hold",
    creditedDate: "2025-08-19",
  },
  {
    id: 10,
    paymentDate: "2025-05-30",
    partner: "@partner045",
    level: 3,
    payment: 1200,
    rate: 5,
    commission: 60,
    status: "available",
    creditedDate: null,
  },
]

export function ReferralIncome() {
  const { toast } = useToast()
  const [levelFilter, setLevelFilter] = useState("all")
  const [dateField, setDateField] = useState("payment")
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

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return dateString
  }

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount)
  }

  // Получение статуса
  const getStatus = (status: string) => {
    switch (status) {
      case "available":
        return {
          label: "Доступно",
          variant: "default" as const,
          className: "bg-green-500/20 text-green-500 border-green-500/30",
          icon: CheckCircle,
        }
      case "hold":
        return {
          label: "Удержание",
          variant: "secondary" as const,
          className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
          icon: Clock,
        }
      default:
        return {
          label: "Неизвестно",
          variant: "secondary" as const,
          className: "bg-muted text-muted-foreground",
          icon: Clock,
        }
    }
  }

  // Фильтрация транзакций
  const filteredTransactions = transactions.filter((transaction) => {
    if (levelFilter !== "all" && transaction.level.toString() !== levelFilter) {
      return false
    }
    // TODO: Добавить фильтрацию по датам
    return true
  })

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Заголовок */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Доход и начисления
          </h1>
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
                      <SelectItem value="1">1-й уровень (L1)</SelectItem>
                      <SelectItem value="2">2-й уровень (L2)</SelectItem>
                      <SelectItem value="3">3-й уровень (L3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Поле даты:
                  </label>
                  <Select value={dateField} onValueChange={setDateField}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Дата платежа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Дата платежа</SelectItem>
                      <SelectItem value="credited">Дата зачисления</SelectItem>
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

        {/* Таблица транзакций */}
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 hover:bg-transparent">
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ДАТА ПЛАТЕЖА
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ПАРТНЁР
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      УРОВЕНЬ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap text-right">
                      ПЛАТЁЖ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap text-right">
                      СТАВКА
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap text-right">
                      КОМИССИЯ
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      СТАТУС
                    </TableHead>
                    <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                      ЗАЧИСЛИТСЯ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const status = getStatus(transaction.status)
                    const StatusIcon = status.icon
                    return (
                      <TableRow
                        key={transaction.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(transaction.paymentDate)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 font-mono text-sm text-foreground whitespace-nowrap">
                          {transaction.partner}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                          <span className="font-semibold">L{transaction.level}</span>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right text-foreground whitespace-nowrap">
                          {formatAmount(transaction.payment)} ₽
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right text-foreground whitespace-nowrap">
                          {transaction.rate}%
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                          {formatAmount(transaction.commission)} ₽
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
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {formatDate(transaction.creditedDate)}
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


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для истории выплат
const payoutHistory = [
  {
    id: "W-5975",
    date: "2025-02-08",
    amount: 9000,
    status: "processing",
    comment: "Refund request",
  },
  {
    id: "W-1485",
    date: "2025-07-19",
    amount: 20000,
    status: "declined",
    comment: "Срочно",
  },
  {
    id: "W-4964",
    date: "2025-03-24",
    amount: 15000,
    status: "declined",
    comment: "Refund request",
  },
  {
    id: "W-9051",
    date: "2025-06-10",
    amount: 75000,
    status: "processing",
    comment: "Проверка реквизитов",
  },
  {
    id: "W-7251",
    date: "2025-06-15",
    amount: 9000,
    status: "processing",
    comment: "Refund request",
  },
  {
    id: "W-6759",
    date: "2025-10-29",
    amount: 20000,
    status: "processing",
    comment: "Срочно",
  },
  {
    id: "W-5769",
    date: "2025-08-27",
    amount: 75000,
    status: "created",
    comment: "Оплата по заявке",
  },
  {
    id: "W-9517",
    date: "2025-05-12",
    amount: 12000,
    status: "created",
    comment: "Оплата по заявке",
  },
  {
    id: "W-8490",
    date: "2025-04-15",
    amount: 15000,
    status: "created",
    comment: "manual review",
  },
  {
    id: "W-2825",
    date: "2025-01-18",
    amount: 75000,
    status: "processing",
    comment: "Проверка реквизитов",
  },
]

// Mock данные для баланса
const balance = 12450

export function ReferralPayments() {
  const { toast } = useToast()
  const [isTestMode, setIsTestMode] = useState(true)

  // Запрос выплаты
  const handleRequestPayout = () => {
    if (balance < 10000) {
      toast({
        title: "Недостаточно средств",
        description: "Минимальная сумма для вывода составляет 10 000 ₽",
        variant: "destructive",
      })
      return
    }
    // TODO: Обработка запроса выплаты
    toast({
      title: "Запрос выплаты создан",
      description: `Запрос на выплату ${balance.toLocaleString("ru-RU")} ₽ успешно создан`,
    })
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return dateString
  }

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount)
  }

  // Получение статуса
  const getStatus = (status: string) => {
    switch (status) {
      case "processing":
        return {
          label: "В обработке",
          variant: "secondary" as const,
          className: "bg-orange-500/20 text-orange-500 border-orange-500/30",
        }
      case "declined":
        return {
          label: "Отклонено",
          variant: "destructive" as const,
          className: "bg-red-600/20 text-red-600 border-red-600/30",
        }
      case "created":
        return {
          label: "Создано",
          variant: "default" as const,
          className: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        }
      default:
        return {
          label: "Неизвестно",
          variant: "secondary" as const,
          className: "bg-muted text-muted-foreground",
        }
    }
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Заголовок */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Выплаты
          </h1>
        </div>

        {/* Карточка баланса */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 space-y-2">
                <p className="text-base sm:text-lg text-muted-foreground">
                  Баланс к выводу:
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {formatAmount(balance)} ₽
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Тестовый контур
                    </span>
                    <Switch
                      checked={isTestMode}
                      onCheckedChange={setIsTestMode}
                      className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleRequestPayout}
                size="lg"
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Запросить выплату
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Секция истории выплат */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            История выплат
          </h2>

          {/* Таблица истории выплат */}
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        ID
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        ДАТА
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap text-right">
                        СУММА
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        СТАТУС
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        КОММЕНТАРИЙ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutHistory.map((payout) => {
                      const status = getStatus(payout.status)
                      return (
                        <TableRow
                          key={payout.id}
                          className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                        >
                          <TableCell className="px-4 sm:px-6 py-4 font-mono text-sm text-foreground whitespace-nowrap">
                            {payout.id}
                          </TableCell>
                          <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                            {formatDate(payout.date)}
                          </TableCell>
                          <TableCell className="px-4 sm:px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                            {formatAmount(payout.amount)} ₽
                          </TableCell>
                          <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={status.variant}
                              className={status.className}
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                            {payout.comment}
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
    </div>
  )
}






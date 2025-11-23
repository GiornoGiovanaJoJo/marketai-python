import { useState } from "react"
import { Copy, Plus, Wallet, Clock, TrendingUp, Users, CheckCircle, XCircle } from "lucide-react"
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

// Mock данные для метрик
const metrics = [
  {
    id: "available",
    title: "Доступно к выводу",
    value: "12 450",
    currency: "₽",
    note: "минимум к выводу 10 000 ₽",
    icon: Wallet,
    color: "text-green-500",
  },
  {
    id: "onHold",
    title: "На удержании",
    value: "3 200",
    currency: "₽",
    note: "ожидает доступности",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    id: "totalEarned",
    title: "Всего заработано",
    value: "58 970",
    currency: "₽",
    note: "за всё время",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    id: "partners",
    title: "Партнёров в сети",
    value: "134",
    note: "L1/L2/L3: 28/64/42",
    icon: Users,
    color: "text-purple-500",
  },
]

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
    subscriptionStatus: "unpaid",
    income: 0,
  },
]

// Mock данные для промокодов
const promoCodes = [
  {
    id: 1,
    code: "ROMAN50",
    source: "Instagram Reels",
    clicks: 412,
    registrations: 37,
    payments: 18,
    income: 27000,
  },
  {
    id: 2,
    code: "WB2025",
    source: "Telegram-канал",
    clicks: 180,
    registrations: 14,
    payments: 6,
    income: 9000,
  },
]

// Реферальная ссылка
const referralLink = "https://marketai.ru/?ref=USERID123"

export function ReferralOverview() {
  const { toast } = useToast()
  const [levelFilter, setLevelFilter] = useState("all")
  const [dateField, setDateField] = useState("registration")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Копирование ссылки в буфер обмена
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast({
        title: "Ссылка скопирована",
        description: "Реферальная ссылка скопирована в буфер обмена",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive",
      })
    }
  }

  // Создание промокода
  const handleCreatePromoCode = () => {
    // TODO: Обработка создания промокода
    toast({
      title: "Создание промокода",
      description: "Функция создания промокода будет доступна в ближайшее время",
    })
  }

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
        return "text-cyan-500"
      default:
        return "text-muted-foreground"
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

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Заголовок и реферальная ссылка */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Обзор партнёрского кабинета
          </h1>

          {/* Реферальная ссылка с кнопками */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Реферальная ссылка
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="font-mono text-sm sm:text-base bg-background/50 border-border/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="flex-1 sm:flex-none border-border/50 hover:bg-secondary/50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Скопировать ссылку
                  </Button>
                  <Button
                    onClick={handleCreatePromoCode}
                    className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать промокод
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Карточки метрик */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric) => {
            const IconComponent = metric.icon
            return (
              <Card
                key={metric.id}
                className="bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-medium text-muted-foreground">
                      {metric.title}
                    </h3>
                    <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {metric.value}
                      </span>
                      {metric.currency && (
                        <span className="text-lg sm:text-xl font-semibold text-muted-foreground">
                          {metric.currency}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {metric.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Секция "Моя сеть" */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Моя сеть
          </h2>

          {/* Фильтры */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Фильтр по уровню
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
                    Поле даты
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
                  <label className="text-sm font-medium text-foreground">с:</label>
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

                <div className="flex items-end">
                  <Button
                    onClick={handleApplyFilters}
                    className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                    {partners.map((partner) => (
                      <TableRow
                        key={partner.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <TableCell className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              partner.level === 1 ? "bg-purple-500" :
                              partner.level === 2 ? "bg-blue-500" :
                              "bg-cyan-500"
                            }`} />
                            <span className={`font-semibold ${getLevelColor(partner.level)}`}>
                              {partner.level}
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
                            variant={partner.subscriptionStatus === "paid" ? "default" : "secondary"}
                            className={
                              partner.subscriptionStatus === "paid"
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-orange-500/20 text-orange-500 border-orange-500/30"
                            }
                          >
                            {partner.subscriptionStatus === "paid" ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Оплатил
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Не оплатил
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right font-semibold text-foreground whitespace-nowrap">
                          {formatAmount(partner.income)} ₽
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Секция "Мои промокоды" */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Мои промокоды
          </h2>

          {/* Таблица промокодов */}
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        ПРОМОКОД
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground whitespace-nowrap">
                        ИСТОЧНИК
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground text-right whitespace-nowrap">
                        КЛИКИ
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground text-right whitespace-nowrap">
                        РЕГИСТРАЦИИ
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground text-right whitespace-nowrap">
                        ОПЛАТЫ
                      </TableHead>
                      <TableHead className="h-12 px-4 sm:px-6 font-bold text-foreground text-right whitespace-nowrap">
                        ДОХОД
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promoCodes.map((promo) => (
                      <TableRow
                        key={promo.id}
                        className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                      >
                        <TableCell className="px-4 sm:px-6 py-4 font-mono font-semibold text-foreground whitespace-nowrap">
                          {promo.code}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {promo.source}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right text-foreground whitespace-nowrap">
                          {formatAmount(promo.clicks)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right text-foreground whitespace-nowrap">
                          {formatAmount(promo.registrations)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right text-foreground whitespace-nowrap">
                          {formatAmount(promo.payments)}
                        </TableCell>
                        <TableCell className="px-4 sm:px-6 py-4 text-right font-semibold text-primary whitespace-nowrap">
                          {formatAmount(promo.income)} ₽
                        </TableCell>
                      </TableRow>
                    ))}
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


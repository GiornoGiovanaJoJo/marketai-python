import { Star, Menu, Plus, TrendingUp, CheckCircle, Download } from "lucide-react"
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

// Mock данные для комиссий
const commissionRates = {
  level1: 30,
  level2: 10,
  level3: 5,
}

// Mock данные для шагов
const steps = [
  {
    id: 1,
    icon: Menu,
    title: "Регистрация",
    description: "Получите личный кабинет, реферальную ссылку и промокод.",
  },
  {
    id: 2,
    icon: Plus,
    title: "Делитесь ссылкой",
    description:
      "Соцсети, мессенджеры, сайт, e-mail, видео — любой канал с вашей аудиторией.",
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Фиксируйте оплаты",
    description:
      "Доход начисляется только за оплаченные подписки. Возвраты/чарджбэки аннулируют комиссию.",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Выводите прибыль",
    description:
      "Минимум 10000 Р, по запросу, только на расчётный счёт (ИП/юрлицо). Холд 14 дней.",
  },
]

// Mock данные для таблицы комиссий
const commissionLevels = [
  {
    level: "1-й",
    description: "Оплатившие подписку по вашей ссылке",
    commission: "30%",
  },
  {
    level: "2-й",
    description: "Клиенты, привлечённые вашими рефералами",
    commission: "10%",
  },
  {
    level: "3-й",
    description: "Клиенты партнёров второго уровня",
    commission: "5%",
  },
]

// Mock данные для важных условий
const importantConditions = [
  {
    id: 1,
    title: "Активная подписка партнёра",
    description:
      "Чтобы получать выплаты, у партнёра должна быть активная подписка MarketAI. При окончании подписки начисления фиксируются, но замораживаются до продления.",
  },
  {
    id: 2,
    title: "Burn через 90 дней",
    description:
      "Если подписка не возобновлена более 90 дней, реферальное дерево сгорает — связи и накопленные комиссии аннулируются.",
  },
  {
    id: 3,
    title: "Выплаты",
    description:
      "Минимум к выводу 10000 Р. Выплаты по запросу, только на расчётный счёт. Все суммы — в рублях.",
  },
  {
    id: 4,
    title: "Антифрод & KYC",
    description:
      "Перед первой выплатой — проверка КУС (ФИО, ИНН, реквизиты). Фрод, накрутки и спам приводят к блокировке и аннулированию комиссий.",
  },
]

// Mock данные для баннеров
const banners = [
  {
    id: 1,
    size: "728×90",
    type: "горизонтальный",
    width: 728,
    height: 90,
  },
  {
    id: 2,
    size: "300×250",
    type: "медиум-прямоугольник",
    width: 300,
    height: 250,
  },
  {
    id: 3,
    size: "1080×1080",
    type: "соцсети",
    width: 1080,
    height: 1080,
  },
]

export function ReferralAbout() {
  const handleBecomePartner = () => {
    // TODO: Обработка регистрации партнёра
    console.log("Стать партнёром")
  }

  const handleGetBanners = () => {
    // TODO: Обработка получения баннеров
    console.log("Получить баннеры")
  }

  const handleDownloadBanner = (bannerId: number) => {
    // TODO: Обработка скачивания баннера
    console.log(`Скачать баннер ${bannerId}`)
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Верхняя информационная панель */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-full bg-secondary/30 backdrop-blur-sm border border-border/30">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary" />
            <span className="text-sm sm:text-base font-semibold text-foreground">
              {commissionRates.level1}/{commissionRates.level2}/{commissionRates.level3}
            </span>
          </div>
          <Badge variant="outline" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full border-border/50 bg-transparent">
            Выплаты по запросу
          </Badge>
        </div>

        {/* Главный заголовок и описание */}
        <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-foreground block sm:inline">Делись. Расти. Зарабатывай</span>
              <br className="hidden sm:block" />
              <span className="text-primary block sm:inline">вместе с MarketAI.</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto sm:mx-0 leading-relaxed">
            Подключай предпринимателей к платформе автоматизации маркетплейсов и
            получай доход от их подписок до 3 уровней глубины. Начисления действуют,
            пока активна текущая оферта.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4 justify-center sm:justify-start">
            <Button
              onClick={handleBecomePartner}
              size="lg"
              className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              Стать партнёром
            </Button>
            <Button
              onClick={handleGetBanners}
              variant="outline"
              size="lg"
              className="border-2 border-border/50 hover:bg-secondary/50 hover:border-border transition-all duration-300 rounded-lg font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent"
            >
              Получить баннеры
            </Button>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50"></div>

        {/* Секция "Как это работает" */}
        <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Как это работает
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              4 простых шага запуска партнёрства.
            </p>
          </div>

          {/* Карточки шагов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step) => {
              const IconComponent = step.icon
              return (
                <Card
                  key={step.id}
                  className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-2 bg-card/50 border-border/50 group"
                >
                  <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">
                        {step.id}. {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50"></div>

        {/* Секция "Модель партнёрского дохода" */}
        <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Модель партнёрского дохода
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Комиссия начисляется, пока действует текущая оферта партнёрской программы.
            </p>
          </div>

          {/* Таблица комиссий */}
          <Card className="bg-card/50 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 hover:bg-transparent">
                    <TableHead className="h-14 px-4 sm:px-6 font-bold text-foreground">
                      Уровень
                    </TableHead>
                    <TableHead className="h-14 px-4 sm:px-6 font-bold text-foreground">
                      Кто это
                    </TableHead>
                    <TableHead className="h-14 px-4 sm:px-6 font-bold text-foreground text-right">
                      Комиссия
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionLevels.map((item, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <TableCell className="px-4 sm:px-6 py-4 sm:py-6 font-semibold text-foreground">
                        {item.level}
                      </TableCell>
                      <TableCell className="px-4 sm:px-6 py-4 sm:py-6 text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="px-4 sm:px-6 py-4 sm:py-6 text-right font-bold text-primary text-lg sm:text-xl">
                        {item.commission}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Примечание под таблицей */}
          <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            Каждое начисление проходит 14-дневный холд перед доступностью к выводу.
          </p>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50"></div>

        {/* Секция "Важные условия" */}
        <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Важные условия
            </h2>
          </div>

          {/* Карточки условий */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {importantConditions.map((condition) => (
              <Card
                key={condition.id}
                className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 bg-card/50 border-border/50"
              >
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {condition.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {condition.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50"></div>

        {/* Секция "Пример дохода" */}
        <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Пример дохода
            </h2>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8 md:p-10 space-y-6">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                10 пользователей × 5000 Р подписка = <span className="font-bold text-foreground">15000 Р/мес.</span> по 1-му уровню. Если один из них привёл 5 клиентов, вы получаете ещё <span className="font-bold text-foreground">2500 Р/мес.</span> по 2-му уровню. Третий уровень добавит 5% от оплат его сети.
              </p>
              <ul className="space-y-3 text-sm sm:text-base text-muted-foreground list-disc list-inside">
                <li>Начисления действуют, пока активна оферта.</li>
                <li>Комиссия начисляется только за оплаченные подписки.</li>
                <li>Возвраты/чарджбэки автоматически аннулируют комиссию.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border/50"></div>

        {/* Секция "Баннеры и промо-материалы" */}
        <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Баннеры и промо-материалы
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Мы подготовили для вас пример баннеров с вашей партнёрской ссылкой. Разместите их на сайте, в блоге или соцсетях и привлекайте новых пользователей.
            </p>
          </div>

          {/* Карточки баннеров */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {banners.map((banner) => (
              <Card
                key={banner.id}
                className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-600/10 border-border/50 hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6 sm:p-8 space-y-4">
                  {/* Плейсхолдер баннера */}
                  <div
                    className="w-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-purple-600/20 rounded-lg border border-primary/30 flex items-center justify-center relative overflow-hidden backdrop-blur-sm"
                    style={{
                      aspectRatio: `${banner.width}/${banner.height}`,
                      minHeight: banner.height <= 100 ? "60px" : banner.height <= 250 ? "150px" : "300px",
                    }}
                  >
                    {/* Текстура сетки */}
                    <div className="absolute inset-0 opacity-[0.03]">
                      <div 
                        className="absolute inset-0" 
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(255,255,255,0.1) 12px, rgba(255,255,255,0.1) 13px), repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.1) 12px, rgba(255,255,255,0.1) 13px)`,
                        }}
                      />
                    </div>
                    {/* Контент */}
                    <div className="relative z-10 text-center p-3 sm:p-4">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary/70 mb-1">
                        {banner.size}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground/80">
                        {banner.type}
                      </div>
                    </div>
                  </div>

                  {/* Информация и кнопка */}
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-foreground">
                        {banner.size}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        — {banner.type}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadBanner(banner.id)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 shrink-0"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Скачать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


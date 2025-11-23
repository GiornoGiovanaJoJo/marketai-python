import { useState } from "react"
import { Search, MapPin, ExternalLink, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Mock данные для партнеров
const partnersList = [
  {
    id: "1",
    name: "ООО «Фулфилмент Плюс»",
    specialization: "Фулфилмент",
    city: "Москва",
    rating: 4.8,
    ordersCount: 1250,
    status: "Активен",
  },
  {
    id: "2",
    name: "ИП Иванов Сергей",
    specialization: "Бухгалтер",
    city: "Санкт-Петербург",
    rating: 4.9,
    ordersCount: 890,
    status: "Активен",
  },
  {
    id: "3",
    name: "ООО «Экономика Про»",
    specialization: "Экономист",
    city: "Казань",
    rating: 4.7,
    ordersCount: 650,
    status: "Активен",
  },
  {
    id: "4",
    name: "Фулфилмент Центр",
    specialization: "Фулфилмент",
    city: "Краснодар",
    rating: 4.6,
    ordersCount: 420,
    status: "Активен",
  },
  {
    id: "5",
    name: "ИП Петрова Мария",
    specialization: "Дизайнер",
    city: "Новосибирск",
    rating: 5.0,
    ordersCount: 320,
    status: "Активен",
  },
  {
    id: "6",
    name: "ООО «Маркетинг Строй»",
    specialization: "Маркетолог",
    city: "Екатеринбург",
    rating: 4.5,
    ordersCount: 280,
    status: "Активен",
  },
  {
    id: "7",
    name: "Фулфилмент Север",
    specialization: "Фулфилмент",
    city: "Мурманск",
    rating: 4.4,
    ordersCount: 195,
    status: "Активен",
  },
  {
    id: "8",
    name: "ИП Сидоров Алексей",
    specialization: "Менеджер маркетплейсов",
    city: "Ростов-на-Дону",
    rating: 4.8,
    ordersCount: 540,
    status: "Активен",
  },
]

// Mock данные для фулфилментов на карте
const fulfillmentPoints = [
  {
    id: "1",
    name: "Фулфилмент Плюс",
    address: "Москва, ул. Ленина, д. 10",
    lat: 55.7558,
    lon: 37.6173,
    rating: 4.8,
    ordersCount: 1250,
  },
  {
    id: "2",
    name: "Фулфилмент Центр",
    address: "Краснодар, ул. Красная, д. 25",
    lat: 45.0328,
    lon: 38.9749,
    rating: 4.6,
    ordersCount: 420,
  },
  {
    id: "3",
    name: "Фулфилмент Север",
    address: "Мурманск, пр. Ленина, д. 45",
    lat: 68.9585,
    lon: 33.0827,
    rating: 4.4,
    ordersCount: 195,
  },
  {
    id: "4",
    name: "Фулфилмент Юг",
    address: "Сочи, ул. Навагинская, д. 12",
    lat: 43.6028,
    lon: 39.7342,
    rating: 4.7,
    ordersCount: 310,
  },
]

export function Partners() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")

  const specializations = [
    "Все",
    "Фулфилмент",
    "Бухгалтер",
    "Экономист",
    "Дизайнер",
    "Маркетолог",
    "Менеджер маркетплейсов",
  ]

  const filteredPartners = partnersList.filter((partner) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !partner.name.toLowerCase().includes(query) &&
        !partner.city.toLowerCase().includes(query) &&
        !partner.specialization.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (selectedSpecialization !== "all") {
      if (partner.specialization !== selectedSpecialization) {
        return false
      }
    }
    return true
  })

  const handleOpenMap = (point: typeof fulfillmentPoints[0]) => {
    // Формируем URL для Яндекс карт с поиском по адресу
    const searchQuery = encodeURIComponent(point.address)
    const url = `https://yandex.ru/maps/?pt=${point.lon},${point.lat}&z=15&text=${searchQuery}`
    window.open(url, "_blank")
    toast({
      title: "Открыта карта",
      description: `Открыта карта для ${point.name}`,
      variant: "default",
    })
  }

  // Формирование URL для Яндекс карт с метками
  const getYandexMapUrl = () => {
    const points = fulfillmentPoints
      .map((point) => `${point.lon},${point.lat}`)
      .join("~")
    const centerLat =
      fulfillmentPoints.reduce((sum, p) => sum + p.lat, 0) /
      fulfillmentPoints.length
    const centerLon =
      fulfillmentPoints.reduce((sum, p) => sum + p.lon, 0) /
      fulfillmentPoints.length

    // Используем Яндекс карты с метками
    return `https://yandex.ru/maps/?ll=${centerLon},${centerLat}&z=5&pt=${points}`
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 md:mt-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
              Партнёры
            </h1>
          </div>
        </div>

        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-transparent border-0 p-0 gap-2">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
            >
              Список
            </TabsTrigger>
            <TabsTrigger
              value="fulfillment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-card/50"
            >
              Партнеры на карте
            </TabsTrigger>
          </TabsList>

          {/* Вкладка Список */}
          <TabsContent value="list" className="space-y-4 sm:space-y-6 mt-6">
            {/* Фильтры */}
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск по имени, городу, специализации..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {specializations.map((spec) => (
                      <Button
                        key={spec}
                        variant={
                          selectedSpecialization === spec ? "default" : "outline"
                        }
                        onClick={() =>
                          setSelectedSpecialization(
                            spec === "Все" ? "all" : spec
                          )
                        }
                        className="whitespace-nowrap"
                      >
                        {spec}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Карточки партнеров */}
            {filteredPartners.length === 0 ? (
              <Card className="glass-effect">
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    Партнёры не найдены
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((partner) => (
                  <Card key={partner.id} className="glass-effect">
                    <CardHeader>
                      <CardTitle className="text-base">{partner.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {partner.specialization}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{partner.city}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm">⭐ {partner.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          {partner.ordersCount} заказов
                        </span>
                      </div>
                      <div className="pt-2">
                        <Badge
                          variant={
                            partner.status === "Активен"
                              ? "success"
                              : "default"
                          }
                        >
                          {partner.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Вкладка Фулфилмент */}
          <TabsContent
            value="fulfillment"
            className="space-y-4 sm:space-y-6 mt-6"
          >
            {/* Карта */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">
                  Фулфилменты на карте
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border relative bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:from-blue-950/20 dark:to-purple-950/20 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        Интерактивная карта фулфилментов
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        На карте отмечено {fulfillmentPoints.length} фулфилментов.
                        Откройте карту для просмотра всех точек и получения подробной информации.
                      </p>
                    </div>
                    <Button
                      onClick={() => window.open(getYandexMapUrl(), "_blank")}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Открыть карту в Яндекс.Картах
                    </Button>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground">
                        Или выберите конкретный фулфилмент ниже для перехода на карту
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Список фулфилментов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fulfillmentPoints.map((point) => (
                <Card key={point.id} className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-base">{point.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {point.address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">⭐ {point.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        {point.ordersCount} заказов
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenMap(point)}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Открыть на карте
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


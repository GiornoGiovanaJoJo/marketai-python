import { useState } from "react"
import { Search, MoreVertical, HelpCircle, RefreshCw, Building2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock данные для юрлиц
const mockLegalEntities = [
  {
    id: "1",
    name: "ИП Васильев Роман Евгеньевич",
    inn: "123456789012",
    mainAccount: "Сбер - 004312",
    accountsCount: 2,
    contactsCount: 2,
    isDefault: true,
  },
  {
    id: "2",
    name: "ООО «MarketAI»",
    inn: "7700000000",
    mainAccount: "Альфа-Банк - 001234",
    accountsCount: 1,
    contactsCount: 1,
    isDefault: false,
  },
]

// Mock данные для маркетплейсов
const mockMarketplaces = [
  {
    id: "1",
    name: "Wildberries",
    status: "Активен",
    legalEntity: "ИП Васильев Роман Евгеньевич",
    legalEntityId: "1",
  },
]

// Mock данные для подключений маркетплейсов выбранного юрлица
const mockLegalEntityConnections = [
  {
    id: "1",
    marketplace: "Wildberries",
    account: "WB-123456",
    status: "Активен",
    lastSync: "2024-01-15 14:30",
    productsCount: 150,
  },
  {
    id: "2",
    marketplace: "Ozon",
    account: "OZ-789012",
    status: "Активен",
    lastSync: "2024-01-15 12:15",
    productsCount: 89,
  },
  {
    id: "3",
    marketplace: "Яндекс.Маркет",
    account: "YM-345678",
    status: "Ошибка",
    lastSync: "2024-01-14 18:45",
    productsCount: 42,
  },
]

// Mock данные для фильтров
const mockLegalEntitiesForFilter = [
  { id: "all", name: "Все" },
  ...mockLegalEntities.map((e) => ({ id: e.id, name: e.name })),
]

const mockMarketplaceTypes = [
  { id: "all", name: "Все" },
  { id: "wb", name: "Wildberries" },
  { id: "ozon", name: "Ozon" },
  { id: "ym", name: "Яндекс.Маркет" },
]

const mockStatuses = [
  { id: "all", name: "Все" },
  { id: "active", name: "Активен" },
  { id: "inactive", name: "Неактивен" },
  { id: "error", name: "Ошибка" },
]

export function Organization() {
  const { toast } = useToast()
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<string | null>(
    "1"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [legalEntityFilter, setLegalEntityFilter] = useState("all")
  const [marketplaceFilter, setMarketplaceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const handleUpdateStatuses = () => {
    toast({
      title: "Обновление статусов",
      description: "Статусы обновляются...",
      variant: "default",
    })
  }

  const handleAddLegalEntity = () => {
    toast({
      title: "Добавление юрлица",
      description: "Форма добавления нового юридического лица",
      variant: "default",
    })
  }

  const handleAddConnection = () => {
    toast({
      title: "Добавление подключения",
      description: "Форма добавления нового подключения",
      variant: "default",
    })
  }

  const handleHelp = () => {
    toast({
      title: "Справка",
      description: "Открывается справка по работе с системой",
      variant: "default",
    })
  }

  const filteredLegalEntities = mockLegalEntities.filter((entity) => {
    if (showArchived) return true
    if (searchQuery) {
      return entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const filteredMarketplaces = mockMarketplaces.filter((mp) => {
    if (legalEntityFilter !== "all" && mp.legalEntityId !== legalEntityFilter)
      return false
    if (marketplaceFilter !== "all") return false // Можно расширить
    if (statusFilter !== "all") return false // Можно расширить
    return true
  })

  const paginatedLegalEntities = filteredLegalEntities.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const selectedEntity = mockLegalEntities.find(
    (e) => e.id === selectedLegalEntity
  )

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Заголовок с кнопками */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-12 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">Моя организация</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleUpdateStatuses}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              ОБНОВИТЬ СТАТУСЫ
            </Button>
            <Button variant="default" onClick={handleHelp} className="gap-2">
              <HelpCircle className="h-4 w-4" />
              СПРАВКА
            </Button>
          </div>
        </div>

        {/* Вкладки */}
        <Tabs defaultValue="legal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="legal" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              ЮРЛИЦА
            </TabsTrigger>
            <TabsTrigger value="marketplaces" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
              МАРКЕТПЛЕЙСЫ
            </TabsTrigger>
          </TabsList>

          {/* Вкладка ЮРЛИЦА */}
          <TabsContent value="legal" className="space-y-4 mt-4">
            {/* Поиск и фильтры */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по юрлицам"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <label
                  htmlFor="archived"
                  className="text-sm font-medium cursor-pointer"
                >
                  Показывать архивные
                </label>
              </div>
              <Button onClick={handleAddLegalEntity} className="gap-2">
                ДОБАВИТЬ ЮРЛИЦО
              </Button>
            </div>

            {/* Таблица юрлиц */}
            <div className="rounded-lg border glass-effect overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>ИНН</TableHead>
                    <TableHead>Основной счет</TableHead>
                    <TableHead>Счета</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>По умолчанию</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLegalEntities.map((entity) => {
                    const isSelected = selectedLegalEntity === entity.id
                    return (
                      <TableRow
                        key={entity.id}
                        className={`cursor-pointer ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedLegalEntity(entity.id)}
                      >
                        <TableCell className="font-medium">
                          {entity.name}
                        </TableCell>
                        <TableCell>{entity.inn}</TableCell>
                        <TableCell>{entity.mainAccount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{entity.accountsCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{entity.contactsCount}</Badge>
                        </TableCell>
                        <TableCell>
                          {entity.isDefault ? (
                            <Badge variant="success">По умолчанию</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem>Архивировать</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {Math.min((currentPage - 1) * rowsPerPage + 1, filteredLegalEntities.length)}-
                  {Math.min(currentPage * rowsPerPage, filteredLegalEntities.length)} of{" "}
                  {filteredLegalEntities.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(
                          Math.ceil(filteredLegalEntities.length / rowsPerPage),
                          p + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >=
                      Math.ceil(filteredLegalEntities.length / rowsPerPage)
                    }
                  >
                    →
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Вкладка МАРКЕТПЛЕЙСЫ */}
          <TabsContent value="marketplaces" className="space-y-4 mt-4">
            {/* Фильтры */}
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={legalEntityFilter} onValueChange={setLegalEntityFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Фильтр по юрлицу" />
                </SelectTrigger>
                <SelectContent>
                  {mockLegalEntitiesForFilter.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Маркетплейс" />
                </SelectTrigger>
                <SelectContent>
                  {mockMarketplaceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  {mockStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            {/* Таблица маркетплейсов */}
            <div className="rounded-lg border glass-effect overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Юрлицо</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarketplaces.map((marketplace) => (
                    <TableRow key={marketplace.id}>
                      <TableCell className="font-medium">
                        {marketplace.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{marketplace.status}</Badge>
                      </TableCell>
                      <TableCell>{marketplace.legalEntity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Редактировать</DropdownMenuItem>
                            <DropdownMenuItem>Отключить</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Rows per page:
                </span>
                <Select value="5" onValueChange={() => {}}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">
                  1-1 of 1
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" disabled>
                    ←
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    →
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Секция подключений маркетплейсов выбранного юрлица */}
        {selectedEntity && (
          <div className="rounded-lg border glass-effect p-6 space-y-4 connections-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-3 gradient-text">
                  Подключения маркетплейсов у выбранного юрлица
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">{selectedEntity.name}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {selectedEntity.inn}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={handleAddConnection} 
                className="gap-2 glow-effect"
                size="lg"
              >
                ДОБАВИТЬ ПОДКЛЮЧЕНИЕ
              </Button>
            </div>

            {/* Таблица подключений */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Маркетплейс</TableHead>
                    <TableHead>Аккаунт</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Последняя синхронизация</TableHead>
                    <TableHead>Товаров</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLegalEntityConnections.map((connection) => (
                    <TableRow key={connection.id}>
                      <TableCell className="font-medium">
                        {connection.marketplace}
                      </TableCell>
                      <TableCell>{connection.account}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            connection.status === "Активен"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {connection.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {connection.lastSync}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {connection.productsCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Редактировать</DropdownMenuItem>
                            <DropdownMenuItem>Синхронизировать</DropdownMenuItem>
                            <DropdownMenuItem>Отключить</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Rows per page:
                </span>
                <Select value="5" onValueChange={() => {}}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">
                  1-{mockLegalEntityConnections.length} of{" "}
                  {mockLegalEntityConnections.length}
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" disabled>
                    ←
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

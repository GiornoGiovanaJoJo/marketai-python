import { useState, useEffect } from 'react'
import { Plus, Filter, Search, Edit, Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { api, Campaign, Marketplace, CampaignStatus } from '@/lib/api'

const marketplaceLabels: Record<Marketplace, string> = {
  [Marketplace.Wildberries]: 'Wildberries',
  [Marketplace.Ozon]: 'Ozon',
  [Marketplace.YandexMarket]: 'Яндекс Маркет',
}

const statusLabels: Record<CampaignStatus, string> = {
  [CampaignStatus.Inactive]: 'Неактивна',
  [CampaignStatus.Active]: 'Активна',
}

export function Campaigns() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMarketplace, setFilterMarketplace] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  // Форма для создания/редактирования
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    marketplace: Marketplace.Wildberries,
  })

  // Загрузка кампаний
  useEffect(() => {
    loadCampaigns()
  }, [])

  // Фильтрация кампаний
  useEffect(() => {
    let filtered = [...campaigns]

    // Поиск по имени
    if (searchQuery) {
      filtered = filtered.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Фильтр по маркетплейсу
    if (filterMarketplace !== 'all') {
      filtered = filtered.filter(
        (campaign) => campaign.marketplace === Number(filterMarketplace)
      )
    }

    // Фильтр по статусу
    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (campaign) => campaign.status === Number(filterStatus)
      )
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, searchQuery, filterMarketplace, filterStatus])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await api.getCampaigns()
      data.forEach(el => {
        el.key = "";
      })
      setCampaigns(data)
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить кампании',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await api.createCampaign({
        name: formData.name,
        key: formData.key,
        marketplace: formData.marketplace,
      })

      toast({
        title: 'Успешно',
        description: 'Кампания создана',
      })

      setIsCreateDialogOpen(false)
      setFormData({ name: '', key: '', marketplace: Marketplace.Wildberries })
      loadCampaigns()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать кампанию',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedCampaign) return

    try {
      await api.updateCampaign(selectedCampaign.id, {
        name: formData.name,
        key: formData.key,
        marketplace: formData.marketplace,
      })

      toast({
        title: 'Успешно',
        description: 'Кампания обновлена',
      })

      setIsEditDialogOpen(false)
      setSelectedCampaign(null)
      setFormData({ name: '', key: '', marketplace: Marketplace.Wildberries })
      loadCampaigns()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить кампанию',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (campaignId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту кампанию?')) return

    try {
      await api.deleteCampaign(campaignId)

      toast({
        title: 'Успешно',
        description: 'Кампания удалена',
      })

      loadCampaigns()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить кампанию',
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = async (campaign: Campaign) => {
    try {
      const newStatus =
        campaign.status === CampaignStatus.Active
          ? CampaignStatus.Inactive
          : CampaignStatus.Active

      await api.updateCampaign(campaign.id, { status: newStatus })

      toast({
        title: 'Успешно',
        description: `Кампания ${newStatus === CampaignStatus.Active ? 'активирована' : 'деактивирована'}`,
      })

      loadCampaigns()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус кампании',
        variant: 'destructive',
      })
    }
  }

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setFormData({
      name: campaign.name,
      key: campaign.key,
      marketplace: campaign.marketplace,
    })
    setIsEditDialogOpen(true)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setFilterMarketplace('all')
    setFilterStatus('all')
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Кампании</h1>
          <p className="text-gray-400">Управление рекламными кампаниями</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Plus className="mr-2 h-4 w-4" />
              Создать кампанию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать кампанию</DialogTitle>
              <DialogDescription>
                Введите данные для новой рекламной кампании
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Название</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Название кампании"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">API ключ</label>
                <Input
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="API ключ маркетплейса"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Маркетплейс</label>
                <Select
                  value={String(formData.marketplace)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, marketplace: Number(value) as Marketplace })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(Marketplace.Wildberries)}>
                      Wildberries
                    </SelectItem>
                    <SelectItem value={String(Marketplace.Ozon)}>Ozon</SelectItem>
                    <SelectItem value={String(Marketplace.YandexMarket)}>
                      Яндекс Маркет
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">
                Создать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры */}
      <Card className="mb-6 bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Filter className="mr-2 h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="pl-10"
              />
            </div>

            <Select value={filterMarketplace} onValueChange={setFilterMarketplace}>
              <SelectTrigger>
                <SelectValue placeholder="Маркетплейс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все маркетплейсы</SelectItem>
                <SelectItem value={String(Marketplace.Wildberries)}>
                  Wildberries
                </SelectItem>
                <SelectItem value={String(Marketplace.Ozon)}>Ozon</SelectItem>
                <SelectItem value={String(Marketplace.YandexMarket)}>
                  Яндекс Маркет
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value={String(CampaignStatus.Active)}>Активна</SelectItem>
                <SelectItem value={String(CampaignStatus.Inactive)}>Неактивна</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters}>
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список кампаний */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">Кампании не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white mb-2">{campaign.name}</CardTitle>
                    <CardDescription>
                      {marketplaceLabels[campaign.marketplace]}
                    </CardDescription>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === CampaignStatus.Active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {statusLabels[campaign.status]}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(campaign)}
                      className="flex-1"
                    >
                      {campaign.status === CampaignStatus.Active ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Деактивировать
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Активировать
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(campaign)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать кампанию</DialogTitle>
            <DialogDescription>
              Измените данные рекламной кампании
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Название</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Название кампании"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">API ключ</label>
              <Input
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="API ключ маркетплейса"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Маркетплейс</label>
              <Select
                value={String(formData.marketplace)}
                onValueChange={(value) =>
                  setFormData({ ...formData, marketplace: Number(value) as Marketplace })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(Marketplace.Wildberries)}>
                    Wildberries
                  </SelectItem>
                  <SelectItem value={String(Marketplace.Ozon)}>Ozon</SelectItem>
                  <SelectItem value={String(Marketplace.YandexMarket)}>
                    Яндекс Маркет
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEdit} className="w-full">
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

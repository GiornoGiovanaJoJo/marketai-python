import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/components/ui/use-toast"

export function ReferralSettings() {
  const { toast } = useToast()

  // Mock данные для формы
  const [formData, setFormData] = useState({
    type: "ИП",
    inn: "7700000000",
    companyName: "Иванов И.И. / ООО «МаркетАИ»",
    kpp: "",
    ogrn: "",
    bank: "ПАО Сбербанк",
    bik: "044525225",
    currentAccount: "40702...",
    correspondentAccount: "30101...",
    emailForActs: "billing@company.ru",
  })

  // Обработка изменения полей
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Сохранение реквизитов
  const handleSave = () => {
    // TODO: Обработка сохранения реквизитов
    toast({
      title: "Реквизиты сохранены",
      description: "Реквизиты успешно сохранены",
    })
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Заголовок */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Настройки
          </h1>
        </div>

        {/* Форма */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Левая колонка */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Тип
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ИП">ИП</SelectItem>
                      <SelectItem value="ООО">ООО</SelectItem>
                      <SelectItem value="ЗАО">ЗАО</SelectItem>
                      <SelectItem value="ОАО">ОАО</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    ИНН
                  </label>
                  <Input
                    type="text"
                    value={formData.inn}
                    onChange={(e) => handleChange("inn", e.target.value)}
                    placeholder="Введите ИНН"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Банк
                  </label>
                  <Input
                    type="text"
                    value={formData.bank}
                    onChange={(e) => handleChange("bank", e.target.value)}
                    placeholder="Введите название банка"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Расчётный счёт
                  </label>
                  <Input
                    type="text"
                    value={formData.currentAccount}
                    onChange={(e) =>
                      handleChange("currentAccount", e.target.value)
                    }
                    placeholder="Введите расчётный счёт"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email для актов
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={formData.emailForActs}
                      onChange={(e) =>
                        handleChange("emailForActs", e.target.value)
                      }
                      placeholder="Введите email"
                      className="flex-1"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                        <DropdownMenuItem>Удалить</DropdownMenuItem>
                        <DropdownMenuItem>Отправить тестовое письмо</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Правая колонка */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Название компании / ФИО
                  </label>
                  <Input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                    placeholder="Введите название компании или ФИО"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    КПП
                  </label>
                  <Input
                    type="text"
                    value={formData.kpp}
                    onChange={(e) => handleChange("kpp", e.target.value)}
                    placeholder="(для ООО)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    ОГРН / ОГРНИП
                  </label>
                  <Input
                    type="text"
                    value={formData.ogrn}
                    onChange={(e) => handleChange("ogrn", e.target.value)}
                    placeholder="Введите ОГРН или ОГРНИП"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    БИК
                  </label>
                  <Input
                    type="text"
                    value={formData.bik}
                    onChange={(e) => handleChange("bik", e.target.value)}
                    placeholder="Введите БИК"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Корр. счёт
                  </label>
                  <Input
                    type="text"
                    value={formData.correspondentAccount}
                    onChange={(e) =>
                      handleChange("correspondentAccount", e.target.value)
                    }
                    placeholder="Введите корреспондентский счёт"
                  />
                </div>
              </div>
            </div>

            {/* Кнопка сохранения */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50">
              <Button
                onClick={handleSave}
                size="lg"
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Сохранить реквизиты
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}






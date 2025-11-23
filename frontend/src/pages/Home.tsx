import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export function Home() {
  const navigate = useNavigate()
  const wizardSteps = [
    {
      id: "connect",
      title: "Подключите маркетплейсы",
      description: "Авторизуйтесь в кабинетах WB, Ozon и Яндекс Маркета",
    },
    {
      id: "sync",
      title: "Настройте синхронизацию",
      description: "Выберите период загрузки и включите автоматическое обновление данных",
    },
    {
      id: "roles",
      title: "Добавьте команду",
      description: "Пригласите коллег и распределите роли для совместной работы",
    },
  ]
  // Состояние активного шага мастера
  const [activeStep, setActiveStep] = useState(0)
  // Состояние чек-листа готовности данных
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    credentials: false,
    catalogs: false,
    finances: false,
    logistics: false,
  })

  const handleStartWork = () => {
    navigate("/login")
  }

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, wizardSteps.length - 1))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleChecklistToggle = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const checklistItems = [
    { key: "credentials", label: "Доступы к кабинетам продавца подтверждены" },
    { key: "catalogs", label: "Каталог товаров синхронизирован и сегментирован" },
    { key: "finances", label: "Финансовые отчеты загружаются корректно" },
    { key: "logistics", label: "Остатки и логистика обновляются ежедневно" },
  ] as const

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      {/* Hero секция */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              MarketAI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Футуристичная платформа для управления маркетплейсом с искусственным интеллектом
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" onClick={handleStartWork}>
                Начать работу
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Wizard подключения маркетплейсов */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="glass-effect border border-border/40">
              <CardHeader>
                <CardTitle>Шаги подключения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Прогресс по шагам */}
                <div className="space-y-2">
                  <Progress value={((activeStep + 1) / wizardSteps.length) * 100} />
                  <p className="text-sm text-muted-foreground">
                    Шаг {activeStep + 1} из {wizardSteps.length}
                  </p>
                </div>
                {/* Список шагов */}
                <div className="space-y-4">
                  {wizardSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "p-4 rounded-xl border transition-colors",
                        index === activeStep
                          ? "border-primary/60 bg-primary/5 shadow-sm"
                          : "border-border/40 bg-background/60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", index <= activeStep ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/80")}>
                          {index < activeStep ? "Готово" : index === activeStep ? "В работе" : "Далее"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Управление мастером */}
                <div className="flex flex-wrap gap-2 justify-between">
                  <Button variant="outline" size="sm" onClick={handlePrevStep} disabled={activeStep === 0}>
                    Назад
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveStep(0)}>
                      Сбросить
                    </Button>
                    {activeStep === wizardSteps.length - 1 ? (
                      <Button size="sm" onClick={handleStartWork}>
                        Перейти к дашборду
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleNextStep}>
                        Далее
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Чек-лист готовности данных */}
            <Card className="glass-effect border border-border/40">
              <CardHeader>
                <CardTitle>Чек-лист готовности данных</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Отметьте пункты, чтобы убедиться, что данные готовы к аналитике.
                </p>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                      <Checkbox
                        checked={checklist[item.key]}
                        onCheckedChange={() => handleChecklistToggle(item.key)}
                        className="mt-0.5"
                      />
                      <span className="text-sm leading-tight">{item.label}</span>
                    </label>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleStartWork}
                  disabled={!Object.values(checklist).every(Boolean)}
                >
                  Открыть рабочую область
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Функции */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 gradient-text">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: "Управленка",
                description: "Полный контроль над бизнес-процессами с AI-аналитикой",
                icon: "📊",
              },
              {
                title: "Генератор контента",
                description: "Создавайте уникальный контент с помощью искусственного интеллекта",
                icon: "✨",
              },
              {
                title: "Реферальная программа",
                description: "Приглашайте партнеров и получайте пассивный доход",
                icon: "🤝",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl glass-effect border border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg glow-effect"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl glass-effect border border-border/40 glow-effect">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Готовы начать?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Присоединяйтесь к тысячам предпринимателей, которые уже используют MarketAI
            </p>
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" onClick={handleStartWork}>
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


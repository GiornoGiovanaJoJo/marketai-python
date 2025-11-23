import { useState } from "react"
import { Settings, Plus, Save, Sparkles, X, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock данные для метрик
const metrics = [
  { id: "ctr", name: "CTR" },
  { id: "redemption", name: "Выкуп" },
  { id: "rating", name: "Рейтинг" },
  { id: "localization", name: "Локализация" },
  { id: "sales", name: "Продажи" },
  { id: "stock", name: "Остаток" },
]

// Mock данные для операторов
const operators = [
  { id: "gt", name: ">", symbol: ">" },
  { id: "lt", name: "<", symbol: "<" },
  { id: "gte", name: "≥", symbol: "≥" },
  { id: "lte", name: "≤", symbol: "≤" },
  { id: "eq", name: "=", symbol: "=" },
  { id: "down", name: "↓", symbol: "↓" },
  { id: "up", name: "↑", symbol: "↑" },
]

// Mock данные для временных периодов
const timePeriods = [
  { id: "days", name: "дня" },
  { id: "hours", name: "часа" },
  { id: "weeks", name: "недели" },
  { id: "months", name: "месяца" },
]

// Mock данные для действий
const actions = [
  { id: "create-task", name: "Создать задачу" },
  { id: "send-notification", name: "Отправить уведомление" },
  { id: "update-price", name: "Обновить цену" },
  { id: "change-status", name: "Изменить статус" },
]

// Mock данные для задач
const taskTypes = [
  { id: "check-photo", name: "Проверить фото" },
  { id: "check-price", name: "Проверить цену" },
  { id: "check-delivery", name: "Проверить доставку" },
  { id: "replenish-stock", name: "Пополнить сток" },
  { id: "update-content", name: "Обновить контент" },
]

// Mock данные для исполнителей
const assignees = [
  { id: "content-manager", name: "Контент-менеджер" },
  { id: "sales-manager", name: "Менеджер продаж" },
  { id: "logistician", name: "Логист" },
  { id: "marketer", name: "Маркетолог" },
]

// Mock данные для приоритетов
const priorities = [
  { id: "high", name: "Высокий" },
  { id: "medium", name: "Средний" },
  { id: "low", name: "Низкий" },
  { id: "critical", name: "Критичный" },
]

interface RuleCondition {
  id: string
  metric: string
  operator: string
  value: string
  trend?: string
  period?: string
  periodValue?: string
}

interface RuleAction {
  id: string
  action: string
  taskType?: string
  assignee: string
  priority: string
}

interface AutomationRule {
  id: string
  conditions: RuleCondition[]
  actions: RuleAction[]
}

// Mock данные для активных автоматизаций
const mockActiveRules = [
  {
    id: "1",
    description:
      "CTR ↓ > 20% за 3 дня → создать задачу «Проверить фото» Контент-менеджеру (Приоритет: высокий)",
  },
  {
    id: "2",
    description:
      "Выкуп ↓ < 80% → задача «Проверить цену и доставку» Менеджеру продаж (Приоритет: средний)",
  },
  {
    id: "3",
    description:
      "Локализация < 85% → задача «Пополнить сток в Казани» Логисту (Приоритет: критичный)",
  },
]

export function Automation() {
  const { toast } = useToast()
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      conditions: [
        {
          id: "c1",
          metric: "ctr",
          operator: "down",
          value: "20",
          trend: "down",
          period: "days",
          periodValue: "3",
        },
      ],
      actions: [
        {
          id: "a1",
          action: "create-task",
          taskType: "check-photo",
          assignee: "content-manager",
          priority: "high",
        },
      ],
    },
  ])

  const [activeRules, setActiveRules] = useState(mockActiveRules)

  const addCondition = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              conditions: [
                ...rule.conditions,
                {
                  id: `c${Date.now()}`,
                  metric: "ctr",
                  operator: "gt",
                  value: "",
                },
              ],
            }
          : rule
      )
    )
  }

  const removeCondition = (ruleId: string, conditionId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              conditions: rule.conditions.filter((c) => c.id !== conditionId),
            }
          : rule
      )
    )
  }

  const updateCondition = (
    ruleId: string,
    conditionId: string,
    field: string,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              conditions: rule.conditions.map((c) =>
                c.id === conditionId ? { ...c, [field]: value } : c
              ),
            }
          : rule
      )
    )
  }

  const addAction = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              actions: [
                ...rule.actions,
                {
                  id: `a${Date.now()}`,
                  action: "create-task",
                  assignee: "content-manager",
                  priority: "medium",
                },
              ],
            }
          : rule
      )
    )
  }

  const removeAction = (ruleId: string, actionId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              actions: rule.actions.filter((a) => a.id !== actionId),
            }
          : rule
      )
    )
  }

  const updateAction = (
    ruleId: string,
    actionId: string,
    field: string,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              actions: rule.actions.map((a) =>
                a.id === actionId ? { ...a, [field]: value } : a
              ),
            }
          : rule
      )
    )
  }

  const addRuleLevel = () => {
    setRules((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        conditions: [
          {
            id: `c${Date.now()}`,
            metric: "ctr",
            operator: "gt",
            value: "",
          },
        ],
        actions: [
          {
            id: `a${Date.now()}`,
            action: "create-task",
            assignee: "content-manager",
            priority: "medium",
          },
        ],
      },
    ])
  }

  const removeRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId))
  }

  const handleSaveAndActivate = () => {
    // Генерируем описание правила
    const rule = rules[0]
    if (rule) {
      const condition = rule.conditions[0]
      const action = rule.actions[0]

      const metricName =
        metrics.find((m) => m.id === condition.metric)?.name || ""
      const operatorSymbol =
        operators.find((o) => o.id === condition.operator)?.symbol || ""
      const periodText =
        timePeriods.find((p) => p.id === condition.period)?.name || ""
      const taskTypeName =
        taskTypes.find((t) => t.id === action.taskType)?.name || ""
      const assigneeName =
        assignees.find((a) => a.id === action.assignee)?.name || ""
      const priorityName =
        priorities.find((p) => p.id === action.priority)?.name || ""

      const description = `${metricName} ${operatorSymbol} ${condition.value}%${
        condition.periodValue
          ? ` за ${condition.periodValue} ${periodText}`
          : ""
      } → создать задачу «${taskTypeName}» ${assigneeName} (Приоритет: ${priorityName})`

      setActiveRules((prev) => [
        ...prev,
        {
          id: `new-${Date.now()}`,
          description,
        },
      ])

      toast({
        title: "Правило сохранено",
        description: "Правило автоматизации успешно сохранено и активировано",
        variant: "success",
      })
    }
  }

  const removeActiveRule = (ruleId: string) => {
    setActiveRules((prev) => prev.filter((r) => r.id !== ruleId))
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Секция Конструктор правил */}
        <div className="space-y-4">
          {/* Заголовок */}
          <div className="space-y-2 mt-12 md:mt-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                Конструктор правил
              </h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Создавайте многоуровневые правила автоматизации: ИИ анализирует
              метрики и ставит задачи автоматически.
            </p>
          </div>

          {/* Правила */}
          <div className="space-y-4">
            {rules.map((rule, ruleIndex) => (
              <Card key={rule.id} className="glass-effect automation-rule-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Правило {ruleIndex + 1}
                    </CardTitle>
                    {rules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRule(rule.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Блок ЕСЛИ */}
                  <div className="space-y-3 automation-block">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="px-3 py-1 text-sm">
                        ЕСЛИ
                      </Badge>
                    </div>
                    <div className="space-y-3 pl-4">
                      {rule.conditions.map((condition, conditionIndex) => (
                        <div
                          key={condition.id}
                          className="flex items-center gap-2 flex-wrap"
                        >
                          {conditionIndex > 0 && (
                            <span className="text-sm font-medium text-muted-foreground px-2">
                              и
                            </span>
                          )}
                          <Select
                            value={condition.metric}
                            onValueChange={(value) =>
                              updateCondition(rule.id, condition.id, "metric", value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {metrics.map((metric) => (
                                <SelectItem key={metric.id} value={metric.id}>
                                  {metric.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value) =>
                              updateCondition(rule.id, condition.id, "operator", value)
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.id} value={op.id}>
                                  {op.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            placeholder="20"
                            value={condition.value}
                            onChange={(e) =>
                              updateCondition(
                                rule.id,
                                condition.id,
                                "value",
                                e.target.value
                              )
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>

                          {condition.operator === "down" ||
                          condition.operator === "up" ? (
                            <>
                              <span className="text-sm text-muted-foreground">
                                за
                              </span>
                              <Input
                                type="number"
                                placeholder="3"
                                value={condition.periodValue || ""}
                                onChange={(e) =>
                                  updateCondition(
                                    rule.id,
                                    condition.id,
                                    "periodValue",
                                    e.target.value
                                  )
                                }
                                className="w-16"
                              />
                              <Select
                                value={condition.period || "days"}
                                onValueChange={(value) =>
                                  updateCondition(
                                    rule.id,
                                    condition.id,
                                    "period",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {timePeriods.map((period) => (
                                    <SelectItem key={period.id} value={period.id}>
                                      {period.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </>
                          ) : null}

                          {rule.conditions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCondition(rule.id, condition.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCondition(rule.id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Добавить условие
                      </Button>
                    </div>
                  </div>

                  {/* Блок ТО */}
                  <div className="space-y-3 automation-block">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="px-3 py-1 text-sm">
                        ТО
                      </Badge>
                    </div>
                    <div className="space-y-3 pl-4">
                      {rule.actions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center gap-2 flex-wrap"
                        >
                          <Select
                            value={action.action}
                            onValueChange={(value) =>
                              updateAction(rule.id, action.id, "action", value)
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actions.map((act) => (
                                <SelectItem key={act.id} value={act.id}>
                                  {act.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {action.action === "create-task" && (
                            <>
                              <Select
                                value={action.taskType || ""}
                                onValueChange={(value) =>
                                  updateAction(rule.id, action.id, "taskType", value)
                                }
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue placeholder="Тип задачи" />
                                </SelectTrigger>
                                <SelectContent>
                                  {taskTypes.map((task) => (
                                    <SelectItem key={task.id} value={task.id}>
                                      {task.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <span className="text-sm text-muted-foreground">
                                Исполнитель
                              </span>
                              <Select
                                value={action.assignee}
                                onValueChange={(value) =>
                                  updateAction(rule.id, action.id, "assignee", value)
                                }
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {assignees.map((assignee) => (
                                    <SelectItem key={assignee.id} value={assignee.id}>
                                      {assignee.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <span className="text-sm text-muted-foreground">
                                Приоритет
                              </span>
                              <Select
                                value={action.priority}
                                onValueChange={(value) =>
                                  updateAction(rule.id, action.id, "priority", value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {priorities.map((priority) => (
                                    <SelectItem key={priority.id} value={priority.id}>
                                      {priority.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </>
                          )}

                          {rule.actions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAction(rule.id, action.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAction(rule.id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Добавить действие
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={addRuleLevel}
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
              Добавить уровень (IF/THEN)
            </Button>
            <Button
              onClick={handleSaveAndActivate}
              className="gap-2 glow-effect ml-auto"
            >
              <Save className="h-4 w-4" />
              Сохранить и активировать
            </Button>
          </div>
        </div>

        {/* Секция Активные автоматизации */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">
              Активные автоматизации (примеры)
            </h2>
          </div>

          <div className="space-y-3">
            {activeRules.map((rule) => (
              <Card
                key={rule.id}
                className="glass-effect automation-active-rule"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium flex-1">{rule.description}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeActiveRule(rule.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
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


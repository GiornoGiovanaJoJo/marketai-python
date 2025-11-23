import { useState } from "react"
import {
  Search,
  Users,
  Folder,
  RotateCcw,
  UserPlus,
  Plus,
  Edit,
  Shield,
  Ban,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// Mock данные для сотрудников
const mockEmployees = [
  {
    id: "1",
    name: "Иван Петров",
    role: "Пользователь",
    phone: "+7 999 777 88 99",
    lastLogin: "15.01.2024 14:30",
    tasks: {
      inProgress: 2,
      completed: 1,
      overdue: 1,
    },
    status: "Приглашён",
  },
  {
    id: "2",
    name: "Мария Сидорова",
    role: "Администратор",
    phone: "+7 999 666 55 44",
    lastLogin: "15.01.2024 12:15",
    tasks: {
      inProgress: 0,
      completed: 5,
      overdue: 0,
    },
    status: "Активен",
  },
  {
    id: "3",
    name: "Алексей Иванов",
    role: "Пользователь",
    phone: "+7 999 555 44 33",
    lastLogin: "14.01.2024 18:45",
    tasks: {
      inProgress: 1,
      completed: 2,
      overdue: 0,
    },
    status: "Активен",
  },
]

// Mock данные для задач выбранного сотрудника
const mockTasks = {
  "1": [
    {
      id: "1",
      title: "Обновить цены по артикулу Массажер-22",
      dueDate: "31.10.2025",
      status: "Выполнено",
    },
    {
      id: "2",
      title: "Закрыть поставку OZ-332",
      dueDate: "02.11.2025",
      status: "Просрочено",
    },
    {
      id: "3",
      title: "Проверить возвраты по WB",
      dueDate: "04.11.2025",
      status: "В работе",
    },
  ],
  "2": [],
  "3": [],
}

const mockRoles = [
  { id: "all", name: "Все роли" },
  { id: "user", name: "Пользователь" },
  { id: "admin", name: "Администратор" },
]

const mockStatuses = [
  { id: "all", name: "Все статусы" },
  { id: "active", name: "Активен" },
  { id: "invited", name: "Приглашён" },
  { id: "blocked", name: "Заблокирован" },
]

const taskStatuses = [
  { id: "all", name: "Все статусы" },
  { id: "in-progress", name: "В работе" },
  { id: "completed", name: "Выполнено" },
  { id: "overdue", name: "Просрочено" },
]

export function Employees() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>("1")
  const [taskStatusFilter, setTaskStatusFilter] = useState("all")
  const [taskSort, setTaskSort] = useState("due-date-asc")

  const handleInvite = () => {
    toast({
      title: "Приглашение сотрудника",
      description: "Отправка приглашения сотруднику...",
      variant: "default",
    })
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedRole("all")
    setSelectedStatus("all")
    toast({
      title: "Фильтры сброшены",
      description: "Все фильтры успешно сброшены",
      variant: "default",
    })
  }

  const handleAddTask = () => {
    toast({
      title: "Добавление задачи",
      description: "Форма добавления новой задачи",
      variant: "default",
    })
  }

  const handleEditEmployee = (id: string) => {
    toast({
      title: "Редактирование сотрудника",
      description: `Открывается форма редактирования сотрудника ${id}`,
      variant: "default",
    })
  }

  const handlePermissions = (id: string) => {
    toast({
      title: "Управление правами",
      description: `Настройка прав доступа для сотрудника ${id}`,
      variant: "default",
    })
  }

  const handleBlock = (id: string) => {
    toast({
      title: "Блокировка сотрудника",
      description: `Сотрудник ${id} будет заблокирован`,
      variant: "destructive",
    })
  }

  const handleInviteEmployee = (id: string) => {
    toast({
      title: "Приглашение отправлено",
      description: `Приглашение отправлено сотруднику ${id}`,
      variant: "success",
    })
  }

  const handleDeleteEmployee = (id: string) => {
    toast({
      title: "Сотрудник удалён",
      description: `Сотрудник ${id} успешно удалён из системы`,
      variant: "destructive",
    })
  }

  const handleTaskDone = (taskId: string) => {
    toast({
      title: "Задача выполнена",
      description: `Задача ${taskId} отмечена как выполненная`,
      variant: "success",
    })
  }

  const handleReturnTask = (taskId: string) => {
    toast({
      title: "Задача возвращена",
      description: `Задача ${taskId} возвращена в работу`,
      variant: "default",
    })
  }

  const handleEditTask = (taskId: string) => {
    toast({
      title: "Редактирование задачи",
      description: `Открывается форма редактирования задачи ${taskId}`,
      variant: "default",
    })
  }

  const handleDeleteTask = (taskId: string) => {
    toast({
      title: "Задача удалена",
      description: `Задача ${taskId} успешно удалена`,
      variant: "destructive",
    })
  }

  // Фильтрация сотрудников
  const filteredEmployees = mockEmployees.filter((employee) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !employee.name.toLowerCase().includes(query) &&
        !employee.phone.includes(query)
      ) {
        return false
      }
    }
    if (selectedRole !== "all") {
      const roleMap: Record<string, string> = {
        user: "Пользователь",
        admin: "Администратор",
      }
      if (employee.role !== roleMap[selectedRole]) {
        return false
      }
    }
    if (selectedStatus !== "all") {
      const statusMap: Record<string, string> = {
        active: "Активен",
        invited: "Приглашён",
        blocked: "Заблокирован",
      }
      if (employee.status !== statusMap[selectedStatus]) {
        return false
      }
    }
    return true
  })

  // Фильтрация задач
  const selectedEmployeeTasks = selectedEmployee
    ? mockTasks[selectedEmployee as keyof typeof mockTasks] || []
    : []

  const filteredTasks = selectedEmployeeTasks.filter((task) => {
    if (taskStatusFilter === "all") return true
    const statusMap: Record<string, string> = {
      "in-progress": "В работе",
      completed: "Выполнено",
      overdue: "Просрочено",
    }
    return task.status === statusMap[taskStatusFilter]
  })

  const selectedEmployeeData = mockEmployees.find(
    (e) => e.id === selectedEmployee
  )

  const taskStats = selectedEmployeeData
    ? {
        total:
          selectedEmployeeData.tasks.inProgress +
          selectedEmployeeData.tasks.completed +
          selectedEmployeeData.tasks.overdue,
        inProgress: selectedEmployeeData.tasks.inProgress,
        completed: selectedEmployeeData.tasks.completed,
        overdue: selectedEmployeeData.tasks.overdue,
      }
    : { total: 0, inProgress: 0, completed: 0, overdue: 0 }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Активен":
        return "success"
      case "Приглашён":
        return "warning"
      case "Заблокирован":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTaskStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Выполнено":
        return "success"
      case "Просрочено":
        return "destructive"
      case "В работе":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Секция Мои сотрудники */}
        <div className="space-y-4">
          {/* Заголовок */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Мои сотрудники</h1>
          </div>

          {/* Фильтры и поиск */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени/телефону"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Пользователь" />
              </SelectTrigger>
              <SelectContent>
                {mockRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                {mockStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить
            </Button>
            <Button
              onClick={handleInvite}
              className="gap-2 glow-effect ml-auto"
            >
              <UserPlus className="h-4 w-4" />
              Пригласить
            </Button>
          </div>

          {/* Таблица сотрудников */}
          <div className="rounded-lg border glass-effect overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сотрудник</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Последний вход</TableHead>
                  <TableHead>Задачи</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className={`cursor-pointer ${
                      selectedEmployee === employee.id ? "bg-primary/10" : ""
                    }`}
                    onClick={() => setSelectedEmployee(employee.id)}
                  >
                    <TableCell className="font-medium">
                      {employee.name || "—"}
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.lastLogin || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {employee.tasks.inProgress > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
                              {employee.tasks.inProgress}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Задачи
                            </span>
                          </div>
                        )}
                        {employee.tasks.completed > 0 && (
                          <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">
                            {employee.tasks.completed}
                          </div>
                        )}
                        {employee.tasks.overdue > 0 && (
                          <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
                            {employee.tasks.overdue}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditEmployee(employee.id)
                          }}
                          className="h-8 px-2"
                        >
                          Ред.
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePermissions(employee.id)
                          }}
                          className="h-8 px-2"
                        >
                          Права
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBlock(employee.id)
                          }}
                          className="h-8 px-2"
                        >
                          Блок.
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInviteEmployee(employee.id)
                          }}
                          className="h-8 px-2"
                        >
                          Пригласить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEmployee(employee.id)
                          }}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Секция Задачи выбранного сотрудника */}
        {selectedEmployeeData && (
          <div className="space-y-4">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Folder className="h-5 w-5 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">
                  Задачи — {selectedEmployeeData.name}
                </h2>
              </div>
              <Button
                onClick={handleAddTask}
                className="gap-2 glow-effect"
                size="lg"
              >
                <Plus className="h-4 w-4" />
                Добавить задачу
              </Button>
            </div>

            {/* Статистика и фильтры */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  Всего: {taskStats.total}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  В работе: {taskStats.inProgress}
                </Badge>
                <Badge variant="success" className="px-3 py-1">
                  Выполнено: {taskStats.completed}
                </Badge>
                <Badge variant="destructive" className="px-3 py-1">
                  Просрочено: {taskStats.overdue}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={taskStatusFilter}
                  onValueChange={setTaskStatusFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={taskSort} onValueChange={setTaskSort}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Срок ↑" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due-date-asc">Срок ↑</SelectItem>
                    <SelectItem value="due-date-desc">Срок ↓</SelectItem>
                    <SelectItem value="status">По статусу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Таблица задач */}
            {filteredTasks.length > 0 ? (
              <div className="rounded-lg border glass-effect overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Задача</TableHead>
                      <TableHead>Срок</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getTaskStatusBadgeVariant(task.status)}
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {task.status === "Выполнено" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReturnTask(task.id)}
                                className="h-8 px-2"
                              >
                                Вернуть
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTaskDone(task.id)}
                                className="h-8 px-2"
                              >
                                Готово
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id)}
                              className="h-8 px-2"
                            >
                              Ред.
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 px-2 text-destructive hover:text-destructive"
                            >
                              Удалить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border glass-effect p-8 text-center text-muted-foreground">
                Нет задач для отображения
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

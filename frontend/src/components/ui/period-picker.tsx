import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

interface PeriodPickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function PeriodPicker({
  date,
  onDateChange,
  placeholder = "Выберите период",
  className,
}: PeriodPickerProps) {
  const [month, setMonth] = React.useState<number | undefined>(
    date ? date.getMonth() : undefined
  )
  const [year, setYear] = React.useState<number | undefined>(
    date ? date.getFullYear() : undefined
  )

  // Генерируем список лет (текущий год ± 2 года)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  React.useEffect(() => {
    if (month !== undefined && year !== undefined && onDateChange) {
      const newDate = new Date(year, month, 1)
      // Проверяем, чтобы не создавать бесконечный цикл
      if (!date || date.getMonth() !== month || date.getFullYear() !== year) {
        onDateChange(newDate)
      }
    }
  }, [month, year, onDateChange, date])

  React.useEffect(() => {
    if (date) {
      const newMonth = date.getMonth()
      const newYear = date.getFullYear()
      // Обновляем только если значения действительно изменились
      if (month !== newMonth || year !== newYear) {
        setMonth(newMonth)
        setYear(newYear)
      }
    }
  }, [date, month, year])

  const displayValue = month !== undefined && year !== undefined
    ? `${months[month]} ${year}`
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Месяц</label>
            <Select
              value={month !== undefined ? month.toString() : undefined}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Месяц" />
              </SelectTrigger>
              <SelectContent>
                {months.map((monthName, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Год</label>
            <Select
              value={year !== undefined ? year.toString() : undefined}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Год" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

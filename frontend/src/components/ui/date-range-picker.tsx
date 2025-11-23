import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    date?: DateRange
    onDateChange?: (date: DateRange | undefined) => void
    className?: string
}

export function DatePickerWithRange({
                                        date,
                                        onDateChange,
                                        className,
                                    }: DatePickerWithRangeProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelect = (selectedDate: DateRange | undefined) => {
        onDateChange?.(selectedDate)
        // Закрываем попап только если выбран полный диапазон
        if (selectedDate?.from && selectedDate?.to) {
            // setIsOpen(false)
        }
    }

    const formatDateRange = (dateRange?: DateRange) => {
        if (!dateRange?.from) {
            return "Выберите период"
        }

        const formatDate = (date: Date) => {
            return format(date, "dd MMM yyyy", { locale: ru })
        }

        if (dateRange.to) {
            return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
        }

        return formatDate(dateRange.from)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange(date)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

// 🔥 АЛЬТЕРНАТИВА: Экспорт для обратной совместимости 🔥
// Если где-то в проекте используется старая версия DateRangePicker
export interface DateRangePickerProps {
    startDate?: Date
    endDate?: Date
    onDateRangeChange?: (start: Date | undefined, end: Date | undefined) => void
    className?: string
}

export function DateRangePicker({
                                    startDate,
                                    endDate,
                                    onDateRangeChange,
                                    className,
                                }: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: startDate,
        to: endDate,
    })

    React.useEffect(() => {
        setDate({
            from: startDate,
            to: endDate,
        })
    }, [startDate, endDate])

    const handleDateChange = (range: DateRange | undefined) => {
        setDate(range)
        if (onDateRangeChange) {
            onDateRangeChange(range?.from, range?.to)
        }
    }

    return (
        <DatePickerWithRange
            date={date}
            onDateChange={handleDateChange}
            className={className}
        />
    )
}

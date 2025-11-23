import { CalendarRange } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/date-range-picker'

interface DateRangeFilterProps {
    startDate: Date
    endDate: Date
    onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void
}

export function DateRangeFilter({
                                    startDate,
                                    endDate,
                                    onDateRangeChange,
                                }: DateRangeFilterProps) {
    return (
        <div>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={onDateRangeChange}
                placeholder="Выберите период"
            />
        </div>
    )
}

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { api, ApiError, FinancialMetric } from '@/lib/api'
import type { DateRange } from '@/types/financial.types'

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

export function useFinancialMetrics() {
    const [tableData, setTableData] = useState<FinancialMetric[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchMetrics = async (campaignId: number, dateRange: DateRange) => {
        if (!dateRange.from || !dateRange.to) {
            setError('Выберите диапазон дат')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const data = await api.getFinancialMetrics({
                campaignId,
                dateFrom: formatDate(dateRange.from),
                dateTo: formatDate(dateRange.to),
            })

            if (data && Array.isArray(data)) {
                setTableData(data)
                toast({
                    title: 'Успешно',
                    description: `Загружено ${data.length} записей`,
                    variant: 'default',
                })
            } else {
                throw new Error('Неверный формат данных')
            }
        } catch (err: any) {
            const errorMessage = err instanceof ApiError ? err.message : 'Не удалось загрузить метрики'
            setError(errorMessage)
            setTableData([])
            toast({
                title: 'Ошибка',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return {
        tableData,
        isLoading,
        error,
        fetchMetrics,
    }
}

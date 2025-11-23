import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FinancialMetric } from '@/types/financial.types'

function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return '-'
    return new Intl.NumberFormat('ru-RU').format(num)
}

interface FinancialTableProps {
    data: FinancialMetric[]
    isLoading: boolean
}

export function FinancialTable({ data, isLoading }: FinancialTableProps) {
    if (isLoading) {
        return null
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Нет данных для отображения</p>
                <p className="text-sm">Выберите кампанию и загрузите метрики</p>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Детализация по товарам</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="max-w-full overflow-x-auto rounded-lg border">
                    <Table className="w-max">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Артикул (nm_id)</TableHead>
                                <TableHead className="whitespace-nowrap">Название товара</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Продажи</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Отказы</TableHead>
                                <TableHead className="whitespace-nowrap text-right">% Отказов</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Доставок</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Возвратов</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Продано</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Выручка (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Розн. цена (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">СПП (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Комиссия WB (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">К перечислению (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Логистика (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Приёмка (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Штрафы (₽)</TableHead>
                                <TableHead className="whitespace-nowrap text-right">Доплаты (₽)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, idx) => (
                                <TableRow key={idx} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-sm">{row.nm_id}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={row.sa_name}>
                                        {row.sa_name || '—'}
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(row.sales_count)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(row.refuses_count)}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={row.percent_refuses > 30 ? 'destructive' : 'secondary'}>
                                            {row.percent_refuses}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(row.deliveries_count)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(row.refund_count)}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(row.sold_count)}
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(row.retail_amount)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(row.retail_price)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(row.spp_amount)}</TableCell>
                                    <TableCell className="text-right">
                                        {formatNumber(row.total_commission_with_spp)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600">
                                        {formatNumber(row.seller_total)}
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(row.delivery_amount)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(row.acceptance_amount)}</TableCell>
                                    <TableCell className="text-right text-red-600">
                                        {formatNumber(row.penalty_amount)}
                                    </TableCell>
                                    <TableCell className="text-right text-blue-600">
                                        {formatNumber(row.surcharges_amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

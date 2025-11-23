import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CategoryBreakdownRow } from '@/types/financial.types'

function formatNumber(num: number): string {
    return new Intl.NumberFormat('ru-RU').format(num)
}

interface CategoryBreakdownProps {
    data: CategoryBreakdownRow[]
    expandedCategories: Set<string>
    onToggleExpand: (id: string) => void
}

export function CategoryBreakdown({
                                      data,
                                      expandedCategories,
                                      onToggleExpand,
                                  }: CategoryBreakdownProps) {
    const renderRows = (items: CategoryBreakdownRow[], level: number = 0): React.ReactNode[] => {
        return items.flatMap((item) => {
            const isExpanded = expandedCategories.has(item.id)
            const hasSubcategories = item.subcategories && item.subcategories.length > 0

            return [
                <TableRow key={item.id} className={cn(level > 0 && 'bg-muted/50')}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
                            {hasSubcategories && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => onToggleExpand(item.id)}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                            <span>{item.category}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(item.feb25_1)}</TableCell>
                    <TableCell className="text-right">{formatNumber(item.feb25_2)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatNumber(item.total)}</TableCell>
                </TableRow>,
                ...(isExpanded && item.subcategories
                    ? renderRows(item.subcategories, level + 1)
                    : []),
            ]
        })
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Структура доходов и расходов</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Категория</TableHead>
                            <TableHead className="text-right">Февраль 1-я половина</TableHead>
                            <TableHead className="text-right">Февраль 2-я половина</TableHead>
                            <TableHead className="text-right">Итого</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{renderRows(data)}</TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

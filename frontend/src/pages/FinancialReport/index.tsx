'use client'

import {useEffect, useState} from 'react'
import {usePageContainer} from '@/hooks/usePageContainer'
import {useAppSelector} from '@/store/hooks'
import {MetricsCards} from './components/MetricsCards'
import {RevenueChart} from './components/RevenueChart'
import {FinancialTable} from './components/FinancialTable'
import {CategoryBreakdown} from './components/CategoryBreakdown'
import {EmptyState} from './components/EmptyState'
import {LoadingState} from './components/LoadingState'
import {useFinancialMetrics} from '@/hooks/data/useFinancialMetrics'
import {useCampaigns} from '@/hooks/data/useCampaigns'
import type {CategoryBreakdownRow} from '@/types/financial.types'

const CATEGORY_DATA: CategoryBreakdownRow[] = []

export function FinancialReport() {
    const {containerClassName} = usePageContainer()
    const filters = useAppSelector((s) => s.filters)

    const {isLoading: isCampaignsLoading} = useCampaigns()
    const {tableData, isLoading, fetchMetrics} = useFinancialMetrics()

    const [expanded, setExpanded] = useState(new Set<string>())

    useEffect(() => {
        if (filters.campaignId && filters.dateFrom && filters.dateTo) {
            fetchMetrics(filters.campaignId, {
                from: new Date(filters.dateFrom),
                to: new Date(filters.dateTo),
            })
        }
    }, [
        filters.campaignId,
        filters.dateFrom,
        filters.dateTo,
        filters.warehouse,
        filters.category,
    ])

    if (isCampaignsLoading) return <LoadingState/>
    if (!filters.campaignId) return <EmptyState/>

    return (
        <div className={containerClassName}>

            {tableData.length > 0 ? (
                <>
                    <div className="pt-4">
                        <MetricsCards/>
                        <RevenueChart/>
                        <CategoryBreakdown
                            data={CATEGORY_DATA}
                            expandedCategories={expanded}
                            onToggleExpand={(id) => {
                                const next = new Set(expanded)
                                next.has(id) ? next.delete(id) : next.add(id)
                                setExpanded(next)
                            }}
                        />
                        <FinancialTable data={tableData} isLoading={isLoading}/>
                    </div>
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">Нет данных</p>
                        <p className="text-sm">Выберите кампанию и период</p>
                    </div>
                )
            )}
        </div>
    )
}

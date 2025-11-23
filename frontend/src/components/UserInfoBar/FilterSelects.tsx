'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    setCampaignId,
    setDateFrom,
    setDateTo,
    setMarketplace,
} from '@/store/slices/filtersSlice'

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

import { DateRangePicker } from '@/components/ui/date-range-picker'
import { useCampaigns } from '@/hooks/data/useCampaigns'

export function FilterSelects() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.filters)

    const {
        campaigns,
        selectedCampaignId,
        setSelectedCampaignId,
        isLoading: isCampaignsLoading,
    } = useCampaigns()

    // -------------------------------------------------------
    // Локальное состояние дат (для DateRangePicker)
    // -------------------------------------------------------
    const [localRange, setLocalRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        to: filters.dateTo ? new Date(filters.dateTo) : undefined,
    })

    // -------------------------------------------------------
    // CAMPAIGN SELECT
    // -------------------------------------------------------
    const onSelectCampaign = (val: string) => {
        const id = parseInt(val)

        setSelectedCampaignId(id)          // локальное состояние hook useCampaigns
        dispatch(setCampaignId(id))        // redux
        dispatch(setMarketplace(val))      // marketplace = campaignId
    }

    // -------------------------------------------------------
    // DATE RANGE SELECT
    // -------------------------------------------------------
    const onChangeDates = (from: Date | undefined, to: Date | undefined) => {
        setLocalRange({ from, to })

        dispatch(setDateFrom(from ? from.toISOString() : null))
        dispatch(setDateTo(to ? to.toISOString() : null))
    }

    // -------------------------------------------------------
    // Синхронизируем redux → local UI
    // если фильтры были восстановлены из localStorage
    // -------------------------------------------------------
    useEffect(() => {
        if (filters.dateFrom || filters.dateTo) {
            setLocalRange({
                from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
                to: filters.dateTo ? new Date(filters.dateTo) : undefined,
            })
        }
    }, [filters.dateFrom, filters.dateTo])

    return (
        <div className="flex flex-wrap gap-4 items-center">

            {/* CAMPAIGN */}
            <Select
                value={filters.campaignId?.toString() ?? ''}
                onValueChange={onSelectCampaign}
            >
                <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Кампания" />
                </SelectTrigger>

                <SelectContent>
                    {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* DATE RANGE */}
            <DateRangePicker
                startDate={localRange.from}
                endDate={localRange.to}
                onDateRangeChange={onChangeDates}
            />

        </div>
    )
}

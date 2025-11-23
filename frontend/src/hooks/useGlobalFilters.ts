import { useCallback, useMemo } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    setMarketplace as setMarketplaceAction,
    setWarehouse as setWarehouseAction,
    setCategory as setCategoryAction,
    setDateRange,
    applyPreset,
    addPreset,
    deletePreset,
    resetFilters as resetFiltersAction,
} from '@/store/slices/filtersSlice'
import type { PresetConfig } from '@/types/filters.types'

export function useGlobalFilters() {
    const dispatch = useAppDispatch()
    const { toast } = useToast()
    const filters = useAppSelector((state) => state.filters)

    // Пресеты по умолчанию
    const defaultPresets = useMemo<PresetConfig[]>(() => {
        const last7DaysStart = new Date()
        last7DaysStart.setDate(last7DaysStart.getDate() - 7)

        const last30DaysStart = new Date()
        last30DaysStart.setDate(last30DaysStart.getDate() - 30)

        return [
            {
                id: 'all-default',
                name: 'Все площадки • 7 дней',
                marketplace: 'Все маркетплейсы',
                warehouse: 'Все склады',
                category: 'Все категории',
                startDate: last7DaysStart.toISOString(),
                endDate: new Date().toISOString(),
            },
            {
                id: 'wb-electronics',
                name: 'WB • Электроника • 30 дней',
                marketplace: 'Wildberries',
                warehouse: 'Все склады',
                category: 'Электроника',
                startDate: last30DaysStart.toISOString(),
                endDate: new Date().toISOString(),
            },
        ]
    }, [])

    // Все пресеты (default + custom)
    const allPresets = useMemo(() => {
        return [...defaultPresets, ...filters.presets]
    }, [defaultPresets, filters.presets])

    // Actions
    const handleSetMarketplace = useCallback(
        (value: string) => {
            dispatch(setMarketplaceAction(value))
        },
        [dispatch]
    )

    const handleSetWarehouse = useCallback(
        (value: string) => {
            dispatch(setWarehouseAction(value))
        },
        [dispatch]
    )

    const handleSetCategory = useCallback(
        (value: string) => {
            dispatch(setCategoryAction(value))
        },
        [dispatch]
    )

    const handleSetDateRange = useCallback(
        (start: Date | undefined, end: Date | undefined) => {
            if (start && end) {
                dispatch(
                    setDateRange({
                        startDate: start.toISOString(),
                        endDate: end.toISOString(),
                    })
                )
            }
        },
        [dispatch]
    )

    const handleApplyPreset = useCallback(
        (preset: PresetConfig) => {
            dispatch(applyPreset(preset))
            toast({
                title: 'Пресет применён',
                description: `Используем настройки «${preset.name}»`,
            })
        },
        [dispatch, toast]
    )

    const handleSavePreset = useCallback(() => {
        const newPreset: PresetConfig = {
            id: `custom-${Date.now()}`,
            name: `Пресет ${filters.presets.length + 1}`,
            marketplace: filters.marketplace,
            warehouse: filters.warehouse,
            category: filters.category,
            startDate: filters.startDate,
            endDate: filters.endDate,
        }
        dispatch(addPreset(newPreset))
        toast({
            title: 'Пресет сохранён',
            description: `Настройки сохранены как «${newPreset.name}»`,
        })
    }, [dispatch, filters, toast])

    const handleDeletePreset = useCallback(
        (presetId: string) => {
            dispatch(deletePreset(presetId))
            toast({
                title: 'Пресет удалён',
                description: 'Настройки удалены из пресетов',
            })
        },
        [dispatch, toast]
    )

    const handleResetFilters = useCallback(() => {
        dispatch(resetFiltersAction())
        toast({
            title: 'Фильтры сброшены',
            description: 'Возвращены значения по умолчанию',
        })
    }, [dispatch, toast])

    return {
        // Current values
        marketplace: filters.marketplace,
        warehouse: filters.warehouse,
        category: filters.category,
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
        presets: filters.presets,
        allPresets,

        // Setters
        setMarketplace: handleSetMarketplace,
        setWarehouse: handleSetWarehouse,
        setCategory: handleSetCategory,
        setDateRange: handleSetDateRange,

        // Preset actions
        applyPreset: handleApplyPreset,
        savePreset: handleSavePreset,
        deletePreset: handleDeletePreset,
        resetFilters: handleResetFilters,
    }
}

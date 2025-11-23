import { FilterSelects } from './FilterSelects'
import { DateRangeFilter } from './DateRangeFilter'
import { PresetsMenu } from './PresetsMenu'
import type { PresetConfig } from '@/types/filters.types'

interface GlobalFiltersProps {
    marketplace: string
    warehouse: string
    category: string
    startDate: Date
    endDate: Date
    allPresets: PresetConfig[]
    onMarketplaceChange: (value: string) => void
    onWarehouseChange: (value: string) => void
    onCategoryChange: (value: string) => void
    onDateRangeChange: (start: Date | undefined, end: Date | undefined) => void
    onApplyPreset: (preset: PresetConfig) => void
    onSavePreset: () => void
    onDeletePreset: (presetId: string) => void
    onResetFilters: () => void
}

export function GlobalFilters({
                                  marketplace,
                                  warehouse,
                                  category,
                                  startDate,
                                  endDate,
                                  allPresets,
                                  onMarketplaceChange,
                                  onWarehouseChange,
                                  onCategoryChange,
                                  onDateRangeChange,
                                  onApplyPreset,
                                  onSavePreset,
                                  onDeletePreset,
                                  onResetFilters,
                              }: GlobalFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <FilterSelects
            />

            {/*<PresetsMenu
                allPresets={allPresets}
                onApplyPreset={onApplyPreset}
                onSavePreset={onSavePreset}
                onDeletePreset={onDeletePreset}
                onResetFilters={onResetFilters}
            />*/}
        </div>
    )
}

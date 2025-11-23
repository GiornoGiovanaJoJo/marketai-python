export interface PresetConfig {
    id: string
    name: string
    marketplace: string
    warehouse: string
    category: string
    startDate: string // ISO string
    endDate: string   // ISO string
}

export interface FiltersState {
    marketplace: string
    warehouse: string
    category: string

    startDate: string // старый диапазон (можно удалить потом)
    endDate: string   // старый диапазон (можно удалить потом)

    // 🔥 Новые ключевые фильтры
    campaignId: number | null
    dateFrom: string | null
    dateTo: string | null

    presets: PresetConfig[]
}

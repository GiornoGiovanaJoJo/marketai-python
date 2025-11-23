import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FiltersState, PresetConfig } from '@/types/filters.types'

const PRESET_STORAGE_KEY = 'marketai-global-filters'

// Загружаем пресеты
const loadPresetsFromStorage = (): PresetConfig[] => {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(PRESET_STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const initialState: FiltersState = {
    marketplace: 'Все маркетплейсы',
    warehouse: 'Все склады',
    category: 'Все категории',

    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),

    // 🔥 Новые поля
    campaignId: null,
    dateFrom: null,
    dateTo: null,

    presets: loadPresetsFromStorage(),
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setAllFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
            return { ...state, ...action.payload }
        },

        setMarketplace: (state, action: PayloadAction<string>) => {
            state.marketplace = action.payload
        },

        setWarehouse: (state, action: PayloadAction<string>) => {
            state.warehouse = action.payload
        },

        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload
        },

        // 🔥 NEW
        setCampaignId: (state, action: PayloadAction<number | null>) => {
            state.campaignId = action.payload
        },

        setDateFrom: (state, action: PayloadAction<string | null>) => {
            state.dateFrom = action.payload
        },

        setDateTo: (state, action: PayloadAction<string | null>) => {
            state.dateTo = action.payload
        },

        setDateRange: (
            state,
            action: PayloadAction<{ startDate: string; endDate: string }>
        ) => {
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
        },

        applyPreset: (state, action: PayloadAction<PresetConfig>) => {
            const p = action.payload
            state.marketplace = p.marketplace
            state.warehouse = p.warehouse
            state.category = p.category
            state.startDate = p.startDate
            state.endDate = p.endDate
        },

        addPreset: (state, action: PayloadAction<PresetConfig>) => {
            state.presets.push(action.payload)
            if (typeof window !== 'undefined') {
                localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(state.presets))
            }
        },

        deletePreset: (state, action: PayloadAction<string>) => {
            state.presets = state.presets.filter((p) => p.id !== action.payload)
            if (typeof window !== 'undefined') {
                localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(state.presets))
            }
        },

        resetFilters: (state) => {
            state.marketplace = 'Все маркетплейсы'
            state.warehouse = 'Все склады'
            state.category = 'Все категории'

            const now = new Date()
            state.startDate = now.toISOString()
            state.endDate = now.toISOString()

            state.campaignId = null
            state.dateFrom = null
            state.dateTo = null
        },

        loadPresets: (state, action: PayloadAction<PresetConfig[]>) => {
            state.presets = action.payload
        },
    },
})

export const {
    setAllFilters,
    setMarketplace,
    setWarehouse,
    setCategory,
    setDateRange,
    applyPreset,
    addPreset,
    deletePreset,
    resetFilters,
    loadPresets,

    // 🔥 новые экшены
    setCampaignId,
    setDateFrom,
    setDateTo,
} = filtersSlice.actions

export default filtersSlice.reducer

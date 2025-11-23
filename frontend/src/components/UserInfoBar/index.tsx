'use client'

import { useAppSelector } from '@/store/hooks'
import { UserProfile } from './UserProfile'
import { UserActions } from './UserActions'
import { GlobalFilters } from './GlobalFilters'
import { useGlobalFilters } from '@/hooks/useGlobalFilters'

export function UserInfoBar() {
    const user = useAppSelector((state) => state.auth.user)

    const {
        marketplace,
        warehouse,
        category,
        startDate,
        endDate,
        allPresets,
        setMarketplace,
        setWarehouse,
        setCategory,
        setDateRange,
        applyPreset,
        savePreset,
        deletePreset,
        resetFilters,
    } = useGlobalFilters()

    const userName = user?.name || 'Гость'
    const userPhone = user?.phone || ''
    const referralLink = `https://marketai.ru/ref/${user?.id || ''}`

    return (
        <div className="sticky top-0 w-full p-4 pt-6 border-b border-border/40 glass-effect z-30">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <UserProfile
                        userName={userName}
                        userPhone={userPhone}
                        subscriptionDays={45}
                    />
                    <UserActions referralLink={referralLink} />
                </div>

                <GlobalFilters
                    marketplace={marketplace}
                    warehouse={warehouse}
                    category={category}
                    startDate={startDate}
                    endDate={endDate}
                    allPresets={allPresets}
                    onMarketplaceChange={setMarketplace}
                    onWarehouseChange={setWarehouse}
                    onCategoryChange={setCategory}
                    onDateRangeChange={setDateRange}
                    onApplyPreset={applyPreset}
                    onSavePreset={savePreset}
                    onDeletePreset={deletePreset}
                    onResetFilters={resetFilters}
                />
            </div>
        </div>
    )
}

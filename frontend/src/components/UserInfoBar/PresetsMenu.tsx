import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PresetConfig } from '@/types/filters.types'

interface PresetsMenuProps {
    allPresets: PresetConfig[]
    onApplyPreset: (preset: PresetConfig) => void
    onSavePreset: () => void
    onDeletePreset: (presetId: string) => void
    onResetFilters: () => void
}

export function PresetsMenu({
                                allPresets,
                                onApplyPreset,
                                onSavePreset,
                                onDeletePreset,
                                onResetFilters,
                            }: PresetsMenuProps) {
    const customPresets = allPresets.filter((p) => p.id.startsWith('custom-'))
    const defaultPresets = allPresets.filter((p) => !p.id.startsWith('custom-'))

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Пресеты
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                {defaultPresets.length > 0 && (
                    <>
                        <DropdownMenuLabel>Стандартные</DropdownMenuLabel>
                        {defaultPresets.map((preset) => (
                            <DropdownMenuItem
                                key={preset.id}
                                onClick={() => onApplyPreset(preset)}
                                className="cursor-pointer"
                            >
                                {preset.name}
                            </DropdownMenuItem>
                        ))}
                    </>
                )}

                {customPresets.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Мои пресеты</DropdownMenuLabel>
                        {customPresets.map((preset) => (
                            <div key={preset.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded">
                                <button
                                    onClick={() => onApplyPreset(preset)}
                                    className="flex-1 text-left text-sm hover:text-foreground cursor-pointer"
                                >
                                    {preset.name}
                                </button>
                                <button
                                    onClick={() => onDeletePreset(preset.id)}
                                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                                    title="Удалить пресет"
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </button>
                            </div>
                        ))}
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSavePreset} className="cursor-pointer">
                    💾 Сохранить текущие фильтры
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onResetFilters} className="cursor-pointer">
                    ↺ Сбросить фильтры
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

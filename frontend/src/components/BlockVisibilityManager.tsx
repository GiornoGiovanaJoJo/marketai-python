import { useState, useEffect, useRef } from "react"
import { CheckSquare, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

// Тип для блока на странице
export interface PageBlock {
  id: string
  title: string
  description?: string
}

interface BlockVisibilityManagerProps {
  blocks: PageBlock[]
  onVisibilityChange?: (visibleBlockIds: string[]) => void
  storageKey?: string // Ключ для сохранения в localStorage
}

export function BlockVisibilityManager({
  blocks,
  onVisibilityChange,
  storageKey,
}: BlockVisibilityManagerProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  
  // Загружаем сохраненные настройки из localStorage
  const getStoredVisibility = (): string[] => {
    const allBlockIds = blocks.map((b) => b.id)
    
    if (!storageKey) return allBlockIds
    
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Проверяем, что все сохраненные блоки существуют
        const validStored = parsed.filter((id: string) => blocks.some((b) => b.id === id))
        
        // Если сохранены не все блоки (добавились новые), добавляем новые блоки к видимым
        const newBlocks = allBlockIds.filter((id) => !validStored.includes(id))
        if (newBlocks.length > 0) {
          // Новые блоки по умолчанию видимы
          return [...validStored, ...newBlocks]
        }
        
        // Возвращаем сохраненные настройки (даже если пустой массив)
        return validStored
      }
    } catch (e) {
      console.error("Ошибка загрузки настроек видимости блоков:", e)
    }
    
    // По умолчанию все блоки видимы (только если нет сохраненных настроек)
    return allBlockIds
  }

  const [visibleBlockIds, setVisibleBlockIds] = useState<string[]>(() => getStoredVisibility())
  const isInitialized = useRef(false)
  const prevBlocksRef = useRef<string[]>([])

  // Сохраняем настройки в localStorage
  const saveVisibility = (ids: string[]) => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(ids))
      } catch (e) {
        console.error("Ошибка сохранения настроек видимости блоков:", e)
      }
    }
  }

  // Инициализируем видимость только один раз при монтировании
  useEffect(() => {
    if (!isInitialized.current) {
      const stored = getStoredVisibility()
      setVisibleBlockIds(stored)
      prevBlocksRef.current = blocks.map((b) => b.id)
      isInitialized.current = true
    }
  }, [blocks, storageKey])

  // Обновляем видимость при добавлении новых блоков (но не перезаписываем пользовательские настройки)
  useEffect(() => {
    if (isInitialized.current) {
      const currentBlockIds = blocks.map((b) => b.id)
      const prevBlockIds = prevBlocksRef.current
      
      // Проверяем, добавились ли новые блоки
      const newBlocks = currentBlockIds.filter((id) => !prevBlockIds.includes(id))
      if (newBlocks.length > 0) {
        // Новые блоки по умолчанию видимы
        setVisibleBlockIds((prev) => {
          const updatedIds = [...prev, ...newBlocks]
          saveVisibility(updatedIds)
          onVisibilityChange?.(updatedIds)
          return updatedIds
        })
      }
      
      // Обновляем ссылку на предыдущие блоки
      prevBlocksRef.current = currentBlockIds
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  const handleToggleBlock = (blockId: string) => {
    const newVisibleIds = visibleBlockIds.includes(blockId)
      ? visibleBlockIds.filter((id) => id !== blockId)
      : [...visibleBlockIds, blockId]
    
    setVisibleBlockIds(newVisibleIds)
    saveVisibility(newVisibleIds)
    onVisibilityChange?.(newVisibleIds)
  }

  const handleSelectAll = () => {
    const allIds = blocks.map((b) => b.id)
    setVisibleBlockIds(allIds)
    saveVisibility(allIds)
    onVisibilityChange?.(allIds)
    toast({
      title: "Все блоки выбраны",
      description: `Выбрано блоков: ${allIds.length}`,
    })
  }

  const handleDeselectAll = () => {
    setVisibleBlockIds([])
    saveVisibility([])
    onVisibilityChange?.([])
    toast({
      title: "Все блоки скрыты",
      description: "Все блоки были скрыты",
    })
  }

  const handleApply = () => {
    saveVisibility(visibleBlockIds)
    onVisibilityChange?.(visibleBlockIds)
    toast({
      title: "Настройки применены",
      description: `Отображается блоков: ${visibleBlockIds.length} из ${blocks.length}`,
    })
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckSquare className="h-4 w-4" />
          Выбрать блоки
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Управление блоками</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {/* Кнопки быстрого выбора */}
          <div className="flex gap-2">
            <Button onClick={handleSelectAll} variant="outline" size="sm" className="flex-1">
              Выбрать все
            </Button>
            <Button onClick={handleDeselectAll} variant="outline" size="sm" className="flex-1">
              Скрыть все
            </Button>
          </div>

          {/* Список блоков */}
          <div className="space-y-2">
            {blocks.map((block) => {
              const isVisible = visibleBlockIds.includes(block.id)
              return (
                <Card key={block.id} className="glass-effect">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isVisible}
                        onCheckedChange={() => handleToggleBlock(block.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isVisible ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <h3 className="font-medium">{block.title}</h3>
                        </div>
                        {block.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {block.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Информация */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Отображается: {visibleBlockIds.length} из {blocks.length} блоков
            </p>
          </div>

          {/* Кнопка применения */}
          <Button onClick={handleApply} className="w-full">
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}


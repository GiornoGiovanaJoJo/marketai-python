import { useState, useEffect, useCallback, useRef } from "react"
import { PageBlock } from "@/components/BlockVisibilityManager"

interface UsePageBlocksOptions {
  storageKey: string
  defaultVisible?: string[] // ID блоков, видимых по умолчанию
}

export function usePageBlocks(blocks: PageBlock[], options: UsePageBlocksOptions) {
  const { storageKey, defaultVisible } = options

  // Загружаем сохраненные настройки
  const loadVisibility = useCallback((): string[] => {
    const allBlockIds = blocks.map((b) => b.id)
    
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
    return defaultVisible || allBlockIds
  }, [storageKey, blocks, defaultVisible])

  const [visibleBlockIds, setVisibleBlockIds] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const prevBlocksRef = useRef<string[]>([])

  // Сохраняем настройки
  const saveVisibility = useCallback(
    (ids: string[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(ids))
      } catch (e) {
        console.error("Ошибка сохранения настроек видимости блоков:", e)
      }
    },
    [storageKey]
  )

  // Инициализируем видимость при монтировании
  useEffect(() => {
    if (!isInitialized && blocks.length > 0) {
      const stored = loadVisibility()
      setVisibleBlockIds(stored)
      prevBlocksRef.current = blocks.map((b) => b.id)
      setIsInitialized(true)
    }
  }, [blocks, loadVisibility, isInitialized])

  // Обновляем видимость при изменении блоков (добавлении новых)
  useEffect(() => {
    if (!isInitialized || blocks.length === 0) return
    
    const currentBlockIds = blocks.map((b) => b.id)
    const prevBlockIds = prevBlocksRef.current
    
    // Проверяем, добавились ли новые блоки
    const newBlocks = currentBlockIds.filter((id) => !prevBlockIds.includes(id))
    if (newBlocks.length > 0) {
      // Новые блоки по умолчанию видимы
      setVisibleBlockIds((prev) => {
        const updatedIds = [...prev, ...newBlocks]
        saveVisibility(updatedIds)
        return updatedIds
      })
    }
    
    // Обновляем ссылку на предыдущие блоки
    prevBlocksRef.current = currentBlockIds
  }, [blocks, saveVisibility, isInitialized])

  // Проверка видимости блока
  const isBlockVisible = useCallback(
    (blockId: string) => {
      // Если еще не инициализирован, показываем все блоки по умолчанию
      if (!isInitialized) {
        return true
      }
      // После инициализации проверяем по сохраненным настройкам
      return visibleBlockIds.includes(blockId)
    },
    [visibleBlockIds, isInitialized]
  )

  // Установка видимости блоков
  const setVisibleBlocks = useCallback(
    (blockIds: string[]) => {
      setVisibleBlockIds(blockIds)
      saveVisibility(blockIds)
    },
    [saveVisibility]
  )

  // Получение видимых блоков
  const getVisibleBlocks = useCallback(() => {
    return blocks.filter((block) => visibleBlockIds.includes(block.id))
  }, [blocks, visibleBlockIds])

  return {
    visibleBlockIds,
    isBlockVisible,
    setVisibleBlocks,
    getVisibleBlocks,
  }
}

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { api, ApiError, Campaign } from '@/lib/api'

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const loadCampaigns = async () => {
            setIsLoading(true)
            try {
                const data = await api.getCampaigns()
                setCampaigns(data)

                if (data.length > 0) {
                    setSelectedCampaignId(data[0].id)
                }
            } catch (err) {
                console.error('Failed to load campaigns:', err)
                const errorMsg = err instanceof ApiError ? err.message : 'Не удалось загрузить кампании'
                toast({
                    title: 'Ошибка',
                    description: errorMsg,
                    variant: 'destructive',
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadCampaigns()
    }, [toast])

    return {
        campaigns,
        selectedCampaignId,
        setSelectedCampaignId,
        isLoading,
    }
}

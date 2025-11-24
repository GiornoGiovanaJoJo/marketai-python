import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import campaignsService from '@/services/campaigns.service'
import { Campaign } from '@/types/campaign'

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const loadCampaigns = async () => {
            setIsLoading(true)
            try {
                const data = await campaignsService.getAll()
                setCampaigns(data)

                if (data.length > 0) {
                    setSelectedCampaignId(data[0].id)
                }
            } catch (err) {
                console.error('Failed to load campaigns:', err)
                toast({
                    title: 'шибка',
                    description: 'е удалось загрузить кампании',
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

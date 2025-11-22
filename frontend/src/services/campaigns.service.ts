import api from '@/lib/api'
import { Campaign, CampaignCreate, CampaignUpdate } from '@/types/campaign'

class CampaignsService {
  async getAll(): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>('/campaigns/')
    return response.data
  }

  async getById(id: number): Promise<Campaign> {
    const response = await api.get<Campaign>(`/campaigns/${id}/`)
    return response.data
  }

  async create(data: CampaignCreate): Promise<Campaign> {
    const response = await api.post<Campaign>('/campaigns/', data)
    return response.data
  }

  async update(id: number, data: CampaignUpdate): Promise<Campaign> {
    const response = await api.put<Campaign>(`/campaigns/${id}/`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/campaigns/${id}/`)
  }

  async getStatistics(id: number): Promise<any> {
    const response = await api.get(`/campaigns/${id}/statistics/`)
    return response.data
  }
}

export default new CampaignsService()

import { httpClient } from '@/lib/http'
import { Campaign, CampaignCreate, CampaignUpdate } from '@/types/campaign'

/**
 * Campaigns Service
 * 
 * Django REST Framework ViewSet endpoints:
 * - GET    /api/campaigns/          - List all campaigns
 * - POST   /api/campaigns/          - Create campaign
 * - GET    /api/campaigns/{id}/     - Retrieve campaign
 * - PUT    /api/campaigns/{id}/     - Update campaign (full)
 * - PATCH  /api/campaigns/{id}/     - Update campaign (partial)
 * - DELETE /api/campaigns/{id}/     - Delete campaign
 * 
 * Custom actions:
 * - GET /api/campaigns/{id}/statistics/ - Campaign statistics
 */
class CampaignsService {
  /**
   * Get all campaigns
   * Django endpoint: GET /api/campaigns/
   * Response: Campaign[] or paginated { count, next, previous, results: Campaign[] }
   */
  async getAll(params?: {
    page?: number
    page_size?: number
    search?: string
    ordering?: string
  }): Promise<Campaign[]> {
    const response = await httpClient.get<Campaign[] | { results: Campaign[] }>('/campaigns/', { params })
    
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return response.data
    }
    return response.data.results
  }

  /**
   * Get campaign by ID
   * Django endpoint: GET /api/campaigns/{id}/
   * Response: Campaign object
   */
  async getById(id: number): Promise<Campaign> {
    const response = await httpClient.get<Campaign>(`/campaigns/${id}/`)
    return response.data
  }

  /**
   * Create new campaign
   * Django endpoint: POST /api/campaigns/
   * Request: CampaignCreate object
   * Response: Campaign object
   */
  async create(data: CampaignCreate): Promise<Campaign> {
    const response = await httpClient.post<Campaign>('/campaigns/', data)
    return response.data
  }

  /**
   * Update campaign (full update)
   * Django endpoint: PUT /api/campaigns/{id}/
   * Request: All campaign fields required
   * Response: Campaign object
   */
  async update(id: number, data: CampaignUpdate): Promise<Campaign> {
    const response = await httpClient.put<Campaign>(`/campaigns/${id}/`, data)
    return response.data
  }

  /**
   * Partial update campaign
   * Django endpoint: PATCH /api/campaigns/{id}/
   * Request: Only fields to update
   * Response: Campaign object
   */
  async partialUpdate(id: number, data: Partial<CampaignUpdate>): Promise<Campaign> {
    const response = await httpClient.patch<Campaign>(`/campaigns/${id}/`, data)
    return response.data
  }

  /**
   * Delete campaign
   * Django endpoint: DELETE /api/campaigns/{id}/
   * Response: 204 No Content
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete(`/campaigns/${id}/`)
  }

  /**
   * Get campaign statistics
   * Django custom action: GET /api/campaigns/{id}/statistics/
   * Response: Statistics object
   */
  async getStatistics(id: number, params?: {
    start_date?: string
    end_date?: string
  }): Promise<any> {
    const response = await httpClient.get(`/campaigns/${id}/statistics/`, { params })
    return response.data
  }

  /**
   * Bulk operations (if implemented in backend)
   */
  async bulkDelete(ids: number[]): Promise<void> {
    await httpClient.post('/campaigns/bulk_delete/', { ids })
  }

  async bulkUpdate(ids: number[], data: Partial<CampaignUpdate>): Promise<void> {
    await httpClient.post('/campaigns/bulk_update/', { ids, data })
  }
}

export default new CampaignsService()

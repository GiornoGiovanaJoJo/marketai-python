import api from './api';

// Типы
interface AutomationRule {
  id: string;
  name: string;
  type: 'price_adjustment' | 'bid_management' | 'budget_control' | 'schedule';
  status: 'active' | 'paused' | 'draft';
  trigger: {
    type: 'time' | 'metric' | 'event';
    conditions: Record<string, any>;
  };
  actions: {
    type: string;
    parameters: Record<string, any>;
  }[];
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
}

interface PreDeliveryTask {
  id: string;
  productId: string;
  productName: string;
  warehouse: string;
  quantity: number;
  currentStock: number;
  requiredDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AutomationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  details?: Record<string, any>;
}

interface Filters {
  type?: string;
  status?: string;
  search?: string;
  warehouse?: string;
  priority?: string;
  ruleId?: string;
  dateRange?: { start: string; end: string };
  page?: number;
  pageSize?: number;
}

// API методы
export const automationService = {
  // === ПРАВИЛА АВТОМАТИЗАЦИИ ===
  
  async getRules(filters?: Filters): Promise<{ data: AutomationRule[]; total: number }> {
    const response = await api.get('/api/automation/rules', { params: filters });
    return response.data;
  },

  async getRule(id: string): Promise<AutomationRule> {
    const response = await api.get(`/api/automation/rules/${id}`);
    return response.data;
  },

  async createRule(rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationRule> {
    const response = await api.post('/api/automation/rules', rule);
    return response.data;
  },

  async updateRule(id: string, rule: Partial<AutomationRule>): Promise<AutomationRule> {
    const response = await api.put(`/api/automation/rules/${id}`, rule);
    return response.data;
  },

  async deleteRule(id: string): Promise<void> {
    await api.delete(`/api/automation/rules/${id}`);
  },

  async toggleRuleStatus(id: string): Promise<AutomationRule> {
    const response = await api.patch(`/api/automation/rules/${id}/toggle`);
    return response.data;
  },

  async executeRule(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/api/automation/rules/${id}/execute`);
    return response.data;
  },

  // === ЗАДАЧИ ПРЕДПОСТАВКИ ===
  
  async getTasks(filters?: Filters): Promise<{ data: PreDeliveryTask[]; total: number }> {
    const response = await api.get('/api/pre-delivery/tasks', { params: filters });
    return response.data;
  },

  async getTask(id: string): Promise<PreDeliveryTask> {
    const response = await api.get(`/api/pre-delivery/tasks/${id}`);
    return response.data;
  },

  async createTask(task: Omit<PreDeliveryTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<PreDeliveryTask> {
    const response = await api.post('/api/pre-delivery/tasks', task);
    return response.data;
  },

  async updateTask(id: string, task: Partial<PreDeliveryTask>): Promise<PreDeliveryTask> {
    const response = await api.put(`/api/pre-delivery/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/api/pre-delivery/tasks/${id}`);
  },

  async updateTaskStatus(
    id: string,
    status: PreDeliveryTask['status']
  ): Promise<PreDeliveryTask> {
    const response = await api.patch(`/api/pre-delivery/tasks/${id}/status`, { status });
    return response.data;
  },

  // === ЛОГИ ===
  
  async getLogs(filters?: Filters): Promise<{ data: AutomationLog[]; total: number }> {
    const response = await api.get('/api/automation/logs', { params: filters });
    return response.data;
  },

  async clearLogs(ruleId?: string): Promise<void> {
    await api.delete('/api/automation/logs', { params: { ruleId } });
  },

  // === СТАТИСТИКА ===
  
  async getAutomationStats(): Promise<any> {
    const response = await api.get('/api/automation/stats');
    return response.data;
  },

  async getPreDeliveryStats(): Promise<any> {
    const response = await api.get('/api/pre-delivery/stats');
    return response.data;
  },
};

export default automationService;

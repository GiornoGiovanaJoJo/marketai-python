import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для автоматизации
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

interface AutomationStats {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successRate: number;
  failedExecutions: number;
  lastExecution?: string;
}

interface PreDeliveryStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  urgentTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

interface AutomationState {
  // Данные
  rules: AutomationRule[];
  selectedRule: AutomationRule | null;
  
  preDeliveryTasks: PreDeliveryTask[];
  selectedTask: PreDeliveryTask | null;
  
  logs: AutomationLog[];
  
  stats: {
    automation: AutomationStats | null;
    preDelivery: PreDeliveryStats | null;
  };
  
  // UI состояние
  loading: {
    rules: boolean;
    tasks: boolean;
    logs: boolean;
    stats: boolean;
  };
  
  error: string | null;
  
  // Модальные окна
  modals: {
    createRule: boolean;
    editRule: boolean;
    createTask: boolean;
    editTask: boolean;
    viewLogs: boolean;
  };
  
  // Фильтры
  filters: {
    rules: {
      type: string;
      status: string;
      search: string;
    };
    tasks: {
      status: string;
      priority: string;
      warehouse: string;
      search: string;
    };
    logs: {
      ruleId: string;
      status: string;
      dateRange: { start: string; end: string };
    };
  };
  
  // Пагинация
  pagination: {
    rules: { page: number; pageSize: number; total: number };
    tasks: { page: number; pageSize: number; total: number };
    logs: { page: number; pageSize: number; total: number };
  };
}

const initialState: AutomationState = {
  rules: [],
  selectedRule: null,
  
  preDeliveryTasks: [],
  selectedTask: null,
  
  logs: [],
  
  stats: {
    automation: null,
    preDelivery: null,
  },
  
  loading: {
    rules: false,
    tasks: false,
    logs: false,
    stats: false,
  },
  
  error: null,
  
  modals: {
    createRule: false,
    editRule: false,
    createTask: false,
    editTask: false,
    viewLogs: false,
  },
  
  filters: {
    rules: {
      type: '',
      status: '',
      search: '',
    },
    tasks: {
      status: '',
      priority: '',
      warehouse: '',
      search: '',
    },
    logs: {
      ruleId: '',
      status: '',
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
    },
  },
  
  pagination: {
    rules: { page: 1, pageSize: 20, total: 0 },
    tasks: { page: 1, pageSize: 20, total: 0 },
    logs: { page: 1, pageSize: 50, total: 0 },
  },
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    // Правила автоматизации
    setRules(state, action: PayloadAction<AutomationRule[]>) {
      state.rules = action.payload;
    },
    
    addRule(state, action: PayloadAction<AutomationRule>) {
      state.rules.unshift(action.payload);
    },
    
    updateRule(state, action: PayloadAction<AutomationRule>) {
      const index = state.rules.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
    },
    
    deleteRule(state, action: PayloadAction<string>) {
      state.rules = state.rules.filter(r => r.id !== action.payload);
    },
    
    setSelectedRule(state, action: PayloadAction<AutomationRule | null>) {
      state.selectedRule = action.payload;
    },
    
    toggleRuleStatus(state, action: PayloadAction<string>) {
      const rule = state.rules.find(r => r.id === action.payload);
      if (rule) {
        rule.status = rule.status === 'active' ? 'paused' : 'active';
      }
    },
    
    // Задачи предпоставки
    setPreDeliveryTasks(state, action: PayloadAction<PreDeliveryTask[]>) {
      state.preDeliveryTasks = action.payload;
    },
    
    addTask(state, action: PayloadAction<PreDeliveryTask>) {
      state.preDeliveryTasks.unshift(action.payload);
    },
    
    updateTask(state, action: PayloadAction<PreDeliveryTask>) {
      const index = state.preDeliveryTasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.preDeliveryTasks[index] = action.payload;
      }
    },
    
    deleteTask(state, action: PayloadAction<string>) {
      state.preDeliveryTasks = state.preDeliveryTasks.filter(t => t.id !== action.payload);
    },
    
    setSelectedTask(state, action: PayloadAction<PreDeliveryTask | null>) {
      state.selectedTask = action.payload;
    },
    
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: PreDeliveryTask['status'] }>) {
      const task = state.preDeliveryTasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    
    // Логи
    setLogs(state, action: PayloadAction<AutomationLog[]>) {
      state.logs = action.payload;
    },
    
    addLog(state, action: PayloadAction<AutomationLog>) {
      state.logs.unshift(action.payload);
    },
    
    clearLogs(state) {
      state.logs = [];
    },
    
    // Статистика
    setAutomationStats(state, action: PayloadAction<AutomationStats>) {
      state.stats.automation = action.payload;
    },
    
    setPreDeliveryStats(state, action: PayloadAction<PreDeliveryStats>) {
      state.stats.preDelivery = action.payload;
    },
    
    // Модальные окна
    openModal(state, action: PayloadAction<keyof AutomationState['modals']>) {
      state.modals[action.payload] = true;
    },
    
    closeModal(state, action: PayloadAction<keyof AutomationState['modals']>) {
      state.modals[action.payload] = false;
    },
    
    closeAllModals(state) {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof AutomationState['modals']] = false;
      });
    },
    
    // Фильтры
    setRuleFilters(state, action: PayloadAction<Partial<AutomationState['filters']['rules']>>) {
      state.filters.rules = { ...state.filters.rules, ...action.payload };
    },
    
    setTaskFilters(state, action: PayloadAction<Partial<AutomationState['filters']['tasks']>>) {
      state.filters.tasks = { ...state.filters.tasks, ...action.payload };
    },
    
    setLogFilters(state, action: PayloadAction<Partial<AutomationState['filters']['logs']>>) {
      state.filters.logs = { ...state.filters.logs, ...action.payload };
    },
    
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    
    // Пагинация
    setPagination(state, action: PayloadAction<{ type: keyof AutomationState['pagination']; data: Partial<AutomationState['pagination']['rules']> }>) {
      state.pagination[action.payload.type] = { ...state.pagination[action.payload.type], ...action.payload.data };
    },
    
    // Загрузка
    setLoading(state, action: PayloadAction<{ type: keyof AutomationState['loading']; value: boolean }>) {
      state.loading[action.payload.type] = action.payload.value;
      if (action.payload.value) {
        state.error = null;
      }
    },
    
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof AutomationState['loading']] = false;
      });
    },
    
    clearError(state) {
      state.error = null;
    },
    
    // Сброс
    resetAutomationState() {
      return initialState;
    },
  },
});

export const {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  setSelectedRule,
  toggleRuleStatus,
  setPreDeliveryTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  updateTaskStatus,
  setLogs,
  addLog,
  clearLogs,
  setAutomationStats,
  setPreDeliveryStats,
  openModal,
  closeModal,
  closeAllModals,
  setRuleFilters,
  setTaskFilters,
  setLogFilters,
  resetFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  resetAutomationState,
} = automationSlice.actions;

export default automationSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для организации
interface Organization {
  id: string;
  name: string;
  inn: string;
  kpp: string;
  legalAddress: string;
  actualAddress: string;
  phone: string;
  email: string;
  director: string;
  accountant: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'inactive';
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  hireDate: string;
  status: 'active' | 'inactive' | 'vacation' | 'dismissed';
  avatar?: string;
  permissions: string[];
}

interface Partner {
  id: string;
  name: string;
  type: 'supplier' | 'client' | 'contractor';
  inn: string;
  kpp?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  contractNumber?: string;
  contractDate?: string;
  rating: number;
  totalDeals: number;
  totalAmount: number;
}

interface AccessPermission {
  id: string;
  userId: string;
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  scope: 'all' | 'own' | 'department';
  grantedBy: string;
  grantedAt: string;
}

interface OrganizationState {
  // Данные
  organization: Organization | null;
  employees: Employee[];
  partners: Partner[];
  permissions: AccessPermission[];
  
  // Выбранные сущности
  selectedEmployee: Employee | null;
  selectedPartner: Partner | null;
  
  // UI состояние
  loading: {
    organization: boolean;
    employees: boolean;
    partners: boolean;
    permissions: boolean;
  };
  
  error: string | null;
  
  // Модальные окна
  modals: {
    addEmployee: boolean;
    editEmployee: boolean;
    addPartner: boolean;
    editPartner: boolean;
    manageAccess: boolean;
  };
  
  // Фильтры
  filters: {
    employees: {
      search: string;
      department: string;
      role: string;
      status: string;
    };
    partners: {
      search: string;
      type: string;
      status: string;
    };
  };
  
  // Сортировка
  sorting: {
    employees: {
      field: 'name' | 'position' | 'hireDate' | 'status';
      order: 'asc' | 'desc';
    };
    partners: {
      field: 'name' | 'type' | 'rating' | 'totalAmount';
      order: 'asc' | 'desc';
    };
  };
}

const initialState: OrganizationState = {
  organization: null,
  employees: [],
  partners: [],
  permissions: [],
  
  selectedEmployee: null,
  selectedPartner: null,
  
  loading: {
    organization: false,
    employees: false,
    partners: false,
    permissions: false,
  },
  
  error: null,
  
  modals: {
    addEmployee: false,
    editEmployee: false,
    addPartner: false,
    editPartner: false,
    manageAccess: false,
  },
  
  filters: {
    employees: {
      search: '',
      department: '',
      role: '',
      status: '',
    },
    partners: {
      search: '',
      type: '',
      status: '',
    },
  },
  
  sorting: {
    employees: {
      field: 'name',
      order: 'asc',
    },
    partners: {
      field: 'name',
      order: 'asc',
    },
  },
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // Организация
    setOrganization(state, action: PayloadAction<Organization>) {
      state.organization = action.payload;
    },
    
    updateOrganization(state, action: PayloadAction<Partial<Organization>>) {
      if (state.organization) {
        state.organization = { ...state.organization, ...action.payload };
      }
    },
    
    // Сотрудники
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
    
    addEmployee(state, action: PayloadAction<Employee>) {
      state.employees.unshift(action.payload);
    },
    
    updateEmployee(state, action: PayloadAction<Employee>) {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    
    deleteEmployee(state, action: PayloadAction<string>) {
      state.employees = state.employees.filter(e => e.id !== action.payload);
    },
    
    setSelectedEmployee(state, action: PayloadAction<Employee | null>) {
      state.selectedEmployee = action.payload;
    },
    
    // Партнёры
    setPartners(state, action: PayloadAction<Partner[]>) {
      state.partners = action.payload;
    },
    
    addPartner(state, action: PayloadAction<Partner>) {
      state.partners.unshift(action.payload);
    },
    
    updatePartner(state, action: PayloadAction<Partner>) {
      const index = state.partners.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.partners[index] = action.payload;
      }
    },
    
    deletePartner(state, action: PayloadAction<string>) {
      state.partners = state.partners.filter(p => p.id !== action.payload);
    },
    
    setSelectedPartner(state, action: PayloadAction<Partner | null>) {
      state.selectedPartner = action.payload;
    },
    
    // Права доступа
    setPermissions(state, action: PayloadAction<AccessPermission[]>) {
      state.permissions = action.payload;
    },
    
    addPermission(state, action: PayloadAction<AccessPermission>) {
      state.permissions.push(action.payload);
    },
    
    updatePermission(state, action: PayloadAction<AccessPermission>) {
      const index = state.permissions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.permissions[index] = action.payload;
      }
    },
    
    deletePermission(state, action: PayloadAction<string>) {
      state.permissions = state.permissions.filter(p => p.id !== action.payload);
    },
    
    // Модальные окна
    openModal(state, action: PayloadAction<keyof OrganizationState['modals']>) {
      state.modals[action.payload] = true;
    },
    
    closeModal(state, action: PayloadAction<keyof OrganizationState['modals']>) {
      state.modals[action.payload] = false;
    },
    
    closeAllModals(state) {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof OrganizationState['modals']] = false;
      });
    },
    
    // Фильтры
    setEmployeeFilters(state, action: PayloadAction<Partial<OrganizationState['filters']['employees']>>) {
      state.filters.employees = { ...state.filters.employees, ...action.payload };
    },
    
    setPartnerFilters(state, action: PayloadAction<Partial<OrganizationState['filters']['partners']>>) {
      state.filters.partners = { ...state.filters.partners, ...action.payload };
    },
    
    resetEmployeeFilters(state) {
      state.filters.employees = initialState.filters.employees;
    },
    
    resetPartnerFilters(state) {
      state.filters.partners = initialState.filters.partners;
    },
    
    // Сортировка
    setEmployeeSorting(state, action: PayloadAction<OrganizationState['sorting']['employees']>) {
      state.sorting.employees = action.payload;
    },
    
    setPartnerSorting(state, action: PayloadAction<OrganizationState['sorting']['partners']>) {
      state.sorting.partners = action.payload;
    },
    
    // Загрузка
    setLoading(state, action: PayloadAction<{ type: keyof OrganizationState['loading']; value: boolean }>) {
      state.loading[action.payload.type] = action.payload.value;
      if (action.payload.value) {
        state.error = null;
      }
    },
    
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof OrganizationState['loading']] = false;
      });
    },
    
    clearError(state) {
      state.error = null;
    },
    
    // Сброс
    resetOrganizationState() {
      return initialState;
    },
  },
});

export const {
  setOrganization,
  updateOrganization,
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSelectedEmployee,
  setPartners,
  addPartner,
  updatePartner,
  deletePartner,
  setSelectedPartner,
  setPermissions,
  addPermission,
  updatePermission,
  deletePermission,
  openModal,
  closeModal,
  closeAllModals,
  setEmployeeFilters,
  setPartnerFilters,
  resetEmployeeFilters,
  resetPartnerFilters,
  setEmployeeSorting,
  setPartnerSorting,
  setLoading,
  setError,
  clearError,
  resetOrganizationState,
} = organizationSlice.actions;

export default organizationSlice.reducer;

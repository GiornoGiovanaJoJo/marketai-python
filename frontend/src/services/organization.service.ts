import api from './api';

// Типы
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

interface Filters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

// API методы
export const organizationService = {
  // === ОРГАНИЗАЦИЯ ===
  
  async getOrganization(): Promise<Organization> {
    const response = await api.get('/api/organization');
    return response.data;
  },

  async updateOrganization(data: Partial<Organization>): Promise<Organization> {
    const response = await api.put('/api/organization', data);
    return response.data;
  },

  // === СОТРУДНИКИ ===
  
  async getEmployees(filters?: Filters): Promise<{ data: Employee[]; total: number }> {
    const response = await api.get('/api/employees', { params: filters });
    return response.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  async createEmployee(employee: Omit<Employee, 'id' | 'createdAt'>): Promise<Employee> {
    const response = await api.post('/api/employees', employee);
    return response.data;
  },

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const response = await api.put(`/api/employees/${id}`, employee);
    return response.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/api/employees/${id}`);
  },

  async updateEmployeeStatus(
    id: string,
    status: Employee['status']
  ): Promise<Employee> {
    const response = await api.patch(`/api/employees/${id}/status`, { status });
    return response.data;
  },

  // === ПАРТНЁРЫ ===
  
  async getPartners(filters?: Filters): Promise<{ data: Partner[]; total: number }> {
    const response = await api.get('/api/partners', { params: filters });
    return response.data;
  },

  async getPartner(id: string): Promise<Partner> {
    const response = await api.get(`/api/partners/${id}`);
    return response.data;
  },

  async createPartner(partner: Omit<Partner, 'id' | 'createdAt'>): Promise<Partner> {
    const response = await api.post('/api/partners', partner);
    return response.data;
  },

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
    const response = await api.put(`/api/partners/${id}`, partner);
    return response.data;
  },

  async deletePartner(id: string): Promise<void> {
    await api.delete(`/api/partners/${id}`);
  },

  // === ПРАВА ДОСТУПА ===
  
  async getPermissions(userId?: string): Promise<AccessPermission[]> {
    const response = await api.get('/api/permissions', {
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },

  async getUserPermissions(userId: string): Promise<AccessPermission[]> {
    const response = await api.get(`/api/permissions/user/${userId}`);
    return response.data;
  },

  async grantPermission(
    permission: Omit<AccessPermission, 'id' | 'grantedAt'>
  ): Promise<AccessPermission> {
    const response = await api.post('/api/permissions', permission);
    return response.data;
  },

  async updatePermission(
    id: string,
    permission: Partial<AccessPermission>
  ): Promise<AccessPermission> {
    const response = await api.put(`/api/permissions/${id}`, permission);
    return response.data;
  },

  async revokePermission(id: string): Promise<void> {
    await api.delete(`/api/permissions/${id}`);
  },

  // === ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ===
  
  async getDepartments(): Promise<string[]> {
    const response = await api.get('/api/organization/departments');
    return response.data;
  },

  async getPositions(): Promise<string[]> {
    const response = await api.get('/api/organization/positions');
    return response.data;
  },

  async getRoles(): Promise<string[]> {
    const response = await api.get('/api/organization/roles');
    return response.data;
  },
};

export default organizationService;

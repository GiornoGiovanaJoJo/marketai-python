import api from './api';

// Типы для реферальной программы
interface ReferralStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  averageEarningPerReferral: number;
}

interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  level: number;
  directReferrals: number;
  totalReferrals: number;
  earnings: number;
}

interface ReferralIncome {
  id: string;
  date: string;
  amount: number;
  type: 'direct' | 'indirect';
  fromUser: string;
  status: 'pending' | 'paid';
}

interface ReferralPayout {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
}

interface ReferralSettings {
  referralCode: string;
  referralLink: string;
  autoWithdraw: boolean;
  minWithdrawAmount: number;
  notifications: {
    newReferral: boolean;
    earningsUpdate: boolean;
    payoutProcessed: boolean;
  };
}

interface ReferralFilters {
  period?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  pageSize?: number;
}

// API методы
export const referralService = {
  // Получить статистику
  async getStats(): Promise<ReferralStats> {
    const response = await api.get('/api/referral/stats');
    return response.data;
  },

  // Получить сеть рефералов
  async getNetwork(filters?: ReferralFilters): Promise<{ data: ReferralUser[]; total: number }> {
    const response = await api.get('/api/referral/network', { params: filters });
    return response.data;
  },

  // Получить доходы
  async getIncome(filters?: ReferralFilters): Promise<{ data: ReferralIncome[]; total: number }> {
    const response = await api.get('/api/referral/income', { params: filters });
    return response.data;
  },

  // Получить выплаты
  async getPayouts(filters?: ReferralFilters): Promise<{ data: ReferralPayout[]; total: number }> {
    const response = await api.get('/api/referral/payouts', { params: filters });
    return response.data;
  },

  // Получить настройки
  async getSettings(): Promise<ReferralSettings> {
    const response = await api.get('/api/referral/settings');
    return response.data;
  },

  // Обновить настройки
  async updateSettings(settings: Partial<ReferralSettings>): Promise<ReferralSettings> {
    const response = await api.put('/api/referral/settings', settings);
    return response.data;
  },

  // Запросить выплату
  async requestPayout(amount: number, method: string): Promise<ReferralPayout> {
    const response = await api.post('/api/referral/payouts', { amount, method });
    return response.data;
  },

  // Получить реферальную ссылку
  async getReferralLink(): Promise<{ code: string; link: string }> {
    const response = await api.get('/api/referral/link');
    return response.data;
  },

  // Регенерировать реферальный код
  async regenerateCode(): Promise<{ code: string; link: string }> {
    const response = await api.post('/api/referral/regenerate-code');
    return response.data;
  },
};

export default referralService;

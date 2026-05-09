import api from './api';

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  totalServices: number;
  totalMechanics: number;
  activeServices: number;
  completedServices: number;
  totalRevenue: number;
  monthlyRevenue: { _id: { year: number; month: number }; revenue: number; count: number }[];
  statusDistribution: { _id: string; count: number }[];
  priorityDistribution: { _id: string; count: number }[];
}

export interface RecentActivity {
  recentServices: any[];
  recentCustomers: any[];
}

const getStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

const getRecentActivity = async (): Promise<RecentActivity> => {
  const response = await api.get<RecentActivity>('/dashboard/recent');
  return response.data;
};

export default {
  getStats,
  getRecentActivity,
};

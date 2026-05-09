import api from './api';

export interface ServiceItem {
  name: string;
  description?: string;
  cost: number;
  duration: number;
}

export interface PartUsed {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ServiceRequest {
  _id: string;
  requestNumber: string;
  vehicle: any;
  customer: any;
  description: string;
  status: 'pending' | 'diagnosing' | 'waiting_parts' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  actualCost: number;
  estimatedCompletion?: string;
  completedDate?: string;
  assignedMechanic?: any;
  services: ServiceItem[];
  partsUsed: PartUsed[];
  notes?: string;
  createdBy?: any;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestResponse {
  serviceRequests: ServiceRequest[];
  totalPages: number;
  currentPage: number;
  totalRequests: number;
}

const getServiceRequests = async (
  page = 1,
  search = '',
  limit = 10,
  status = '',
  priority = ''
): Promise<ServiceRequestResponse> => {
  const response = await api.get<ServiceRequestResponse>('/services', {
    params: { page, search, limit, status: status || undefined, priority: priority || undefined },
  });
  return response.data;
};

const getServiceRequest = async (id: string): Promise<ServiceRequest> => {
  const response = await api.get<ServiceRequest>(`/services/${id}`);
  return response.data;
};

const createServiceRequest = async (data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
  const response = await api.post<ServiceRequest>('/services', data);
  return response.data;
};

const updateServiceRequest = async (
  id: string,
  data: Partial<ServiceRequest>
): Promise<ServiceRequest> => {
  const response = await api.put<ServiceRequest>(`/services/${id}`, data);
  return response.data;
};

const deleteServiceRequest = async (id: string): Promise<void> => {
  await api.delete(`/services/${id}`);
};

export default {
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
};

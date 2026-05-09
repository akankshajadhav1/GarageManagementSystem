import api from './api';

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  vehicles: any[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  customers: Customer[];
  totalPages: number;
  currentPage: number;
  totalCustomers: number;
}

const getCustomers = async (page = 1, search = '', limit = 10): Promise<CustomerResponse> => {
  const response = await api.get<CustomerResponse>('/customers', {
    params: { page, search, limit },
  });
  return response.data;
};

const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${id}`);
  return response.data;
};

const createCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  const response = await api.post<Customer>('/customers', customerData);
  return response.data;
};

const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
  const response = await api.put<Customer>(`/customers/${id}`, customerData);
  return response.data;
};

const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

export default {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/auth/users');
  return response.data;
};

export default {
  getUsers,
};
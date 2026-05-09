import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

const login = async (userData: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', userData);
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = (): AuthResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};

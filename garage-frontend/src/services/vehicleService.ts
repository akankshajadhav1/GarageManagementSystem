import api from './api';

export interface Vehicle {
  _id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  customer: any;
  serviceHistory: any[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleResponse {
  vehicles: Vehicle[];
  totalPages: number;
  currentPage: number;
  totalVehicles: number;
}

const getVehicles = async (page = 1, search = '', limit = 10): Promise<VehicleResponse> => {
  const response = await api.get<VehicleResponse>('/vehicles', {
    params: { page, search, limit },
  });
  return response.data;
};

const getVehicle = async (id: string): Promise<Vehicle> => {
  const response = await api.get<Vehicle>(`/vehicles/${id}`);
  return response.data;
};

const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await api.post<Vehicle>('/vehicles', vehicleData);
  return response.data;
};

const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await api.put<Vehicle>(`/vehicles/${id}`, vehicleData);
  return response.data;
};

const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};

export default {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};

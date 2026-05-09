import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vehicleService, { Vehicle, VehicleResponse } from '../../services/vehicleService';

interface VehicleState {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  totalPages: number;
  currentPage: number;
  totalVehicles: number;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  totalPages: 0,
  currentPage: 1,
  totalVehicles: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getVehicles = createAsyncThunk(
  'vehicles/getAll',
  async ({ page, search }: { page: number; search: string }, thunkAPI) => {
    try {
      return await vehicleService.getVehicles(page, search);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/create',
  async (vehicleData: Partial<Vehicle>, thunkAPI) => {
    try {
      return await vehicleService.createVehicle(vehicleData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/update',
  async ({ id, data }: { id: string; data: Partial<Vehicle> }, thunkAPI) => {
    try {
      return await vehicleService.updateVehicle(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/delete',
  async (id: string, thunkAPI) => {
    try {
      await vehicleService.deleteVehicle(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicles.pending, (state) => { state.isLoading = true; })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.vehicles;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalVehicles = action.payload.totalVehicles;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.vehicles.unshift(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const idx = state.vehicles.findIndex((v) => v._id === action.payload._id);
        if (idx !== -1) state.vehicles[idx] = action.payload;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.vehicles = state.vehicles.filter((v) => v._id !== action.payload);
      });
  },
});

export const { reset } = vehicleSlice.actions;
export default vehicleSlice.reducer;

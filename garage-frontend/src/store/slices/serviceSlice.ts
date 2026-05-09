import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceRequestService, { ServiceRequest, ServiceRequestResponse } from '../../services/serviceRequestService';

interface ServiceState {
  serviceRequests: ServiceRequest[];
  currentService: ServiceRequest | null;
  totalPages: number;
  currentPage: number;
  totalRequests: number;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: ServiceState = {
  serviceRequests: [],
  currentService: null,
  totalPages: 0,
  currentPage: 1,
  totalRequests: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getServiceRequests = createAsyncThunk(
  'services/getAll',
  async ({ page, search, status, priority }: { page: number; search: string; status?: string; priority?: string }, thunkAPI) => {
    try {
      return await serviceRequestService.getServiceRequests(page, search, 10, status, priority);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createServiceRequest = createAsyncThunk(
  'services/create',
  async (data: Partial<ServiceRequest>, thunkAPI) => {
    try {
      return await serviceRequestService.createServiceRequest(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateServiceRequest = createAsyncThunk(
  'services/update',
  async ({ id, data }: { id: string; data: Partial<ServiceRequest> }, thunkAPI) => {
    try {
      return await serviceRequestService.updateServiceRequest(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteServiceRequest = createAsyncThunk(
  'services/delete',
  async (id: string, thunkAPI) => {
    try {
      await serviceRequestService.deleteServiceRequest(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const serviceSlice = createSlice({
  name: 'services',
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
      .addCase(getServiceRequests.pending, (state) => { state.isLoading = true; })
      .addCase(getServiceRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceRequests = action.payload.serviceRequests;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalRequests = action.payload.totalRequests;
      })
      .addCase(getServiceRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceRequests.unshift(action.payload);
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const idx = state.serviceRequests.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.serviceRequests[idx] = action.payload;
      })
      .addCase(deleteServiceRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceRequests = state.serviceRequests.filter((s) => s._id !== action.payload);
      });
  },
});

export const { reset } = serviceSlice.actions;
export default serviceSlice.reducer;

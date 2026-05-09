import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService, { Customer, CustomerResponse } from '../../services/customerService';

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  totalPages: number;
  currentPage: number;
  totalCustomers: number;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  totalPages: 0,
  currentPage: 1,
  totalCustomers: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getCustomers = createAsyncThunk(
  'customers/getAll',
  async ({ page, search }: { page: number; search: string }, thunkAPI) => {
    try {
      return await customerService.getCustomers(page, search);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCustomer = createAsyncThunk(
  'customers/getOne',
  async (id: string, thunkAPI) => {
    try {
      return await customerService.getCustomer(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customerData: Partial<Customer>, thunkAPI) => {
    try {
      return await customerService.createCustomer(customerData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: string; data: Partial<Customer> }, thunkAPI) => {
    try {
      return await customerService.updateCustomer(id, data);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: string, thunkAPI) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalCustomers = action.payload.totalCustomers;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(getCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.customers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.customers = state.customers.filter((c) => c._id !== action.payload);
      });
  },
});

export const { reset, clearCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;

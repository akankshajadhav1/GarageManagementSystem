import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string; role?: string }, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message = 
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        error.response?.data?.message || 
        error.message || 
        'Registration failed';
      console.error('Registration error:', message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      const message = 
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        error.response?.data?.message || 
        error.message || 
        'Login failed';
      console.error('Login error:', message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

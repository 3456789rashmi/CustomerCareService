import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const token = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        localStorage.setItem('token', a.payload.token);
      })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Register failed' })

      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        localStorage.setItem('token', a.payload.token);
      })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || 'Login failed' })

      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload.user || a.payload;
      })
      .addCase(fetchCurrentUser.rejected, (s) => { /* ignore */ });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

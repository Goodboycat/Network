import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';
import { User, AuthTokens } from '@shared';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email: string;
    username: string;
    password: string;
    displayName: string;
  }) => {
    const response = await apiClient.register(data);
    return response.data;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiClient.login(email, password);
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await apiClient.logout();
});

export const getMe = createAsyncThunk('auth/getMe', async () => {
  const response = await apiClient.getMe();
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: AuthTokens;
      }>
    ) => {
      const { user, tokens } = action.payload;
      state.user = user as any;
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Store in localStorage
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as User;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as any;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;
export default authSlice.reducer;

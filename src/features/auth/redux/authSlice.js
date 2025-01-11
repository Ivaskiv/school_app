import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  logout,
  register,
  registerSchoolAndAdmin,
  // registerUser,
  setAuthToken,
} from './authOperations';

const initialState = {
  school: null,
  admin: null,
  user: null,
  token: null,
  roles: [],
  status: 'idle',
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.error = null;
      state.loading = false;
    },
    setRoles(state, action) {
      state.roles = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    const handlePending = state => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, { payload }) => {
      state.loading = false;

      if (payload?.token) {
        state.token = payload.token;
        setAuthToken(payload.token);
      } else {
        state.token = null;
      }

      state.user = payload?.user || null;
      state.roles = payload?.roles || [];
    };

    const handleRejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload || 'An error occurred';
    };

    builder
      .addCase(registerSchoolAndAdmin.pending, handlePending)
      .addCase(registerSchoolAndAdmin.fulfilled, handleFulfilled)
      .addCase(registerSchoolAndAdmin.rejected, handleRejected)
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(login.pending, handlePending)
      // .addCase(login.fulfilled, handleFulfilled)
      // .addCase(login.rejected, handleRejected)
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.roles = [];
        state.error = null;
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthState, setRoles, setUser, clearUser } = authSlice.actions;

export const selectUser = state => state.auth.user;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

export default authSlice.reducer;

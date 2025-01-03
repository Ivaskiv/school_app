import { createSlice } from '@reduxjs/toolkit';
import {
  loginAdmin,
  loginUser,
  logout,
  registerAdmin,
  registerSchoolAndAdminAsync,
  registerUser,
} from './authOperations';

const initialState = {
  school: null,
  admin: null,
  status: 'idle',
  error: null,
  user: null,
  token: null,
  loading: false,
  roles: [],
  currentUser: {},
};

const handlePending = state => {
  state.loading = true;
  state.error = null;
  state.status = 'loading';
};

const handleFulfilled = (state, action) => {
  state.loading = false;
  state.token = action.payload.token;
  state.user = action.payload.user;
  state.roles = action.payload.roles || [];
  state.status = 'succeeded';
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || 'An error occurred';
  state.status = 'failed';
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      state.roles = [];
      state.currentUser = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setRoles(state, action) {
      state.roles = action.payload;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerSchoolAndAdminAsync.pending, handlePending)
      .addCase(registerSchoolAndAdminAsync.fulfilled, handleFulfilled)
      .addCase(registerSchoolAndAdminAsync.rejected, handleRejected)

      .addCase(registerAdmin.pending, handlePending)
      .addCase(registerAdmin.fulfilled, handleFulfilled)
      .addCase(registerAdmin.rejected, handleRejected)

      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)

      .addCase(loginAdmin.pending, handlePending)
      .addCase(loginAdmin.fulfilled, handleFulfilled)
      .addCase(loginAdmin.rejected, handleRejected)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)

      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = null;
        state.roles = [];
      })
      .addCase(logout.rejected, handleRejected);
  },
});

export const { clearAuthState, setUser, setRoles, setCurrentUser, setToken } = authSlice.actions;

export const selectRoles = state => state.auth?.roles || [];
export const selectCurrentUser = state => state.auth?.currentUser || null;
export const selectIsAuthenticated = state => Boolean(state.auth.token);

export default authSlice.reducer;

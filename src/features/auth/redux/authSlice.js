//authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerAdmin, registerUser, loginAdmin, loginUser } from './authOperations';
import { logout } from './authOperations';

const initialState = {
  user: null,
  token: null,
  error: null,
  loading: null,
  roles: ['admin', 'user', 'manager', 'teacher', 'pupil'],
  currentUser: null,
};

const handlePending = state => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = null;
      state.roles = ['admin', 'user', 'manager', 'teacher', 'pupil'];
      state.currentUser = null;
    },
    setRoles(state, action) {
      state.roles = action.payload;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerAdmin.pending, handlePending)
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerAdmin.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginAdmin.pending, handlePending)
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginAdmin.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, handleRejected)
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, handleRejected);
  },
});

export const { clearAuthState, setRoles, setCurrentUser } = authSlice.actions;

export const selectRoles = state => state.auth?.roles || [];
export const selectCurrentUser = state => state.auth.currentUser;

export default authSlice.reducer;

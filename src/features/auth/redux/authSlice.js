//authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register, registerSchoolAndAdmin } from './authOperations';
import { getSchoolsData } from '../../schools/redux/schoolOperations';
// import { getAuth, sendEmailVerification } from 'firebase/auth';
// import { toast } from 'react-toastify';

const initialState = {
  user: { uid: null, email: null, displayName: null, role: null },
  isAuthenticated: false,
  loading: false,
  error: null,
  schools: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // login: (state, action) => {
    //   state.isAuthenticated = true;
    //   state.token = action.payload.token;
    // },
    // logout: state => {
    //   state.isAuthenticated = false;
    //   state.token = null;
    //   localStorage.removeItem('authToken');
    // },
    setAuthStatus: state => {
      const token = localStorage.getItem('authToken');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        // const auth = getAuth();
        // const user = auth.currentUser;

        // if (user && !user.emailVerified) {
        //   sendEmailVerification(user)
        //     .then(() => {
        //       toast.success('Verification email sent!');
        //       console.log('Verification email sent!');
        //     })
        //     .catch(error => {
        //       toast.error('Error sending verification email.');
        //       console.error('Error sending verification email:', error);
        //     });
        // }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerSchoolAndAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerSchoolAndAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSchoolsData.fulfilled, (state, action) => {
        state.schools = action.payload;
      })
      .addCase(getSchoolsData.rejected, (state, action) => {
        console.error('Failed to fetch schools:', action.payload);
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectUser = state => state.auth.user;
// export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

export default authSlice.reducer;

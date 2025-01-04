//authOperations.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginAdmin as loginAdminAPI,
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
  updateUser as updateUserAPI,
  logout as logoutAPI,
} from '../../../apiConfig';
import axios from '../../../../init';

const handleApiRequest = async (apiFunc, args, rejectWithValue) => {
  try {
    const response = await apiFunc(args);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Operation failed';
    return rejectWithValue(errorMsg);
  }
};

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

const createApiThunk = (actionType, apiFunc) =>
  createAsyncThunk(actionType, async (args, thunkAPI) =>
    handleApiRequest(apiFunc, args, thunkAPI.rejectWithValue)
  );

const loginWithToken = async (apiFunc, credentials, thunkAPI) => {
  try {
    const response = await apiFunc(credentials);
    setAuthToken(response.token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
};

export const registerSchoolAndAdmin = createAsyncThunk(
  'auth/registerSchoolAndAdmin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const registerAdmin = createApiThunk('auth/registerAdmin', registerSchoolAndAdmin);

export const loginAdmin = createApiThunk('auth/loginAdmin', (credentials, thunkAPI) =>
  loginWithToken(loginAdminAPI, credentials, thunkAPI)
);
export const registerUser = createApiThunk('auth/registerUser', registerUserAPI);

export const loginUser = createApiThunk('auth/loginUser', (credentials, thunkAPI) =>
  loginWithToken(loginUserAPI, credentials, thunkAPI)
);

export const updateUser = createApiThunk('auth/updateUser', updateUserAPI);

export const logout = createApiThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logoutAPI();
    setAuthToken(null);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

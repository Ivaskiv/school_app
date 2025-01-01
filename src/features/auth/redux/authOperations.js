import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerSchoolAndAdmin,
  loginAdmin as loginAdminAPI,
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
  updateUser as updateUserAPI,
  signOut,
} from '../../../apiConfig';

// Універсальна функція для обробки запитів API
const handleApiRequest = async (apiFunc, args, rejectWithValue) => {
  try {
    const data = await apiFunc(args);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Operation failed');
  }
};

// Реєстрація адміністратора школи
export const registerAdmin = createAsyncThunk('auth/registerAdmin', async (schoolData, thunkAPI) =>
  handleApiRequest(registerSchoolAndAdmin, schoolData, thunkAPI.rejectWithValue)
);

// Логін адміністратора
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (credentials, thunkAPI) =>
  handleApiRequest(loginAdminAPI, credentials, thunkAPI.rejectWithValue)
);

// Реєстрація звичайного користувача (адмін, менеджер, вчитель, учень)
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, thunkAPI) =>
  handleApiRequest(registerUserAPI, userData, thunkAPI.rejectWithValue)
);

// Логін звичайного користувача
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) =>
  handleApiRequest(loginUserAPI, credentials, thunkAPI.rejectWithValue)
);

// Вихід із системи
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) =>
  handleApiRequest(signOut, null, thunkAPI.rejectWithValue)
);

// Оновлення даних користувача
export const updateUser = createAsyncThunk('auth/updateUser', async ({ id, userData }, thunkAPI) =>
  handleApiRequest(updateUserAPI, { id, userData }, thunkAPI.rejectWithValue)
);

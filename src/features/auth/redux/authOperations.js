import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../../init';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebaseConfig';
import { setUser, clearUser } from './authSlice';

// Функція для встановлення токена авторизації
export const setAuthToken = token => {
  axios.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
};

// Загальна функція обробки помилок
const handleError = (error, rejectWithValue) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  toast.error(message);
  return rejectWithValue(message);
};

export const listenAuthState = dispatch => {
  onAuthStateChanged(auth, async user => {
    if (user && !user.emailVerified) {
      toast.success('Please confirm your email before continuing.');
      const token = await user.getIdToken();
      setAuthToken(token);
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
    } else {
      setAuthToken(null);
      dispatch(clearUser());
    }
  });
};

export const registerSchoolAndAdmin = createAsyncThunk(
  'auth/registerSchoolAndAdmin',
  async ({ email, password, adminName, schoolName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: adminName });

      const schoolRef = doc(db, 'schools', user.uid);
      await setDoc(schoolRef, {
        name: schoolName,
        principal: { id: user.uid, name: adminName, role: 'Principal' },
        admins: [{ id: user.uid, name: adminName, role: 'Main Admin' }],
        createdAt: new Date(),
      });

      toast.success('School and Admin registered successfully!');
      return {
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        schoolId: user.uid,
      };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Реєстрація користувача
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name, role, schoolName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = role === 'SchoolAdmin' ? schoolName : name;
      await updateProfile(user, { displayName });

      const docRef =
        role === 'SchoolAdmin' ? doc(db, 'schools', user.uid) : doc(db, 'users', user.uid);
      const docData =
        role === 'SchoolAdmin'
          ? {
              name: schoolName,
              principal: { id: user.uid, name, role: 'Principal' },
              admins: [{ id: user.uid, name, role: 'Main Admin' }],
              createdAt: new Date(),
            }
          : {
              uid: user.uid,
              email: user.email,
              displayName,
              role,
              createdAt: new Date(),
            };

      await setDoc(docRef, docData);
      return { uid: user.uid, email: user.email, displayName, role };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Логін
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    if (!email || !password) {
      toast.error('Email and password are required!');
      return rejectWithValue('Invalid input');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      setAuthToken(token);
      toast.success(`Welcome, ${user.displayName || 'User'}!`);
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        toast.warn('Your email is not verified. Verification email sent.');
      }
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Логаут
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return {};
  } catch (error) {
    return handleError(error, rejectWithValue);
  }
});

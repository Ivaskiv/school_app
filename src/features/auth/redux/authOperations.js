import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../../init';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebaseConfig';

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
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
        principal: {
          id: user.uid,
          name: adminName,
          role: 'Principal',
        },
        admins: [
          {
            id: user.uid,
            name: adminName,
            role: 'Main Admin',
          },
        ],
        classes: [],
        teachers: [],
        subjects: [],
        students: [],
        createdAt: new Date(),
      });

      console.log('School and Admin registered successfully!');
      toast.success('School and Admin registered successfully!');
      return {
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        schoolId: user.uid,
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error setting up request');
      }
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

//! firebase
const saveUserData = async userCredential => {
  try {
    const user = userCredential.user;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'User',
      createdAt: new Date(),
    });
    console.log('User data saved successfully!');
  } catch (error) {
    console.error('Error saving user data:', error.message);
  }
};
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name, role, schoolName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = role === 'SchoolAdmin' ? schoolName : name;
      await updateProfile(user, { displayName });
      await saveUserData(userCredential);
      return {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     if (!email || !password) {
//       toast.error('Email and password are required!');
//       return rejectWithValue('Invalid input');
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const token = await user.getIdToken();
//       setAuthToken(token);
//       toast.success(`Welcome, ${user.displayName || 'User'}!`);

//       return {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//       };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Login failed');
//     }
//   }
// );
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return {};
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
// export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
//   try {
//     console.log('Logging out...');
//     await signOut(auth);
//     setAuthToken(null);
//     toast.success('Successfully logged out!');
//     return null;
//   } catch (error) {
//     console.error('Logout error:', error.message);
//     toast.error(error.message || 'Logout failed');
//     return rejectWithValue(error.message || 'Logout failed');
//   }
// });

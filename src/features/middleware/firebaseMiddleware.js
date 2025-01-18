//firebaseMiddleware.js

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig.js';
import { createAsyncThunk } from '@reduxjs/toolkit';

const firebaseMiddleware = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { email };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default firebaseMiddleware;

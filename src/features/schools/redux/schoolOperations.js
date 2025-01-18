//schoolOperations.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { setSchools } from './schoolsSlice';
import axios from 'axios';

export const updateSchool = createAsyncThunk(
  'schools/updateSchool',
  async ({ school_id, updatedSchoolData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/schools/${school_id}`, updatedSchoolData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getSchoolById = createAsyncThunk(
  'schools/fetchSchoolById',
  async (schoolId, { rejectWithValue }) => {
    console.log(`Fetching school with ID: ${schoolId}...`);

    // Перевірка наявності schoolId і його правильного типу
    if (!schoolId || typeof schoolId !== 'string') {
      console.error('Invalid schoolId:', schoolId);
      return rejectWithValue('Invalid school ID');
    }

    try {
      const db = getDatabase();
      const schoolRef = ref(db, `schools/${schoolId}`); // Отримання шляху до школи
      const snapshot = await get(schoolRef); // Запит до Firebase

      if (!snapshot.exists()) {
        console.error('School not found');
        return rejectWithValue('School not found');
      }

      const school = snapshot.val();
      console.log('Fetched school:', school);

      return {
        ...school,
        school_id: schoolId, // Додаємо ID школи до результату
      };
    } catch (error) {
      console.error('Error fetching school:', error.message);
      return rejectWithValue(error.message || 'Error fetching school');
    }
  }
);

export const getSchoolsData = createAsyncThunk(
  'schools/fetchSchools',
  async (_, { rejectWithValue }) => {
    try {
      const db = getDatabase();
      const schoolsRef = ref(db, 'schools');
      const snapshot = await get(schoolsRef);
      console.log('Snapshot exists:', snapshot.exists());
      if (snapshot.exists()) {
        console.log('Schools data:', snapshot.val());
        return snapshot.val();
      } else {
        throw new Error('No data available');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const subscribeToSchools = createAsyncThunk(
  'schools/subscribeSchools',
  (_, { dispatch, rejectWithValue }) => {
    try {
      const db = getDatabase();
      const schoolsRef = ref(db, 'schools');

      const unsubscribe = onValue(schoolsRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const schoolsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          dispatch(setSchools(schoolsArray));
        } else {
          dispatch(setSchools([]));
        }
      });

      return () => unsubscribe();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

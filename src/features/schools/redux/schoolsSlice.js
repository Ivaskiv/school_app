import { createSlice } from '@reduxjs/toolkit';
import { getSchoolById, getSchoolsData, updateSchool } from './schoolOperations';

const initialState = {
  schools: [],
  status: 'idle',
  error: null,
  loading: false,
};

const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    setSchools: (state, action) => {
      state.schools = action.payload;
    },
    setSelectedSchool: (state, action) => {
      state.selectedSchool = action.payload;
    },
    updateSchools: (state, action) => {
      action.payload.forEach(updatedSchool => {
        const index = state.schools.findIndex(
          school => school.school_id === updatedSchool.school_id
        );
        if (index >= 0) {
          state.schools[index] = updatedSchool;
        } else {
          state.schools.push(updatedSchool);
        }
      });
    },

    addItem: (state, action) => {
      const { field, item } = action.payload;
      console.log('addItem called:', { field, item });

      if (Array.isArray(state[field])) {
        state[field] = [...state[field], item];
        console.log(`Updated ${field}:`, state[field]);
      } else {
        console.warn(`Field "${field}" is not a valid array`);
      }
    },
    deleteItem: (state, action) => {
      const { field, itemId } = action.payload;
      console.log('deleteItem called:', { field, itemId });

      if (Array.isArray(state[field])) {
        state[field] = state[field].filter(item => item.id !== itemId);
        console.log(`Updated ${field}:`, state[field]);
      } else {
        console.warn(`Field "${field}" is not a valid array`);
      }
    },
    updItems: (state, action) => {
      const { field, itemId, updatedData } = action.payload;
      console.log('updItems called:', { field, itemId, updatedData });

      if (Array.isArray(state[field])) {
        const index = state[field].findIndex(item => item.id === itemId);
        if (index >= 0) {
          state[field][index] = { ...state[field][index], ...updatedData };
          console.log(`Updated item in ${field}:`, state[field][index]);
        } else {
          console.warn(`Item with id ${itemId} not found in ${field}`);
        }
      } else {
        console.error(`Field "${field}" is not a valid array`);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getSchoolsData.pending, state => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(getSchoolsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.schools = Object.keys(action.payload).map(key => ({
          school_id: key,
          ...action.payload[key],
        }));
      })
      .addCase(getSchoolsData.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSchool.pending, state => {
        state.loading = true;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.schools.findIndex(school => school.id === action.payload.id);
        if (index >= 0) {
          state.schools[index] = action.payload;
        } else {
          console.warn(`School with id ${action.payload.id} not found for update`);
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSchoolById.pending, state => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
        state.selectedSchool = null;
      })
      .addCase(getSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        const fetchedSchool = action.payload;
        const existingSchoolIndex = state.schools.findIndex(
          school => school.school_id === fetchedSchool.school_id
        );

        if (existingSchoolIndex >= 0) {
          state.schools[existingSchoolIndex] = fetchedSchool;
        } else {
          state.schools.push(fetchedSchool);
        }
      })
      .addCase(getSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSchools, addItem, deleteItem, updItems, updateSchools } = schoolsSlice.actions;
export default schoolsSlice.reducer;

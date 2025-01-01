import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  school: [],
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { field, item } = action.payload;
      console.log('addItem called:', { field, item });

      if (state[field]) {
        state[field] = [...state[field], item];
      } else {
        state[field] = [item];
      }
      console.log(`Updated ${field}:`, state[field]);
    },
    deleteItem: (state, action) => {
      const { field, itemId } = action.payload;
      console.log('deleteItem called:', { field, itemId });

      if (state[field] && Array.isArray(state[field])) {
        state[field] = state[field].filter(item => item.id !== itemId);
      } else {
        console.warn(`Field ${field} is not a valid array`);
      }

      console.log(`Updated ${field}:`, state[field]);
    },
    updItems: (state, action) => {
      const { field, itemId, updatedData } = action.payload;
      console.log('updItems called:', { field, itemId, updatedData });
      if (!state[field] || !Array.isArray(state[field])) {
        console.error(`Поле "${field}" не існує або не є масивом`);
        return;
      }
      const item = state[field].find(i => i.id === itemId);
      if (item) {
        Object.assign(item, updatedData);
      }
    },
  },
});

export const { addItem, deleteItem, updTeachers, updItems } = schoolSlice.actions;
export default schoolSlice.reducer;

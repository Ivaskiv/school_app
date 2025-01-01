import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjectsClasses: [
    { subjectId: 1, classIds: [1, 2] },
    { subjectId: 2, classIds: [3] },
  ],
};

const subjectsClassesSlice = createSlice({
  name: 'subjectsClasses',
  initialState,
  reducers: {
    addSubjectsClassesRelation: (state, action) => {
      const { subjectId, classId } = action.payload;
      if (!state[subjectId]) {
        state[subjectId] = [];
      }
      if (!state[subjectId].includes(classId)) {
        state[subjectId].push(classId);
      }
    },
    removeSubjectsClassesRelation: (state, action) => {
      const { subjectId, classId } = action.payload;
      if (state[subjectId]) {
        state[subjectId] = state[subjectId].filter(id => id !== classId);
      }
    },
  },
});

export const { addSubjectsClassesRelation, removeSubjectsClassesRelation } =
  subjectsClassesSlice.actions;
export default subjectsClassesSlice.reducer;

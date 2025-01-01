import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pupilsSubjects: [
    { pupilId: 1, subjectIds: [1, 2] },
    { pupilId: 2, subjectIds: [3, 4] },
  ],
};

const pupilsSubjectsSlice = createSlice({
  name: 'pupilsSubjects',
  initialState,
  reducers: {
    addPupilSubjectRelation: (state, action) => {
      const { pupilId, subjectId } = action.payload;
      if (!state[pupilId]) {
        state[pupilId] = [];
      }
      if (!state[pupilId].includes(subjectId)) {
        state[pupilId].push(subjectId);
      }
    },
    removePupilSubjectRelation: (state, action) => {
      const { pupilId, subjectId } = action.payload;
      if (state[pupilId]) {
        state[pupilId] = state[pupilId].filter(id => id !== subjectId);
      }
    },
  },
});

export const { addPupilSubjectRelation, removePupilSubjectRelation } = pupilsSubjectsSlice.actions;
export default pupilsSubjectsSlice.reducer;

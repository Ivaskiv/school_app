import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjectsPupils: [
    { subjectId: 1, pupilIds: [1, 2] },
    { subjectId: 2, pupilIds: [3] },
  ],
};

const subjectsPupilsSlice = createSlice({
  name: 'subjectsPupils',
  initialState,
  reducers: {
    addSubjectPupilRelation: (state, action) => {
      const { subjectId, pupilId } = action.payload;
      if (!state[subjectId]) {
        state[subjectId] = [];
      }
      if (!state[subjectId].includes(pupilId)) {
        state[subjectId].push(pupilId);
      }
    },
    removeSubjectPupilRelation: (state, action) => {
      const { subjectId, pupilId } = action.payload;
      if (state[subjectId]) {
        state[subjectId] = state[subjectId].filter(id => id !== pupilId);
      }
    },
  },
});

export const { addSubjectPupilRelation, removeSubjectPupilRelation } = subjectsPupilsSlice.actions;
export default subjectsPupilsSlice.reducer;

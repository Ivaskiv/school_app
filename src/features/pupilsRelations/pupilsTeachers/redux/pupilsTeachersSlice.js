import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pupilsTeachers: [
    { pupilId: 1, teacherIds: [1, 2] },
    { pupilId: 2, teacherIds: [3, 4] },
  ],
};
const pupilsTeachersSlice = createSlice({
  name: 'pupilsTeachers',
  initialState,
  reducers: {
    addPupilTeacherRelation: (state, action) => {
      const { pupilId, teacherId } = action.payload;
      if (!state[pupilId]) {
        state[pupilId] = [];
      }
      if (!state[pupilId].includes(teacherId)) {
        state[pupilId].push(teacherId);
      }
    },
    removePupilTeacherRelation: (state, action) => {
      const { pupilId, teacherId } = action.payload;
      if (state[pupilId]) {
        state[pupilId] = state[pupilId].filter(id => id !== teacherId);
      }
    },
  },
});

export const { addPupilTeacherRelation, removePupilTeacherRelation } = pupilsTeachersSlice.actions;
export default pupilsTeachersSlice.reducer;

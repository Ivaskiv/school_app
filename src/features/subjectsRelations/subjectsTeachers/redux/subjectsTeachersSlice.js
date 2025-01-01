import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  subjectsTeachers: [
    { subjectId: 1, teacherIds: [1, 2] },
    { subjectId: 2, teacherIds: [3] },
  ],
};

const subjectsTeachersSlice = createSlice({
  name: 'subjectsTeachers',
  initialState,
  reducers: {
    addSubjectTeacherRelation: (state, action) => {
      const { subjectId, teacherId } = action.payload;
      if (!state[subjectId]) {
        state[subjectId] = [];
      }
      if (!state[subjectId].includes(teacherId)) {
        state[subjectId].push(teacherId);
      }
    },
    removeSubjectTeacherRelation: (state, action) => {
      const { subjectId, teacherId } = action.payload;
      if (state[subjectId]) {
        state[subjectId] = state[subjectId].filter(id => id !== teacherId);
      }
    },
  },
});

export const { addSubjectTeacherRelation, removeSubjectTeacherRelation } =
  subjectsTeachersSlice.actions;
export default subjectsTeachersSlice.reducer;

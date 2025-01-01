import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classTeacher: [
    { classId: 1, teacherId: 1 },
    { classId: 2, teacherId: 3 },
  ],
};

const classTeacherSlice = createSlice({
  name: 'classTeacher',
  initialState,
  reducers: {
    //setClassTeacher - для призначення класного керівника для певного класу
    setClassTeacher: (state, action) => {
      const { classId, teacherId } = action.payload;
      const classItem = state.classTeacher.find(ct => ct.classId === classId);

      if (classItem) {
        if (classItem.teacherIds.includes(teacherId)) {
          classItem.classTeacherId = teacherId;
        } else {
          throw new Error(
            `Teacher with ID ${teacherId} is not assigned to class with ID ${classId}`
          );
        }
      } else {
        throw new Error(`Class with ID ${classId} not found`);
      }
    },
  },
});

export const { setClassTeacher } = classTeacherSlice.actions;

export default classTeacherSlice.reducer;

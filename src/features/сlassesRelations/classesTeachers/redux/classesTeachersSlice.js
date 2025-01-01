import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classesTeachers: [
    { classId: 1, teacherIds: [1, 2] },
    { classId: 2, teacherIds: [3] },
  ],
};

const classesTeachersSlice = createSlice({
  name: 'classesTeachers',
  initialState,
  reducers: {
    addClassTeacherRelation: (state, action) => {
      const { classId, teacherIds } = action.payload;

      // + класи до вчителів
      teacherIds.forEach(teacherId => {
        const existingRelation = state.classesTeachers.find(
          ct => ct.classId === classId && ct.teacher.id === teacherId
        );

        // ящо зв'язок не існує, + новий
        if (!existingRelation) {
          state.classesTeachers.push({ classId, teacherId });
        }
      });
    },

    removeClassTeacherRelation: (state, action) => {
      const { classId, teacherIds } = action.payload;
      state.classesTeachers = state.classesTeachers.filter(
        ct => !(ct.classId === classId && teacherIds.includes(ct.teacher.id))
      );
    },

    updateTeacherClassRelations: (state, action) => {
      const { classId, teacherIds } = action.payload;

      // - всі зв'язки для цього класу
      state.classesTeachers = state.classesTeachers.filter(ct => ct.classId !== classId);

      // + нові зв'язки для цього класу
      teacherIds.forEach(teacherId => {
        state.classesTeachers.push({ classId, teacherId });
      });
    },
  },
});

export const { addClassTeacherRelation, removeClassTeacherRelation, updateTeacherClassRelations } =
  classesTeachersSlice.actions;

export default classesTeachersSlice.reducer;
// export const selectTeachersByClass = (state, classId) =>
//   state.classesTeachers.teachersByClass[classId] || [];

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teachersClasses: [
    { teacherId: 1, classIds: [1, 2] },
    { teacherId: 2, classIds: [3] },
  ],
};

const teachersClassesSlice = createSlice({
  name: 'teachersClasses',
  initialState,
  reducers: {
    addTeacherClassRelation: (state, action) => {
      const { teacherId, classIds } = action.payload;
      const teacherRelation = state.teachersClasses.find(
        relation => relation.teacherId === teacherId
      );

      if (teacherRelation) {
        classIds.forEach(id => {
          if (!teacherRelation.classIds.includes(id)) {
            teacherRelation.classIds.push(id);
          }
        });
      } else {
        state.teachersClasses.push({
          teacherId,
          classIds: classIds,
        });
      }
    },

    removeTeacherClassRelation: (state, action) => {
      const { teacherId, classIds } = action.payload;
      const teacherRelation = state.teachersClasses.find(
        relation => relation.teacherId === teacherId
      );

      if (teacherRelation) {
        teacherRelation.classIds = teacherRelation.classIds.filter(id => !classIds.includes(id));
      }
    },

    updateTeacherClasses: (state, action) => {
      const { teacherId, classIds } = action.payload;
      const teacherRelation = state.teachersClasses.find(
        relation => relation.teacherId === teacherId
      );

      if (teacherRelation) {
        teacherRelation.classIds = Array.isArray(classIds) ? classIds : [];
      }
    },
  },
});

export const { addTeacherClassRelation, removeTeacherClassRelation, updateTeacherClasses } =
  teachersClassesSlice.actions;

export default teachersClassesSlice.reducer;

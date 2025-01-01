import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teachersSubjects: [
    { teacherId: 1, subjectIds: [1, 2] },
    { teacherId: 2, subjectIds: [3] },
  ],
};

const teachersSubjectsSlice = createSlice({
  name: 'teachersSubjects',
  initialState,
  reducers: {
    addTeachersSubjectRelation: (state, action) => {
      const { teacherId, subjectIds } = action.payload;
      const teacherRelation = state.teachersSubjects.find(ts => ts.teacherId === teacherId);

      if (teacherRelation) {
        teacherRelation.subjectIds = [...new Set([...teacherRelation.subjectIds, ...subjectIds])];
      } else {
        state.teachersSubjects.push({ teacherId, subjectIds });
      }
    },

    removeTeacherSubjectRelation: (state, action) => {
      const { teacherId, subjectIds } = action.payload;
      const teacherRelation = state.teachersSubjects.find(ts => ts.teacherId === teacherId);

      if (teacherRelation) {
        teacherRelation.subjectIds = teacherRelation.subjectIds.filter(
          subjectId => !subjectIds.includes(subjectId)
        );
        if (teacherRelation.subjectIds.length === 0) {
          state.teachersSubjects = state.teachersSubjects.filter(ts => ts.teacherId !== teacherId);
        }
      }
    },

    updateTeacherSubjectRelation(state, action) {
      const { teacherId, subjectIds } = action.payload;
      // 1 оновлення  викладача і предметів
      const teacherRelation = state.teachersSubjects.find(ts => ts.teacherId === teacherId);
      if (teacherRelation) {
        // + нові предмети, без дублікатів
        teacherRelation.subjectIds = [...new Set([...teacherRelation.subjectIds, ...subjectIds])];
      } else {
        // якщо викладач не знайдений, додаємо нового
        state.teachersSubjects.push({ teacherId, subjectIds });
      }
      // 2. оновлення зв'язків між класами і предметами для викладача
      const teacherClasses = state.teachersClasses?.find(
        relation => relation.teacherId === teacherId
      );
      if (teacherClasses) {
        subjectIds.forEach(subjectId => {
          // чи є вже зв'язок класу з цим предметом
          const existingClassSubject = state.classesSubjects?.some(
            rel =>
              rel.subjectIds.includes(subjectId) && teacherClasses.classIds.includes(rel.classId)
          );
          // якщо немає, додати  новий зв'язок
          if (!existingClassSubject) {
            teacherClasses.classIds.forEach(classId => {
              state.classesSubjects.push({
                classId,
                subjectIds: [subjectId],
              });
            });
          }
        });
      }
    },
  },
});

export const {
  updateTeacherSubjectRelation,
  addTeachersSubjectRelation,
  removeTeacherSubjectRelation,
} = teachersSubjectsSlice.actions;

export default teachersSubjectsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teachersPupils: [
    { teacherId: 1, pupilIds: [1, 2] },
    { teacherId: 2, pupilIds: [3] },
  ],
};

const teachersPupilsSlice = createSlice({
  name: 'teachersPupils',
  initialState,
  reducers: {
    addTeachersSubjectRelation: (state, action) => {
      const { teacherId, subjectId } = action.payload;
      if (!state[teacherId]) {
        state[teacherId] = [];
      }
      if (!state[teacherId].includes(subjectId)) {
        state[teacherId].push(subjectId);
      }
    },

    // addTeachersSubjectRelation: (state, action) => {
    //   const { teacherId, subjectIds } = action.payload;
    //   const teacher = state.teachersSubjects.find(teacher => teacher.teacherId === teacherId);

    //   if (teacher) {
    //     teacher.subjectIds = [...new Set([...teacher.subjectIds, ...subjectIds])];
    //   } else {
    //     state.teachersSubjects.push(action.payload);
    //   }
    // },
    removeTeacherSubjectRelation: (state, action) => {
      const { teacherId, subjectId } = action.payload;
      if (state[teacherId]) {
        state[teacherId] = state[teacherId].filter(id => id !== subjectId);
      }
    },

    // removeTeacherSubjectRelation: (state, action) => {
    //   const { teacherId, subjectIds } = action.payload;
    //   const teacher = state.teachersSubjects.find(teacher => teacher.teacherId === teacherId);

    //   if (teacher) {
    //     teacher.subjectIds = teacher.subjectIds.filter(id => !subjectIds.includes(id));
    //     if (teacher.subjectIds.length === 0) {
    //       state.teachersSubjects = state.teachersSubjects.filter(
    //         teacher => teacher.teacherId !== teacherId
    //       );
    //     }
    //   }
    // },
    updateTeacherSubjectRelation(state, action) {
      const { teacherId, subjectIds } = action.payload;
      // 1 оновлення  викладача і предметів
      const teacher = state.teachersSubjects.find(rel => rel.teacherId === teacherId);
      if (teacher) {
        // + нові предмети, без дублікатів
        teacher.subjectIds = [...new Set([...teacher.subjectIds, ...subjectIds])];
      } else {
        // якщо викладач не знайдений, додаємо нового
        state.teachersSubjects.push({ teacherId, subjectIds });
      }
      // 2. оновлення зв'язків між класами і предметами для викладача
      const teacherClasses = state.teachersClasses.find(
        relation => relation.teacherId === teacherId
      );
      if (teacherClasses) {
        subjectIds.forEach(subjectId => {
          // чи є вже зв'язок класу з цим предметом
          const existingClassSubject = state.classesSubjects.some(
            rel =>
              rel.subjectIds.includes(subjectId) && teacherClasses.classIds.includes(rel.classId)
          );
          // якщо немає, додаємо новий зв'язок
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
  // setTeachersSubjects,
  updateTeacherSubjectRelation,
  addTeachersSubjectRelation,
  removeTeacherSubjectRelation,
} = teachersPupilsSlice.actions;

export default teachersPupilsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjects: [
    { id: 101, name: 'Mathematics' },
    { id: 102, name: 'Physics' },
    { id: 103, name: 'Chemistry' },
  ],
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject: (state, action) => {
      state.subjects.push(action.payload);

      // const newSubject = action.payload;
      // state.subjects.push(newSubject);

      // state.teachersClasses.push({ subjectId: newSubject.id, classIds: [] });
      // state.teachersSubjects.push({ subjectId: newSubject.id, teacherIds: [] });
      // state.teachersClassesSubjects.push({
      //   subjectId: newSubject.id,
      //   teacherIds: [],
      //   classIds: [],
      // });
    },
    addSubjectToClass: (state, action) => {
      const { subjectId, newClassId } = action.payload;
      const subject = state.subjects.find(subject => subject.id === subjectId);

      if (subject) {
        subject.classId = newClassId;

        const subjectClass = state.subjectsClasses.find(item => item.subjectId === subjectId);
        if (subjectClass) {
          subjectClass.classId = newClassId;
        }

        const subjectClassesSubjects = state.subjectsClassesSubjects.find(
          item => item.subjectId === subjectId
        );
        if (subjectClassesSubjects) {
          subjectClassesSubjects.classId = newClassId;
        }
      }
    },

    updateSubject: (state, action) => {
      const { id, data } = action.payload;
      const index = state.subjects.findIndex(subject => subject.id === id);
      if (index !== -1) {
        state.subjects[index] = { ...state.subjects[index], ...data };
      }
    },

    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(subject => subject.id !== action.payload);

      // const subjectId = action.payload;
      // state.subjects = state.subjects.filter(subject => subject.id !== subjectId);

      // state.teachersClasses = state.teachersClasses.filter(item => item.subjectId !== subjectId);
      // state.teachersSubjects = state.teachersSubjects.filter(item => item.subjectId !== subjectId);
      // state.teachersClassesSubjects = state.teachersClassesSubjects.filter(
      //   item => item.subjectId !== subjectId
      // );
    },
    // addTeacherToSubject: (state, action) => {
    //   const { subjectId, teacherId } = action.payload;
    //   const subject = state.teachersSubjects.find(sub => sub.subjectId === subjectId);

    //   if (subject && !subject.teacherIds.includes(teacherId)) {
    //     subject.teacherIds.push(teacherId);
    //   }
    // },
    // removeTeacherSubjectRelation: (state, action) => {
    //   const { subjectId, teacherId } = action.payload;
    //   const subject = state.teachersSubjects.find(sub => sub.subjectId === subjectId);

    //   if (subject) {
    //     subject.teacherIds = subject.teacherIds.filter(id => id !== teacherId);
    //   }
    // },
  },
});

export const {
  addSubject,
  updateSubject,
  removeSubject,
  addSubjectToClass,
  // addTeacherToSubject,
  // removeTeacherSubjectRelation,
} = subjectsSlice.actions;

export default subjectsSlice.reducer;

export const selectSubjects = state => state.subjects.subjects;

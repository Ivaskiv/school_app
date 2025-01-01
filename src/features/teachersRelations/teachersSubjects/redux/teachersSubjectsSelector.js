import { createSelector } from 'reselect';

export const selectTeachersSubjects = state => state.teachersSubjects.teachersSubjects;

export const selectSubjectsByTeacher = createSelector(
  [selectTeachersSubjects, (state, teacherId) => teacherId],
  (teachersSubjects, teacherId) => {
    const teacher = teachersSubjects.find(ts => ts.teacherId === teacherId);
    return teacher ? teacher.subjectIds : [];
  }
);

export const selectTeachersBySubject = createSelector(
  [selectTeachersSubjects, (state, subjectId) => subjectId],
  (teachersSubjects, subjectId) => {
    return teachersSubjects.filter(ts => ts.subjectIds.includes(subjectId)).map(ts => ts.teacherId);
  }
);

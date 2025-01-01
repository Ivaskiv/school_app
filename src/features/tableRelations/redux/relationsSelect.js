import { createSelector } from 'reselect';

export const selectRelations = state => state.relations.relations;
export const selectSelectedValues = state => state.relations.selectedValues;
export const selectActiveSelectorCell = state => state.relations.activeSelectorCell;

export const selectRelationsWithDetails = createSelector(
  [
    selectRelations,
    state => state.teachers.teachers,
    state => state.classes.classes,
    state => state.subjects.subjects,
  ],
  (relations, teachers, classes, subjects) => {
    return Object.values(relations).map(relation => {
      const teacher = teachers.find(t => t.id === relation.teacherId);
      const classObj = classes.find(c => c.id === relation.classId);
      const subject = subjects.find(s => s.id === relation.subjectId);

      return {
        ...relation,
        teacherName: teacher ? teacher.name : '',
        className: classObj ? classObj.name : '',
        subjectName: subject ? subject.name : '',
      };
    });
  }
);

export const selectActiveRelations = createSelector([selectRelationsWithDetails], relations =>
  relations.filter(relation => relation.isActive)
);

// export const selectRelationsByPupil = createSelector(
//   [selectRelations, (state, pupilId) => pupilId],
//   (relations, pupilId) => relations.filter(relation => relation.pupilId === pupilId)
// );

// export const selectRelationsByClass = createSelector(
//   [selectRelations, (state, classId) => classId],
//   (relations, classId) => relations.filter(relation => relation.classId === classId)
// );

// export const selectRelationsByTeacher = createSelector(
//   [selectRelations, (state, teacherId) => teacherId],
//   (relations, teacherId) => relations.filter(relation => relation.teacherId === teacherId)
// );

// export const selectRelationsBySubject = createSelector(
//   [selectRelations, (state, subjectId) => subjectId],
//   (relations, subjectId) => relations.filter(relation => relation.subjectId === subjectId)
// );

// //отримати учнів по класу та предмету (для певного вчителя)
// export const selectPupilsByClassSubjectTeacher = createSelector(
//   [selectRelations, (state, classId, subjectId, teacherId) => ({ classId, subjectId, teacherId })],
//   (relations, { classId, subjectId, teacherId }) =>
//     relations
//       .filter(
//         relation =>
//           relation.classId === classId &&
//           relation.subjectId === subjectId &&
//           relation.teacherId === teacherId
//       )
//       .map(relation => relation.pupilId)
// );

// export const selectSubjectsByClassTeacher = createSelector(
//   [selectRelations, (state, classId, teacherId) => ({ classId, teacherId })],
//   (relations, { classId, teacherId }) =>
//     relations
//       .filter(relation => relation.classId === classId && relation.teacherId === teacherId)
//       .map(relation => relation.subjectId)
// );

// export const selectTeachersByClassSubject = createSelector(
//   [selectRelations, (state, classId, subjectId) => ({ classId, subjectId })],
//   (relations, { classId, subjectId }) =>
//     relations
//       .filter(relation => relation.classId === classId && relation.subjectId === subjectId)
//       .map(relation => relation.teacherId)
// );

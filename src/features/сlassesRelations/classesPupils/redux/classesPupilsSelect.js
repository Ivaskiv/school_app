import { createSelector } from 'reselect';

export const selectClassesPupils = state => state.classesPupils.classesPupils;

export const selectPupilsByClass = createSelector(
  [(state, classId) => state.classesPupils.classesPupils.filter(item => item.classId === classId)],
  pupils => pupils
  // [selectClassesPupils, (state, classId) => classId],
  // (classesPupils, classId) => {
  //   return classesPupils.filter(item => item.classId === classId);
  // }
);

export const selectClassesByPupil = createSelector(
  [selectClassesPupils, (state, pupilId) => pupilId],
  (classesPupils, pupilId) => {
    return classesPupils.filter(item => item.pupilId === pupilId);
  }
);

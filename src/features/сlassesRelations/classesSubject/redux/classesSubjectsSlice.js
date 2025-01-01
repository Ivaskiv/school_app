import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classesSubjects: [
    { classId: 1, subjectIds: [1, 2] },
    { classId: 2, subjectIds: [3] },
  ],
};

const classesSubjectsSlice = createSlice({
  name: 'classesSubjects',
  initialState,
  reducers: {
    addClassSubjectRelation: (state, action) => {
      const { classId, subjectId } = action.payload;
      const cs = state.classesSubjects.find(ct => ct.classId === classId);

      const subjectIds = Array.isArray(subjectId) ? subjectId : [subjectId];

      if (cs) {
        cs.subjectIds = [...new Set([...cs.subjectIds, ...subjectIds])];
      } else {
        state.classesSubjects.push({ classId, subjectIds: [subjectId] });
      }
    },
    removeClassSubjectRelation: (state, action) => {
      const { classId, subjectId } = action.payload;
      const classIndex = state.classesSubjects.findIndex(cs => cs.classId === classId);

      if (classIndex !== -1) {
        // - предмет з масиву subjectIds
        const classUpdate = state.classesSubjects[classIndex];
        classUpdate.subjectIds = classUpdate.subjectIds.filter(id => id !== subjectId);

        // якщо після - предметів в класі не залишилось предметів, - клас
        if (classUpdate.subjectIds.length === 0) {
          state.classesSubjects.splice(classIndex, 1);
        }
      }
    },
    updateClassSubjectRelation: (state, action) => {
      const { classId, subjectIds } = action.payload;
      const classUpdate = state.classesSubjects.find(cs => cs.classId === classId);

      if (classUpdate) {
        classUpdate.subjectIds = subjectIds;
      }
    },
  },
});

export const { addClassSubjectRelation, removeClassSubjectRelation, updateClassSubjectRelation } =
  classesSubjectsSlice.actions;

export default classesSubjectsSlice.reducer;

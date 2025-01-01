import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  relations: {
    teachersClassesSubjects: [
      { teacherId: 1, classId: 1, subjectIds: [1, 2] },
      { teacherId: 2, classId: 2, subjectIds: [3] },
      { teacherId: 3, classId: 1, subjectIds: [1] },
    ],
    classesPupilsSubjects: [
      { classId: 1, pupilIds: [1, 2], subjectIds: [1, 2] },
      { classId: 2, pupilIds: [3], subjectIds: [3] },
      { classId: 3, pupilIds: [4, 5], subjectIds: [1] },
    ],
    pupilsTeachersSubjects: [
      { pupilId: 1, teacherIds: [1, 2], subjectIds: [1, 2] },
      { pupilId: 2, teacherIds: [3], subjectIds: [3] },
      { pupilId: 3, teacherIds: [2], subjectIds: [2] },
    ],
  },
};

const relationsSlice = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    updateRelations(state, action) {
      console.log('Updating relations...');
      const { matchKeys, data } = action.payload;
      console.log('matchKeys:', matchKeys);
      console.log('Data to update:', data);

      const relationKey = `${matchKeys[0]}-${matchKeys[1]}-${matchKeys[2]}`;
      console.log('Relation key:', relationKey);

      const relationArray = state.relations[relationKey] || [];
      console.log('Existing relations:', relationArray);

      const existingRelationIndex = relationArray.findIndex(rel =>
        matchKeys.every(key => rel[key] === data[key])
      );
      console.log('Existing relation index:', existingRelationIndex);

      if (existingRelationIndex !== -1) {
        console.log('Updating existing relation...');
        relationArray[existingRelationIndex] = { ...relationArray[existingRelationIndex], ...data };
      } else {
        console.log('Adding new relation...');
        relationArray.push(data);
      }

      state.relations[relationKey] = [...relationArray];
      console.log('Updated relations:', state.relations[relationKey]);
    },
  },
});

export const { updateRelations } = relationsSlice.actions;
export default relationsSlice.reducer;

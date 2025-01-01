import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  pupils: [
    { id: uuidv4(), name: 'Pupil1', classId: null },
    { id: uuidv4(), name: 'Pupil2', classId: null },
    { id: uuidv4(), name: 'Pupil3', classId: null },
    { id: uuidv4(), name: 'Pupil4', classId: null },
    { id: uuidv4(), name: 'Pupil5', classId: null },
    { id: uuidv4(), name: 'Pupil6', classId: null },
    { id: uuidv4(), name: 'Pupil7', classId: null },
    { id: uuidv4(), name: 'Pupil8', classId: null },
    { id: uuidv4(), name: 'Pupil9', classId: null },
    { id: uuidv4(), name: 'Pupil10', classId: null },
  ],
  teachersClasses: [],
  teachersClassesSubjects: [],
  classesPupils: [],
};

const pupilsSlice = createSlice({
  name: 'pupils',
  initialState,
  reducers: {
    addPupil: (state, action) => {
      const { name, classId = null } = action.payload;
      state.pupils.push({ id: uuidv4(), name, classId });
    },
    removePupil: (state, action) => {
      const pupilId = action.payload;
      state.pupils = state.pupils.filter(pupil => pupil.id !== pupilId);
    },
    addPupilToClass: (state, action) => {
      const { pupilId, newClassId } = action.payload;
      const pupil = state.pupils.find(pupil => pupil.id === pupilId);

      if (pupil) {
        pupil.classId = newClassId;

        const pupilClass = state.teachersClasses?.find(item => item.pupilId === pupilId);
        if (pupilClass) {
          pupilClass.classId = newClassId;
        }
      }
    },
    transferPupil: (state, action) => {
      const { pupilId, newClassId } = action.payload;
      const pupil = state.pupils.find(pupil => pupil.id === pupilId);
      if (pupil) {
        pupil.classId = newClassId;
      }
      const classIndex = state.classesPupils.find(cp => cp.classId === newClassId);
      if (classIndex === -1) {
        state.classesPupils.push({ classId: newClassId, pupilIds: [pupilId] });
      } else {
        const pupilIds = state.classesPupils[classIndex].pupilIds;
        if (!pupilIds.includes(pupilId)) {
          pupilIds.push(pupilId);
        }
      }
    },
  },
});

export const { addPupil, removePupil, transferPupil, addPupilToClass } = pupilsSlice.actions;
export const selectPupils = state => state.pupils.pupils;
export default pupilsSlice.reducer;

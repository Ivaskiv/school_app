import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  classes: [
    { id: uuidv4(), name: 'Class1' },
    { id: uuidv4(), name: 'Class2' },
    { id: uuidv4(), name: 'Class3' },
    { id: uuidv4(), name: 'Class4' },
    { id: uuidv4(), name: 'Class5' },
    { id: uuidv4(), name: 'Class6' },
    { id: uuidv4(), name: 'Class7' },
    { id: uuidv4(), name: 'Class8' },
  ],
  classesPupils: [],
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    addClass: (state, action) => {
      const newClassId = uuidv4();
      state.classes.push({ id: newClassId, name: action.payload.name });
    },
    removeClass: (state, action) => {
      const classId = action.payload;
      state.classes = state.classes.filter(cls => cls.id !== classId);
    },
    transferPupilToClass: (state, action) => {
      const { pupilId, classId } = action.payload;
      const classIndex = state.classesPupils.findIndex(cp => cp.classId === classId);
      if (classIndex === -1) {
        state.classesPupils.push({ classId, pupilIds: [pupilId] });
      } else {
        const pupilIds = state.classesPupils[classIndex].pupilIds;
        if (!pupilIds.includes(pupilId)) {
          pupilIds.push(pupilId);
        }
      }
    },
  },
});

export const { addClass, removeClass, transferPupilToClass } = classesSlice.actions;
export const selectClasses = state => state.classes.classes;
export const selectClassesPupils = state => state.classes.classesPupils;

export default classesSlice.reducer;

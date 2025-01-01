import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pupilClass: [
    { pupilId: 1, classId: 3 },
    { pupilId: 2, classId: 3 },
  ],
};

const pupilClassSlice = createSlice({
  name: 'pupilClass',
  initialState,
  reducers: {
    addPupilClassRelation: (state, action) => {
      const { pupilId, classId } = action.payload;
      if (!state.pupilClass.some(rel => rel.pupilId === pupilId && rel.classId === classId)) {
        state.pupilClass.push({ pupilId, classId });
      }
    },
    removePupilClassRelation: (state, action) => {
      const { pupilId, classId } = action.payload;
      state.pupilClass = state.pupilClass.filter(
        rel => rel.pupilId !== pupilId || rel.classId !== classId
      );
    },
    transferPupil: (state, action) => {
      const { pupilId, newClassId } = action.payload;

      // Видаляємо учня з усіх класів
      state.classesPupils = state.classesPupils.map(cp => ({
        ...cp,
        pupilIds: cp.pupilIds.filter(id => id !== pupilId),
      }));

      // Додаємо учня до нового класу
      const classEntry = state.classesPupils.find(cp => cp.classId === newClassId);
      if (classEntry) {
        classEntry.pupilIds.push(pupilId);
      } else {
        state.classesPupils.push({ classId: newClassId, pupilIds: [pupilId] });
      }
    },
  },
});

export const { addPupilClassRelation, removePupilClassRelation, transferPupil } =
  pupilClassSlice.actions;
export default pupilClassSlice.reducer;

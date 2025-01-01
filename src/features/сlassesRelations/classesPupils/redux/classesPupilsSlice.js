import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  classesPupils: [
    { classId: uuidv4(), pupilIds: [] },
    { classId: uuidv4(), pupilIds: [] },
  ], // { classId, pupilIds: [] }
};

const classesPupilsSlice = createSlice({
  name: 'classesPupils',
  initialState,
  reducers: {
    addPupilClassRelation: (state, action) => {
      const { classId, pupilIds } = action.payload;

      pupilIds.forEach(pupilId => {
        const existingRelation = state.classesPupils.find(
          cp => cp.classId === classId && cp.pupilIds.id === pupilId
        );

        if (!existingRelation) {
          state.classesPupils.push({ classId, pupilId });
        }
      });
    },
    removePupilClassRelation: (state, action) => {
      const { classId, pupilIds } = action.payload;
      state.classesPupils = state.classesPupils.filter(
        ct => !(ct.classId === classId && pupilIds.includes(ct.pupil.id))
      );
    },
    updateTeacherClassRelations: (state, action) => {
      const { classId, pupilIds } = action.payload;

      // - всі зв'язки для цього класу
      state.classesPupils = state.classesPupils.filter(ct => ct.classId !== classId);

      // + нові зв'язки для цього класу
      pupilIds.forEach(pupilId => {
        state.classesPupils.push({ classId, pupilId });
      });
    },

    transferPupil: (state, action) => {
      const { pupilId, newClassId } = action.payload;

      // Видалення учня з усіх класів
      state.classesPupils = state.classesPupils.map(cp => ({
        ...cp,
        pupilIds: cp.pupilIds.filter(id => id !== pupilId),
      }));

      // Додавання учня до нового класу
      const classEntry = state.classesPupils.find(cp => cp.classId === newClassId);
      if (classEntry) {
        classEntry.pupilIds = classEntry.pupilIds || [];
        classEntry.pupilIds.push(pupilId);
      } else {
        state.classesPupils.push({ classId: newClassId, pupilIds: [pupilId] });
      }
    },
  },
});

export const { addPupilClassRelation, removePupilClassRelation, transferPupil } =
  classesPupilsSlice.actions;
export const selectClassById = (state, classId) =>
  state.classesPupils.find(cls => cls.classId === classId);

export default classesPupilsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  teachers: [
    { id: uuidv4(), name: 'Teacher1' },
    { id: uuidv4(), name: 'Teacher2' },
    { id: uuidv4(), name: 'Teacher3' },
    { id: uuidv4(), name: 'Teacher4' },
    { id: uuidv4(), name: 'Teacher5' },
    { id: uuidv4(), name: 'Teacher6' },
  ],
};

const findTeacherById = (array, teacherId) => array.find(item => item.id === teacherId);

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    updateTeacher: (state, action) => {
      const { id, data } = action.payload;
      const index = state.teachers.findIndex(teacher => teacher.id === id);
      if (index !== -1) {
        state.teachers[index] = { ...state.teachers[index], ...data };
      }
    },
    // updateTeacherSubjects: (state, action) => {
    //   const { teacherId, subjectIds } = action.payload;
    //   const teacherSubjects = state.teachersSubjects.find(item => item.teacherId === teacherId);

    //   if (teacherSubjects) {
    //     teacherSubjects.subjectIds = Array.isArray(subjectIds) ? subjectIds : [];
    //   }
    // },
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);

      // const newTeacher = action.payload;

      // if (!newTeacher.id) {
      //   throw new Error('Teacher must have a unique ID');
      // }

      // state.teachers.push(newTeacher);

      // state.teachersClasses.push({ teacherId: newTeacher.id, classIds: [] });
      // state.teachersSubjects.push({ teacherId: newTeacher.id, subjectIds: [] });
      // state.teachersClassesSubjects.push({
      //   teacherId: newTeacher.id,
      //   classIds: [],
      //   subjectIds: [],
      // });
    },
    removeTeacher: (state, action) => {
      state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);

      // const teacherId = action.payload;

      // state.teachers = state.teachers.filter(teacher => teacher.id !== teacherId);
      // state.teachersClasses = state.teachersClasses.filter(item => item.teacherId !== teacherId);
      // state.teachersSubjects = state.teachersSubjects.filter(item => item.teacherId !== teacherId);
      // state.teachersClassesSubjects = state.teachersClassesSubjects.filter(
      //   item => item.teacherId !== teacherId
      // );
    },
    addTeacherClassRelation: (state, action) => {
      const { teacherId, newClassId } = action.payload;
      const teacher = state.teachers.find(teacher => teacher.id === teacherId);

      if (teacher) {
        teacher.classId = newClassId;

        const teacherClass = state.teachersClasses.find(item => item.teacherId === teacherId);
        if (teacherClass) {
          teacherClass.classId = newClassId;
        }

        const teacherClassesSubjects = state.teachersClassesSubjects.find(
          item => item.teacherId === teacherId
        );
        if (teacherClassesSubjects) {
          teacherClassesSubjects.classId = newClassId;
        }
      }
    },

    copyTeacher: (state, action) => {
      const { teacherId, newClassId } = action.payload;
      const teacherData = findTeacherById(state.teachersClassesSubjects, teacherId);

      if (teacherData && !teacherData.classIds.includes(newClassId)) {
        teacherData.classIds.push(newClassId);
      }
    },
  },
});

export const {
  updateTeacher,
  setTeachers,
  addTeacher,
  removeTeacher,
  addTeacherClassRelation,
  copyTeacher,
} = teachersSlice.actions;

export default teachersSlice.reducer;

export const selectTeachers = state => state.teachers.teachers;

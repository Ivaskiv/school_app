//store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import schoolReducer from '../pages/redux/schoolSlice';
import pupilsReducer from '../components/pupilsList/redux/pupilsSlice';
import teachersReducer from '../components/teachersList/redux/teachersSlice';
import classesReducer from '../components/classesList/redux/classesSlice';
import subjectsReducer from '../components/subjectsList/redux/subjectsSlice';

import classesPupilsReducer from '../features/сlassesRelations/classesPupils/redux/classesPupilsSlice';
import classesTeachersReducer from '../features/сlassesRelations/classesTeachers/redux/classesTeachersSlice';
import classesSubjectsReducer from '../features/сlassesRelations/classesSubject/redux/classesSubjectsSlice';

import teachersSubjectsReducer from '../features/teachersRelations/teachersSubjects/redux/teachersSubjectsSlice';
import teachersClassesReducer from '../features/teachersRelations/teachersClasses/redux/teachersClassesSlice';

import relationsReducer from '../features/tableRelations/redux/relationsSlice';

import classTeacherReducer from '../features/сlassesRelations/classTeacher/redux/classTeacherSlice';
const rootReducer = combineReducers({
  school: schoolReducer,
  pupils: pupilsReducer,
  teachers: teachersReducer,
  classes: classesReducer,
  subjects: subjectsReducer,
  classesTeachers: classesTeachersReducer,
  classTeacher: classTeacherReducer,
  classesPupils: classesPupilsReducer,
  teachersClasses: teachersClassesReducer,
  classesSubjects: classesSubjectsReducer,
  teachersSubjects: teachersSubjectsReducer,
  relations: relationsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE === 'development',
});

const persistor = persistStore(store);

export { store, persistor };

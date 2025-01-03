import '../init.js';
import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store.js';
import SchoolManagement from './pages/schoolManagement/index.jsx';
import TabsPages from './pages/tabsPages/index.jsx';
import ClassPage from './pages/classPage/index.jsx';
import TeacherPage from './pages/teacherPage/index.jsx';
import MainLayout from './infrastructure/layout/MainLayout.jsx';
import RegistrationForm from './features/auth/modalForm/RegistrationForm.jsx';
const Home = lazy(() => import('./pages/homePage/index.jsx'));

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/school" element={<SchoolManagement />} />
              <Route path="/tabsPages" element={<TabsPages />} />
              <Route path="/class/:classId" element={<ClassPage />} />
              <Route path="/teacher/:teacherId" element={<TeacherPage />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Route>
          </Routes>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default App;

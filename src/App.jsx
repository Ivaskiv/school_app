import { Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store.js';
import { PrivateRoute } from './infrastructure/routing/PrivateRoute.js';
import SchoolManagement from './pages/schoolManagement/SchoolManagement.jsx';
import TabsPages from './pages/tabsPages/TabsPages.jsx';
import ClassPage from './pages/classPage/ClassPage.jsx';
import TeacherPage from './pages/teacherPage/TeacherPage.jsx';
import MainLayout from './infrastructure/layout/mainLayout/MainLayout.jsx';
import AdminPage from './pages/AdminPage/AdminPage.jsx';
import Home from './pages/Home/Home.jsx';
import RegistrationForm from './features/auth/modalForm/RegistrationForm.jsx';
import { useEffect } from 'react';
import { listenAuthState } from './features/auth/redux/authOperations.js';
import SchoolPage from './pages/schoolPage/SchoolPage.jsx';
// import LoginForm from './features/auth/modalForm/LoginForm.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    listenAuthState(dispatch);
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<RegistrationForm isAdmin={true} />} />
            <Route path="/school-register" element={<RegistrationForm isAdmin={false} />} />
            <Route path="/school/:schoolId" element={<SchoolPage isAdmin={true} />} />
            <Route path="/school" element={<SchoolManagement />} />
            <Route path="/tabsPages" element={<TabsPages />} />
            <Route path="/class/:classId" element={<ClassPage />} />
            <Route path="/teacher/:teacherId" element={<TeacherPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Route>
        </Routes>
      </PersistGate>
    </Provider>
  );
};

export default App;

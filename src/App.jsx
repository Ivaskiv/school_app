import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store.js';
import { PrivateRoute } from './infrastructure/routing/PrivateRoute.js';
import SchoolManagement from './pages/schoolManagement/index.jsx';
import TabsPages from './pages/tabsPages/index.jsx';
import ClassPage from './pages/classPage/index.jsx';
import TeacherPage from './pages/teacherPage/index.jsx';
import MainLayout from './infrastructure/layout/MainLayout.jsx';
import AdminPage from './pages/AdminPage/index.jsx';
import Home from './pages/Home/index.jsx';
// import RegistrationForm from './features/auth/modalForm/RegistrationForm.jsx';
// import LoginForm from './features/auth/modalForm/LoginForm.jsx';

const App = () => {
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
            {/* <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} /> */}
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

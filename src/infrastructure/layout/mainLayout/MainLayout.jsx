import { Outlet } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './index.module.scss';
import Header from '../header/Header';
import Footer from '../footer/Footer';
// import DashboardPanel from '../dashboardPanel/DashboardPanel';
// import FeaturesList from '../featuresList/FeaturesList';
import { useDispatch, useSelector } from 'react-redux';
import { getSchoolsData } from '../../../features/schools/redux/schoolOperations';

export default function MainLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getSchoolsData());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className={style.pageWrapper}>
      <Header />

      <main>
        {/* <DashboardPanel className={style.dashboardPanel} />
        <FeaturesList /> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

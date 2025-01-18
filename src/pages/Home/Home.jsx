import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ModalAuth from '../../features/auth/modalAuth/ModalAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSchoolById } from '../../features/schools/redux/schoolOperations';
import style from './index.module.scss';

export default function Home({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { schoolId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [schoolIdToNavigate, setSchoolIdToNavigate] = useState(null);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.schools.loading);
  const error = useSelector(state => state.schools.error);

  useEffect(() => {
    if (schoolId) {
      dispatch(getSchoolById(schoolId));
    }
  }, [dispatch, schoolId]);

  const closeModal = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  const type = () => {
    setShowModal(false);
    if (schoolIdToNavigate) {
      navigate(`/school/${schoolIdToNavigate}`);
      setSchoolIdToNavigate(null);
    }
  };

  const handleSchoolClick = schoolId => {
    if (isAuthenticated) {
      navigate(`/school/${schoolId}`);
    } else {
      setSchoolIdToNavigate(schoolId);
      setShowModal(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Admin Dashboard</h2>
          <div className={style.adminActions}>
            <button onClick={() => navigate(`/school/${schoolId}/classes`)}>Manage Classes</button>
            <button onClick={() => navigate(`/school/${schoolId}/teachers`)}>
              Manage Teachers
            </button>
            <button onClick={() => navigate(`/school/${schoolId}/students`)}>
              Manage Students
            </button>
            <button onClick={() => navigate(`/school/${schoolId}/reports`)}>View Reports</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome, please log in</h2>
          <button onClick={() => handleSchoolClick(1)}>Go to School 1</button>
          <button onClick={() => handleSchoolClick(2)}>Go to School 2</button>
        </div>
      )}
      <ModalAuth isOpen={showModal} onClose={closeModal} type={type} />
    </div>
  );
}

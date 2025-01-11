import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/redux/authSlice';
import { fetchSchools } from '../../features/schools/redux/schoolOperations';
import { toast } from 'react-toastify';

export default function Home() {
  const user = useSelector(selectUser);
  const isAuthenticated = Boolean(user && user.uid);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSchools() {
      try {
        const schoolsData = await fetchSchools();

        // Перетворення об'єкта в масив
        const schoolsArray = Object.keys(schoolsData).map(key => ({
          school_id: key,
          ...schoolsData[key],
        }));

        setSchools(schoolsArray);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to fetch data');
        toast.error('There was an error fetching the data.');
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <p>Error: {error}</p>;

  const handleRestrictedAccess = () => {
    toast.info('This functionality is only available for authorized users.');
  };

  return (
    <div className={style.home}>
      <h1>Schools</h1>
      {schools.map(school => (
        <div key={school.school_id} className={style.schoolCard}>
          <h2>{school.name || 'No Name Available'}</h2>
          <p>Main admin: {school.principal?.name || 'Unknown'}</p>
          <h3>Classes:</h3>
          <ul>
            {school.classes?.length > 0 ? (
              school.classes.map(cls => (
                <li key={cls.id}>
                  {cls.name} - Teacher:{' '}
                  {school.teachers?.find(t => t.id === cls.class_teacher_id)?.name || 'N/A'}
                </li>
              ))
            ) : (
              <li>No Classes Available</li>
            )}
          </ul>
          <button
            className={style.detailsButton}
            onClick={isAuthenticated ? () => console.log('Details') : handleRestrictedAccess}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}

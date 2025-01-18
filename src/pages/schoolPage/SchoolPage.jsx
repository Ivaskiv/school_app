import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSchoolById } from '../../features/schools/redux/schoolOperations';

export default function SchoolPage() {
  const { schoolId } = useParams(); // Витягнення schoolId
  console.log('schoolId from URL:', schoolId); // Перевірка параметра URL

  const dispatch = useDispatch();

  const schools = useSelector(state => state.schools.schools);
  const status = useSelector(state => state.schools.status);
  const error = useSelector(state => state.schools.error);

  // Знаходимо школу за її ID
  const school = schools[schoolId]; // Використовуємо schoolId як ключ

  console.log('School found:', school); // Перевірка результату пошуку

  useEffect(() => {
    if (schoolId && !school) {
      dispatch(getSchoolById(schoolId));
    }
  }, [schoolId, dispatch, school]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!school) {
    return <p>No school data available</p>;
  }

  return (
    <div>
      <h1>Вітаю на сторінці школи {school.name}</h1>
      <p>Address: {school.address || 'Немає даних'}</p>
      <p>Principal: {school.principal?.name || 'Немає даних'}</p>
      <p>Email: {school.principal?.email || 'Немає даних'}</p>
    </div>
  );
}

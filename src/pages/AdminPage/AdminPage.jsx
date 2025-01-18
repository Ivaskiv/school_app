import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSchoolById } from '../../features/schools/redux/schoolOperations';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const navigate = useNavigate();
  const { schoolId } = useParams();

  useEffect(() => {
    // Simulate authentication logic here (replace with actual authentication)
    const user = { authenticated: true }; // Mock user data
    if (user.authenticated) {
      setIsAuthenticated(true);
      getSchoolById(schoolId)
        .then(school => setSchoolData(school))
        .catch(error => console.error('Error fetching school data:', error));
    } else {
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [schoolId, navigate]);

  const handleActionClick = action => {
    switch (action) {
      case 'addSchool':
        navigate('/school-register');
        break;
      case 'manageClasses':
        navigate(`/school/${schoolId}/classes`);
        break;
      case 'manageTeachers':
        navigate(`/school/${schoolId}/teachers`);
        break;
      case 'manageStudents':
        navigate(`/school/${schoolId}/students`);
        break;
      case 'viewReports':
        navigate(`/school/${schoolId}/reports`);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {isAuthenticated ? (
        <>
          <h1>Welcome back, {schoolData?.adminName || 'Admin'}!</h1>
          <div>
            <button onClick={() => handleActionClick('manageClasses')}>Manage Classes</button>
            <button onClick={() => handleActionClick('manageTeachers')}>Manage Teachers</button>
            <button onClick={() => handleActionClick('manageStudents')}>Manage Students</button>
            <button onClick={() => handleActionClick('viewReports')}>View Reports</button>
          </div>
        </>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}

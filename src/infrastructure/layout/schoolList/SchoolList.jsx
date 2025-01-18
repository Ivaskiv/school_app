import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export default function SchoolList() {
  const { schools } = useSelector(state => state.schools);

  console.log('schools from SchoolList: ', schools);

  return (
    <div className="pageWrapper">
      <h2>Зареєстровані школи:</h2>
      <ul>
        {schools &&
          schools.map(school => (
            <li key={school.id}>
              <h3>
                <NavLink to={`/school/${school.id}`}>{school.name}</NavLink>
              </h3>
            </li>
          ))}
      </ul>
    </div>
  );
}

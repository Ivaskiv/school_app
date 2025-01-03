import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RestrictedRoute = ({ element, redirectTo = '/' }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to={redirectTo} /> : element;
};

export default RestrictedRoute;

//якщо користувач увійшов у систему (isLoggedIn === true), його перенаправлять за вказаним шляхом (redirectTo), інакше буде відображено переданий компонент (Element).

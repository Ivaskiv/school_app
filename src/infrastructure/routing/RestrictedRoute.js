import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RestrictedRoute = ({ element, redirectTo = '/' }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to={redirectTo} /> : element;
};

export default RestrictedRoute;

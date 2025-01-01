import { Navigate } from 'react-router-dom';
import useAuth from '../../infrastructure/hooks/useAuth';

const RestrictedRoute = ({ children, redirectTo }) => {
  const { isLogin } = useAuth();

  return !isLogin ? children : <Navigate to={redirectTo} />;
};

export default RestrictedRoute;

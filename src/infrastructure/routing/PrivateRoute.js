import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;
  const token = useSelector(state => state.auth.token);

  const isAuthenticated = token || user;

  return isAuthenticated ? children : navigate('/register');
};

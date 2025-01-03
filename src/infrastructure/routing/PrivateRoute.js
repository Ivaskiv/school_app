import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const PrivateRoute = ({ element, redirectTo = '/' }) => {
  const { isLoggedIn, isRefreshing } = useAuth();
  const shouldRedirect = !isLoggedIn && !isRefreshing;

  return shouldRedirect ? <Navigate to={redirectTo} /> : element;
};

// PrivateRoute використовує useAuth() для перевірки авторизації користувача.
//Якщо користувач авторизований, PrivateRoute рендерить переданий компонент.
//Якщо користувач не авторизований, він перенаправляється на сторінку
//логіну(/login).

// import style from './index.module.scss';
import { useState } from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoles } from '../../features/auth/redux/authSlice';
import { registerUser } from '../../apiConfig';
import RegistrationForm from '../../infrastructure/modals/modalForm/RegistrationForm';

export default function Home() {
  const dispatch = useDispatch();
  const availableRoles = useSelector(selectRoles);
  console.log('Available roles:', availableRoles);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleLogin = () => {
    console.log('User logged in');
    setIsLoggedIn(true);
  };

  const handleRegistration = async data => {
    console.log('Registering user with data:', data);
    try {
      await dispatch(registerUser(data)).unwrap();
      console.log('User successfully registered');
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };
  if (isLoggedIn) {
    return <Dashboard />;
  }
  return (
    <div>
      {!isRegistered ? (
        <RegistrationForm onSubmit={handleRegistration} roles={availableRoles || {}} />
      ) : (
        <div>
          <h2>Login</h2>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

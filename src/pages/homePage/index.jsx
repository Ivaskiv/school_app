import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Dashboard from '../../components/dashboard/Dashboard';
import { registerUser } from '../../apiConfig';
import ModalAuth from '../../features/auth/modalAuth/ModalAuth';

export default function Home() {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isRegistered: false,
    isModalOpen: false,
  });

  const handleLogin = useCallback(() => {
    console.log('User logged in');
    setAuthState(prevState => ({ ...prevState, isLoggedIn: true }));
  }, []);

  const handleRegistration = useCallback(
    async data => {
      console.log('Registering user with data:', data);
      try {
        await dispatch(registerUser(data)).unwrap();
        console.log('User successfully registered');
        setAuthState(prevState => ({
          ...prevState,
          isRegistered: true,
          isModalOpen: false,
        }));
      } catch (error) {
        console.error('Registration failed:', error.message);
      }
    },
    [dispatch]
  );

  if (authState.isLoggedIn) {
    return <Dashboard />;
  }
  return (
    <div>
      <button onClick={() => setAuthState(prevState => ({ ...prevState, isModalOpen: true }))}>
        Open Auth Modal
      </button>
      <ModalAuth
        isOpen={authState.isModalOpen}
        onClose={() => setAuthState(prevState => ({ ...prevState, isModalOpen: false }))}
        type="register"
        onSubmit={handleRegistration}
      />
      {!authState.isRegistered ? (
        <div>
          <h2>Registration Form</h2>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

import style from './index.module.scss';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import RegistrationForm from '../ModalForm/RegistrationForm.jsx';
import LoginForm from '../ModalForm/LoginForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, clearAuthState } from '../../../redux/auth/authSlice';
import { logout } from '../../../redux/auth/authOperations';

export default function ModalAuth({ isOpen, onClose, type }) {
  const [isRegister, setIsRegister] = useState(type === 'register');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const authenticated = Boolean(user && user.uid);

  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setIsRegister(type === 'register');
  }, [type]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearAuthState());
      alert('User logged out');
    } catch (error) {
      alert(error.message);
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={e => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          ×
        </button>
        {authenticated ? (
          <div>
            <p> {user.displayName || 'User'}</p>
            <button className={style.authButtonLogout} onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <>
            {isRegister ? <RegistrationForm onClose={onClose} /> : <LoginForm onClose={onClose} />}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

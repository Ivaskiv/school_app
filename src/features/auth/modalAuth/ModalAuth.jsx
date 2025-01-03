import style from './index.module.scss';
import { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthState, selectCurrentUser } from '../redux/authSlice';
import { logout } from '../redux/authOperations';
import RegistrationForm from '../modalForm/RegistrationForm';
import LoginForm from '../modalForm/LoginForm';

export default function ModalAuth({ isOpen, onClose, type, onSubmit }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const authenticated = Boolean(user?.uid);

  // Функція для обробки Escape
  const handleEscape = useCallback(
    e => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Додаємо слухач подій для Escape тільки при відкритому модалі
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  // Логіка для виходу
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

  // Рендеринг форми
  const renderForm = () => {
    if (authenticated) {
      return (
        <div>
          <p>{user.displayName || 'User'}</p>
          <button className={style.authButtonLogout} onClick={handleLogout}>
            Log out
          </button>
        </div>
      );
    }

    switch (type) {
      case 'register':
        return <RegistrationForm onSubmit={onSubmit} />;
      case 'login':
        return <LoginForm onClose={onClose} />;
      default:
        return null;
    }
  };

  // Якщо модальне вікно не відкрите, нічого не рендеримо
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={e => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          ×
        </button>
        {renderForm()}
      </div>
    </div>,
    document.body
  );
}

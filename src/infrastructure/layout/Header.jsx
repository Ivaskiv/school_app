import { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import style from './index.module.scss';
import ModalAuth from '../../features/auth/modalAuth/ModalAuth';
import { selectIsAuthenticated, selectUser } from '../../features/auth/redux/authSlice';
import { logout } from '../../features/auth/redux/authOperations';
import CryptoJS from 'crypto-js';

const getGravatarUrl = (email, size = 200) => {
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const authenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const userName = useMemo(() => user?.displayName || 'User', [user]);

  // Визначаємо тип модалки залежно від маршруту
  const modalType =
    location.pathname === '/login'
      ? 'login'
      : location.pathname === '/register'
      ? 'register'
      : null;

  const openModal = type => navigate(`/${type}`); // Відкриття модалки через зміну URL
  const closeModal = () => navigate('/'); // Закриття модалки поверненням на головну сторінку

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      closeModal();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <>
      <header className={style.header}>
        <div className={style.logo}>
          <span>school.</span>management
        </div>

        <nav className={style.navMenu}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? style.active : '')}>
            Home
          </NavLink>
          {authenticated && (
            <>
              <NavLink to="/school" className={({ isActive }) => (isActive ? style.active : '')}>
                School Management
              </NavLink>
              <NavLink to="/pages" className={({ isActive }) => (isActive ? style.active : '')}>
                Pages
              </NavLink>
            </>
          )}
        </nav>

        <div className={style.authButtons}>
          {authenticated ? (
            <div className={style.userInfo}>
              <button className={style.btnUser}>
                <img
                  src={user?.photoURL ? user.photoURL : getGravatarUrl(user?.email)}
                  alt="User Avatar"
                  className={style.avatar}
                />
                <div className={style.userName}>{userName}</div>
              </button>
              <button className={style.btnLogout} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <button className={style.btnLogin} onClick={() => openModal('login')}>
                Login
              </button>
              <button className={style.btnRegistration} onClick={() => openModal('register')}>
                Registration
              </button>
            </>
          )}
        </div>
      </header>

      {/* Модалка з формою */}
      <ModalAuth isOpen={!!modalType} onClose={closeModal} type={modalType} />
    </>
  );
};

export default Header;

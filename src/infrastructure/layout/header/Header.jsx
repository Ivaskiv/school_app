import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import style from './index.module.scss';
import ModalAuth from '../../../features/auth/modalAuth/ModalAuth';
import { selectIsAuthenticated, selectUser } from '../../../features/auth/redux/authSlice';
import { logout } from '../../../features/auth/redux/authOperations';
import CryptoJS from 'crypto-js';

const getGravatarUrl = (email, size = 64) => {
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalType, setModalType] = useState(null);

  const user = useSelector(selectUser);
  const authenticated = useSelector(selectIsAuthenticated);

  const userName = useMemo(() => user?.displayName || user?.email || 'User', [user]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const openAuthModal = type => {
    setModalType(type);
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
                <img src={getGravatarUrl(user?.email)} alt="User Avatar" />
                <span>{userName}</span>
              </button>
              <button className={style.btnLogout} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => openAuthModal('login')}>Login</button>
              <button onClick={() => openAuthModal('register')}>Register</button>
            </>
          )}
        </div>
      </header>
      <ModalAuth isOpen={!!modalType} onClose={() => setModalType(null)} type={modalType} />
    </>
  );
}

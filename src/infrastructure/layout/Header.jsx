// Header.jsx
import style from './index.module.scss';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <div className={style.logo}>
          <img src="/path/to/logo.png" alt="School Management Logo" className={style.logoImage} />
        </div>
        <nav className={style.nav}>
          <Link to="/">Home</Link>
          <Link to="/school">School Management</Link>
          <Link to="/tabsPages">Pages</Link>
        </nav>
        <div className={style.btnsAuth}>
          {!isAuthenticated ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <button onClick={onLogout}>Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import ReactDOM from 'react-dom';
import style from './index.module.scss';
import LoginForm from '../modalForm/LoginForm';
import RegistrationForm from '../modalForm/RegistrationForm';

export default function ModalAuth({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={e => e.stopPropagation()}>
        <button className={style.closeButton} onClick={onClose}>
          ✕
        </button>
        {type === 'login' ? (
          <LoginForm onClose={onClose} />
        ) : (
          <RegistrationForm onClose={onClose} />
        )}
      </div>
    </div>,
    document.body
  );
}

import { useForm } from 'react-hook-form'; // Правильний імпорт
import { joiResolver } from '@hookform/resolvers/joi'; // Правильний імпорт для Joi
import schoolLoginSchema from '../models/schoolLoginSchema'; // Схема валідації Joi
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase метод
import { auth } from '../../../firebase/firebaseConfig'; // Firebase конфігурація
import style from './index.module.scss'; // Стили
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Іконки
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Іконки для пароля
import { useState } from 'react'; // useState для пароля
import { useNavigate } from 'react-router-dom'; // Навігація

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }, // Отримуємо помилки
  } = useForm({
    resolver: joiResolver(schoolLoginSchema), // Підключаємо Joi для валідації
  });

  const onSubmit = async data => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log('Login successful');
      onClose();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.loginForm}>
      <h2>Login Form</h2>
      <label>
        Email:
        <input type="email" {...register('email')} />
        {errors?.email && <p className={style.validationError}>{errors.email.message}</p>}
      </label>
      <label>
        Password:
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
          />
          {errors?.password && <p className={style.validationError}>{errors.password.message}</p>}
        </div>
      </label>
      <button type="submit" className={style.loginButton}>
        Login
      </button>
      <hr />
      <button type="button" onClick={handleRegisterRedirect} className={style.switchFormBtn}>
        Go to Registration
      </button>
    </form>
  );
};

export default LoginForm;

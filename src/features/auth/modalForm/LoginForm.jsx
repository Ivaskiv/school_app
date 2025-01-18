import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import schoolLoginSchema from '../models/schoolLoginSchema';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig';
import style from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schoolLoginSchema),
  });

  const onSubmit = async data => {
    try {
      console.log('Submitting login data', data);

      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('User logged in:', user);

      navigate('/school');

      onClose();
    } catch (error) {
      console.error('Login failed:', error.message);
      if (error.code === 'auth/user-not-found') {
        alert('Користувача з таким email не знайдено. Перевірте правильність введеного email.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Невірний пароль. Спробуйте ще раз.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Некоректний формат email.');
      } else {
        alert('Сталася помилка при вході: ' + error.message);
      }
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

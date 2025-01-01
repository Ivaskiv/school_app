// LoginForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const onSubmit = async data => {
    try {
      const response = await axios.post('/api/auth/login', {
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });
      localStorage.setItem('token', response.data.token);
      history.push('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Error during login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('adminEmail', {
            required: 'Email is required',
            pattern: {
              value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.adminEmail && <span>{errors.adminEmail.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('adminPassword', { required: 'Password is required' })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.adminPassword && <span>{errors.adminPassword.message}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;

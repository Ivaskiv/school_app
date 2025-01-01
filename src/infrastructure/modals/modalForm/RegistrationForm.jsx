// import style from './index.module.scss';
import Joi from 'joi';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async data => {
    try {
      const response = await axios.post('/api/auth/register', {
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolEmail: data.schoolEmail,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      });
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Error during registration');
    }
  };

  const passwordSchema = Joi.string()
    .pattern(/^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/)
    .required();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>School Name</label>
        <input type="text" {...register('schoolName', { required: 'School name is required' })} />
        {errors.schoolName && <span>{errors.schoolName.message}</span>}
      </div>

      <div>
        <label>School Address</label>
        <input
          type="text"
          {...register('schoolAddress', { required: 'School address is required' })}
        />
        {errors.schoolAddress && <span>{errors.schoolAddress.message}</span>}
      </div>

      <div>
        <label>Main Admin Name</label>
        <input type="text" {...register('adminName', { required: 'Admin name is required' })} />
        {errors.adminName && <span>{errors.adminName.message}</span>}
      </div>

      <div>
        <label>Main Admin Email</label>
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
        <label>Main Admin Password</label>
        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('adminPassword', {
              required: 'Password is required',
              validate: value =>
                passwordSchema.validate(value).error ? 'Password is invalid' : undefined,
            })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.adminPassword && <span>{errors.adminPassword.message}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

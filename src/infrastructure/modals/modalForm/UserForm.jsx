import Joi from 'joi';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import style from './index.module.scss';

const schema = Joi.object({
  name: Joi.string().min(3).max(15).required().messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 15 characters',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
    }),
  role: Joi.string().valid('admin', 'user', 'manager', 'teacher', 'pupil').required(),
  password: Joi.string().min(6).max(20).required(),
  class: Joi.when('role', {
    is: 'pupil',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  subjects: Joi.when('role', {
    is: 'teacher',
    then: Joi.array().items(Joi.string()).min(1).required(),
    otherwise: Joi.forbidden(),
  }),
});

// Компонент форми
export default function UserForm({ onSubmit, user = null, roles = [] }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: user || {},
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      <h2>{user ? 'Edit User' : 'Register User'}</h2>

      <label>
        <input type="text" placeholder="Name" {...register('name')} />
        {errors.name && <p className={style.validationError}>{errors.name.message}</p>}
      </label>

      <label>
        <input type="email" placeholder="Email" {...register('email')} />
        {errors.email && <p className={style.validationError}>{errors.email.message}</p>}
      </label>

      <label>
        <select {...register('role')}>
          <option value="">Select role</option>
          {roles.map(role => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        {errors.role && <p className={style.validationError}>{errors.role.message}</p>}
      </label>

      {!user && (
        <label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            onClick={togglePasswordVisibility}
            className={style.passwordToggle}
          />
          {errors.password && <p className={style.validationError}>{errors.password.message}</p>}
        </label>
      )}

      {watch('role') === 'pupil' && (
        <label>
          <input type="text" placeholder="Class" {...register('class')} />
          {errors.class && <p className={style.validationError}>{errors.class.message}</p>}
        </label>
      )}

      {watch('role') === 'teacher' && (
        <label>
          <input type="text" placeholder="Subjects (comma separated)" {...register('subjects')} />
          {errors.subjects && <p className={style.validationError}>{errors.subjects.message}</p>}
        </label>
      )}

      <button type="submit" className={style.buttonCreate}>
        {user ? 'Update User' : 'Register User'}
      </button>
    </form>
  );
}

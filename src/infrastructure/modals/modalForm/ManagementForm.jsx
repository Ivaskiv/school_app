import style from './index.module.scss';
import Joi from 'joi';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectRoles } from '../../../features/auth/redux/authSlice';
import { createUser, updateUser } from '../../../apiConfig';

const schema = Joi.object({
  name: Joi.string().min(3).max(15).required('Name is required').messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 15 characters',
  }),
  email: Joi.string().email().message('Invalid email format').required('Email is required'),
  role: Joi.string()
    .valid('admin', 'user', 'manager', 'pupil', 'teacher')
    .required('Role is required'),
  password: Joi.string()
    .min(6)
    .max(20)
    .when(Joi.ref('$isNewUser'), {
      is: true,
      then: Joi.required('Password is required for new users'),
      otherwise: Joi.optional(),
    }),
  class: Joi.when('role', {
    is: 'pupil',
    then: Joi.string().required('Class is required for pupils'),
    otherwise: Joi.forbidden(),
  }),
  subjects: Joi.when('role', {
    is: 'teacher',
    then: Joi.array()
      .items(Joi.string())
      .min(1)
      .required('At least one subject is required for teachers'),
    otherwise: Joi.forbidden(),
  }),
});

export default function ManagementForm({ onClose, user = null, currentUserRole }) {
  const dispatch = useDispatch();
  const availableRoles = useSelector(selectRoles);

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('currentUserRole:', currentUserRole);
    console.log('availableRoles:', availableRoles);
    if (currentUserRole === 'admin') {
      setRoles(availableRoles);
    } else {
      setRoles(availableRoles.filter(role => role !== 'admin'));
    }
  }, [currentUserRole, availableRoles]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    context: { isNewUser: !user },
  });

  const handleFormSubmit = async data => {
    console.log('Form submitted with data:', data);
    try {
      if (user) {
        await dispatch(updateUser({ ...data, id: user.id })).unwrap();
        console.log('User updated successfully');
      } else {
        await dispatch(createUser(data)).unwrap();
        console.log('User created successfully');
      }
      if (onClose) onClose();
    } catch (err) {
      console.error('Operation failed:', err.message);
      setError('Operation failed: ' + err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={style.form}>
      <h2>{user ? 'Edit User' : 'Create User'}</h2>
      <p className={style.textForm}>
        {user ? 'Edit the details of the user' : 'Fill in the details below to create a new user'}
      </p>

      <div className={style.inputBlock}>
        <label>
          <input
            type="text"
            placeholder="Name"
            defaultValue={user ? user.name : ''}
            {...register('name')}
          />
          {errors.name && <p className={style.validationError}>{errors.name.message}</p>}
        </label>

        <label>
          <input
            type="email"
            placeholder="Email"
            defaultValue={user ? user.email : ''}
            {...register('email')}
          />
          {errors.email && <p className={style.validationError}>{errors.email.message}</p>}
        </label>

        <label>
          <select
            {...register('role')}
            defaultValue={user ? user.role : roles.length > 0 ? roles[0] : ''}
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          {errors.role && <p className={style.validationError}>{errors.role.message}</p>}
        </label>

        {!user && (
          <label style={{ position: 'relative' }}>
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
      </div>

      <button type="submit" className={style.buttonCreate}>
        {user ? 'Update User' : 'Create User'}
      </button>

      {error && <p className={style.validationError}>{error}</p>}
    </form>
  );
}

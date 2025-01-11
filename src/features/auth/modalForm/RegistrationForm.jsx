import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ref, set } from 'firebase/database';
import schoolRegistrationSchema from '../models/schoolRegistrationSchema';
import { database } from '../../../firebase/firebaseConfig';
import { initialSchoolData } from './initialSchoolData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import style from './index.module.scss';

export default function RegistrationForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Стейт для показу пароля
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schoolRegistrationSchema),
  });

  const generateSchoolKey = (schoolName, schoolId) =>
    `${schoolName.replace(/\s+/g, '_').toLowerCase()}_${schoolId}`;

  const handleUseDefaultData = () => {
    const { schoolName, schoolAddress, schoolEmail, mainAdmin } = initialSchoolData.schoolData;

    reset({
      schoolName,
      schoolAddress,
      schoolEmail,
      adminName: mainAdmin.adminName,
      adminEmail: mainAdmin.adminEmail,
      adminPassword: mainAdmin.adminPassword,
    });

    console.log('Test data populated in the form');
  };

  const onSubmit = async data => {
    const { schoolName, schoolAddress, schoolEmail, adminName, adminEmail, adminPassword } = data;
    const schoolId = `school${new Date().getTime()}`;
    const formattedSchoolKey = generateSchoolKey(schoolName, schoolId);

    const schoolData = {
      schoolData: { schoolName, schoolAddress, schoolEmail, schoolId },
      admins: { mainAdmin: { adminName, adminEmail, adminPassword } },
      classes: {},
      students: {},
      subjects: {},
      teachers: {},
      principal: null,
    };

    try {
      setLoading(true);
      const schoolRef = ref(database, `schools/${formattedSchoolKey}`);
      await set(schoolRef, schoolData);
      console.log(`School registered successfully with ID: ${schoolId}`);
      reset();
      onClose();
    } catch (error) {
      console.error('Error registering school:', error);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: 'School Name', name: 'schoolName', type: 'text' },
    { label: 'School Address', name: 'schoolAddress', type: 'text' },
    { label: 'School Email', name: 'schoolEmail', type: 'email' },
    { label: 'Administrator Name', name: 'adminName', type: 'text' },
    { label: 'Admin Email', name: 'adminEmail', type: 'email' },
    {
      label: 'Administrator Password',
      name: 'adminPassword',
      type: showPassword ? 'text' : 'password',
    },
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <div>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {formFields.map(({ label, name, type }, index) => (
            <div key={index} className={style.formGroup}>
              <label>{label}:</label>
              <input
                type={type}
                {...register(name)}
                className={errors[name] ? style.errorInput : ''}
              />
              {errors[name] && <p className={style.errorText}>{errors[name].message}</p>}

              {name === 'adminPassword' && (
                <div className={style.passwordWrapper}>
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              )}
            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
      <hr />
      <button onClick={handleLoginClick} className={style.switchFormBtn}>
        Go to Login
      </button>
      <button onClick={handleUseDefaultData} disabled={loading}>
        {loading ? 'Loading...' : 'Use Default Test Data'}
      </button>
    </>
  );
}

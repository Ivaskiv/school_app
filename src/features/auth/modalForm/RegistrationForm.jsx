import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import schoolRegistrationSchema from '../models/schoolRegistrationSchema';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import style from './index.module.scss';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../../../firebase/firebaseConfig';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ModalAuth from '../modalAuth/ModalAuth';

export default function RegistrationForm({ onClose, isAdmin = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: joiResolver(schoolRegistrationSchema),
  });

  const role = watch('role');

  const generateRandomTestData = () => {
    const randomId = uuidv4();
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
    const randomPassword = `Password${Math.floor(Math.random() * 10000)}`;

    return {
      schoolName: `School ${randomId.slice(0, 8)}`,
      schoolAddress: `Street ${randomId.slice(0, 8)}`,
      schoolEmail: randomEmail,
      adminName: `Admin ${randomId.slice(0, 8)}`,
      adminEmail: randomEmail,
      adminPassword: randomPassword,
    };
  };

  const handleUseDefaultData = () => {
    const testData = generateRandomTestData();
    reset({
      schoolName: testData.schoolName,
      schoolAddress: testData.schoolAddress,
      schoolEmail: testData.schoolEmail,
      adminName: testData.adminName,
      adminEmail: testData.adminEmail,
      adminPassword: testData.adminPassword,
      role: 'Main Admin',
    });
  };

  const onSubmit = async data => {
    try {
      setLoading(true);
      const { adminPassword } = data;
      const emailToUse = isAdmin ? data.adminEmail : data.schoolEmail;
      console.log('Registering with email:', emailToUse);

      const signInMethods = await fetchSignInMethodsForEmail(auth, emailToUse);
      if (signInMethods.length > 0) {
        alert('This email is already registered. Please use another email.');
        setLoading(false);
        setShowModal(true);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, emailToUse, adminPassword);
      const user = userCredential.user;
      console.log('User registered:', user);

      if (!isAdmin) {
        const newSchool = {
          id: uuidv4(),
          name: data.schoolName,
          principal: {
            name: data.adminName,
            email: data.adminEmail,
            role: 'Principal',
          },
          admins: [
            {
              id: uuidv4(),
              name: data.adminName,
              email: data.adminEmail,
              role: 'Main Admin',
            },
          ],
          classes: {},
          students: {},
          teachers: {},
          subjects: {},
        };

        console.log('School data prepared:', newSchool);

        const db = getDatabase();
        const schoolRef = ref(db, `schools/school${newSchool.id}`);
        await set(schoolRef, newSchool);

        console.log('School registered successfully in Firebase:', newSchool);
        navigate('/school');
      } else {
        const newAdmin = {
          id: uuidv4(),
          name: data.adminName,
          email: data.adminEmail,
          password: adminPassword,
        };
        console.log('Admin registered:', newAdmin);
      }

      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.message);
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
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleLoginClick = () => {
    setShowModal(true);
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
            </div>
          ))}

          <div className={style.formGroup}>
            <label>User Role:</label>
            <select {...register('role')} className={errors.role ? style.errorInput : ''}>
              <option value="School">School</option>
              <option value="Main Admin">Main Admin</option>
              <option value="Admin">Admin</option>
              <option value="Director">Director</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
            {errors.role && <p className={style.errorText}>{errors.role.message}</p>}
          </div>

          <div className={style.passwordWrapper}>
            <label> Password {role}:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('adminPassword')}
              className={errors.adminPassword ? style.errorInput : ''}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.adminPassword && (
              <p className={style.errorText}>{errors.adminPassword.message}</p>
            )}
          </div>

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

      {showModal && (
        <ModalAuth isOpen={showModal} onClose={() => setShowModal(false)} type="login" />
      )}
    </>
  );
}

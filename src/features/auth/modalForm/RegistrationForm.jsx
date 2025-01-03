import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { registerSchoolAndAdminAsync } from '../../../features/auth/redux/authOperations';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolAddress: '',
    schoolEmail: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    const { schoolName, schoolAddress, schoolEmail, adminName, adminEmail, adminPassword } =
      formData;

    if (
      !schoolName ||
      !schoolAddress ||
      !schoolEmail ||
      !adminName ||
      !adminEmail ||
      !adminPassword
    ) {
      toast.error('All fields are required!');
      return;
    }

    const formDataWithRole = {
      schoolName,
      schoolAddress,
      schoolEmail,
      adminName,
      adminEmail,
      adminPassword,
      adminRole: 'mainAdmin',
    };

    try {
      const response = await dispatch(registerSchoolAndAdminAsync(formDataWithRole));

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success('School and admin registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register School & Admin</h2>
      <input
        type="text"
        name="schoolName"
        placeholder="School Name"
        value={formData.schoolName}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="schoolAddress"
        placeholder="School Address"
        value={formData.schoolAddress}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="schoolEmail"
        placeholder="School Email"
        value={formData.schoolEmail}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="adminName"
        placeholder="Admin Name"
        value={formData.adminName}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="adminEmail"
        placeholder="Admin Email"
        value={formData.adminEmail}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="adminPassword"
        placeholder="Admin Password"
        value={formData.adminPassword}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;

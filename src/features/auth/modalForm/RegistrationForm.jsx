import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { registerSchoolAndAdminAsync } from '../../../features/auth/redux/authOperations';

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    schoolName: '123',
    schoolAddress: 'str123',
    schoolEmail: '123@gmail.com',
    adminName: 'admin123',
    adminEmail: 'admin123@gmail.com',
    adminPassword: 'admin123@123',
  });

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    const { schoolName, schoolAddress, schoolEmail, adminName, adminEmail, adminPassword } =
      formData;

    console.log('Form submitted with data:', formData);

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

    console.log('Dispatching form data:', formDataWithRole);

    try {
      const response = await dispatch(registerSchoolAndAdminAsync(formDataWithRole));
      console.log('Registration response:', response);

      if (response.type.includes('rejected')) {
        console.error('Registration failed:', response.payload);
        toast.error(response.payload || 'Registration failed.');
        return;
      }

      toast.success('School and admin registered successfully!');
      console.log('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error.message);
      toast.error(error.message || 'Registration failed.');
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
}

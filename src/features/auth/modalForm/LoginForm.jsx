import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { loginAdmin } from '../../../apiConfig';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    adminEmail: '',
    adminPassword: '',
  });

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setCredentials(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    const { adminEmail, adminPassword } = credentials;

    if (!adminEmail || !adminPassword) {
      toast.error('Both email and password are required!');
      return;
    }

    try {
      const response = await loginAdmin(credentials);
      console.log('Login success:', response);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input
        type="email"
        name="adminEmail"
        placeholder="Admin Email"
        value={credentials.adminEmail}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="adminPassword"
        placeholder="Admin Password"
        value={credentials.adminPassword}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

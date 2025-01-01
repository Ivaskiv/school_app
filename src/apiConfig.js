import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Універсальна функція для виконання запитів
const handleApiRequest = async (method, url, data = null, token = null) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response =
      method === 'get'
        ? await api.get(url, config)
        : method === 'post'
        ? await api.post(url, data, config)
        : method === 'put'
        ? await api.put(url, data, config)
        : method === 'delete'
        ? await api.delete(url, config)
        : null;
    return response.data;
  } catch (error) {
    console.error(`Error during ${method.toUpperCase()} request to ${url}:`, error);
    throw error.response?.data || error.message || 'Request failed';
  }
};

export const registerSchoolAndAdmin = schoolData =>
  handleApiRequest('post', '/auth/register', schoolData);

export const loginAdmin = credentials => handleApiRequest('post', '/auth/loginAdmin', credentials);

export const registerUser = userData => handleApiRequest('post', '/auth/registerUser', userData);

export const loginUser = credentials => handleApiRequest('post', '/auth/loginUser', credentials);

export const getCurrentUser = token => handleApiRequest('get', '/auth/current', null, token);

export const signOut = () => handleApiRequest('post', '/auth/logout');

export const fetchPupils = () => handleApiRequest('get', '/pupils');

export const createPupil = pupilData => handleApiRequest('post', '/pupils', pupilData);

export const updatePupil = (id, updatedData) =>
  handleApiRequest('put', `/pupils/${id}`, updatedData);

export const deletePupil = id => handleApiRequest('delete', `/pupils/${id}`);

export const createUser = userData => handleApiRequest('post', '/auth/registerUser', userData);

export const updateUser = (id, userData) =>
  handleApiRequest('put', `/auth/updateUser/${id}`, userData);

export default api;

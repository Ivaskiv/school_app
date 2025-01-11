import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

if (!baseURL) {
  console.error(
    'Base URL is not defined! Check your .env file and ensure VITE_API_BASE_URL is set.'
  );
}

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export default instance;

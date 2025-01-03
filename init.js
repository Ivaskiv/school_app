import axios from 'axios';

// Завантаження базової URL-адреси з середовища (наприклад, Vite)
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error(
    'Base URL is not defined! Check your .env file and ensure VITE_API_BASE_URL is set.'
  );
}

// Налаштування axios
const instance = axios.create({
  baseURL: baseURL, // Використання базової адреси
  timeout: 10000, // Час очікування (опціонально)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Використовуйте `true`, якщо потрібні cookies (наприклад, для сесій)
});

// Інтерсептори для обробки запитів та відповідей
instance.interceptors.request.use(
  config => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('Error during request:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error during setup:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;

import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5270'  // HTTP-порт из launchSettings.json
    : 'https://ваш-продакшен-домен';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
);

export const authService = {
  login: (login: string, password: string) =>
      apiClient.post('/api/auth/login', { login, password }),

  register: (login: string, password: string) =>
      apiClient.post('/api/auth/register', { login, password }),
};
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hiresense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hiresense_token');
      localStorage.removeItem('hiresense_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
};

// ─── Interview ───
export const interviewAPI = {
  getCompanies: () => api.get('/interview/companies'),
  getCompanyDetails: (company) => api.get(`/interview/companies/${company}`),
  startInterview: (data) => api.post('/interview/start', data),
  sendMessage: (sessionId, message) => api.post(`/interview/${sessionId}/message`, { message }),
  submitCode: (sessionId, code, language) => api.post(`/interview/${sessionId}/code`, { code, language }),
  endInterview: (sessionId) => api.post(`/interview/${sessionId}/end`),
  getSession: (sessionId) => api.get(`/interview/${sessionId}`),
  getHistory: (params) => api.get('/interview', { params }),
};

// ─── Dashboard ───
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard'),
  getResult: (sessionId) => api.get(`/dashboard/results/${sessionId}`),
};

// ─── Questions ───
export const questionAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getStats: () => api.get('/questions/stats'),
};

export default api;

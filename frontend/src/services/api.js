import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateApiKeys: (data) => api.put('/auth/api-keys', data),
  getApiKeys: () => api.get('/auth/api-keys'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password })
};

// Project APIs
export const projectAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addChatMessage: (id, message) => api.post(`/projects/${id}/chat`, message),
  shareProject: (id) => api.post(`/projects/${id}/share`),
  getSharedProject: (token) => api.get(`/projects/shared/${token}`)
};

// AI APIs
export const aiAPI = {
  chat: (messages, provider) => api.post('/ai/chat', { messages, provider }),
  testConnection: (provider, apiKey) => api.post('/ai/test', { provider, apiKey })
};

// Download API
export const downloadAPI = {
  downloadProject: async (id, projectName) => {
    const response = await api.get(`/download/${id}`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectName}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export default api;

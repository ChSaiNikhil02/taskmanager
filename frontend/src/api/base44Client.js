import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_URL,
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const base44 = {
  auth: {
    login: async (email, password) => {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      const { data } = await client.post('/auth/login', formData);
      localStorage.setItem('access_token', data.access_token);
      return data;
    },
    register: async (payload) => {
      const { data } = await client.post('/auth/register', payload);
      return data;
    },
    me: async () => {
      const { data } = await client.get('/auth/me');
      return data;
    },
    logout: () => {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    },
  },
  entities: {
    Project: {
      list: async () => {
        const { data } = await client.get('/projects/');
        return data;
      },
      get: async (id) => {
        const { data } = await client.get(`/projects/${id}`);
        return data;
      },
      create: async (payload) => {
        const { data } = await client.post('/projects/', payload);
        return data;
      },
      update: async (id, payload) => {
        const { data } = await client.patch(`/projects/${id}`, payload);
        return data;
      },
      delete: async (id) => {
        const { data } = await client.delete(`/projects/${id}`);
        return data;
      },
    },
    Task: {
      list: async () => {
        const { data } = await client.get('/tasks/');
        return data;
      },
      filter: async (params) => {
        const { data } = await client.get('/tasks/', { params });
        return data;
      },
      create: async (payload) => {
        const { data } = await client.post('/tasks/', payload);
        return data;
      },
      update: async (id, payload) => {
        const { data } = await client.patch(`/tasks/${id}`, payload);
        return data;
      },
      delete: async (id) => {
        const { data } = await client.delete(`/tasks/${id}`);
        return data;
      },
    },
    User: {
      list: async () => {
        const { data } = await client.get('/users/');
        return data;
      },
    },
  },
  users: {
    inviteUser: async (email, role) => {
      const { data } = await client.post('/users/invite', null, { params: { email, role } });
      return data;
    },
  },
};

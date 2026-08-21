import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-management-mern-1-8cl9.onrender.com',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
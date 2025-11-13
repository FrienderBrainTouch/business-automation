import axios from 'axios';

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;

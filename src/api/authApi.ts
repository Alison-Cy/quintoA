import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error('Error al iniciar sesión');
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error('Error al registrarse');
  }
};

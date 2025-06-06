import axios from 'axios';
import { API_URL } from '../utils/constants'; // Asegúrate que esto apunte a 'http://TU_BACKEND_URL/api'

const api = axios.create({
  baseURL: API_URL,
});

// Login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { email, password }); // <-- Aquí asegúrate que tu backend espera "email"
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error('Error al iniciar sesión');
  }
};

// Register con role como array
export const register = async (
  username: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const response = await api.post('/register', {
      username,
      email,
      password,
      role: [role.toUpperCase()], // Enviar como array ["USER"] o ["ADMIN"]
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error('Error al registrarse');
  }
};

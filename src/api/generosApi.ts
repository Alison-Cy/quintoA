import axios from 'axios';
import { API_URL } from '../utils/constants';
import { Genero, GeneroFormData } from '../types/genero';

// Usar la misma instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funciones para los géneros
export const getGeneros = async (): Promise<Genero[]> => {
  try {
    const response = await api.get<Genero[]>('/generos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    throw error;
  }
};

export const getGeneroById = async (id: number): Promise<Genero> => {
  try {
    const response = await api.get<Genero>(`/generos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener género con ID ${id}:`, error);
    throw error;
  }
};

export const createGenero = async (genero: GeneroFormData): Promise<Genero> => {
  try {
    const response = await api.post<Genero>('/generos', genero);
    return response.data;
  } catch (error) {
    console.error('Error al crear género:', error);
    throw error;
  }
};

export const updateGenero = async (id: number, genero: GeneroFormData): Promise<Genero> => {
  try {
    const response = await api.put<Genero>(`/generos/${id}`, genero);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar género con ID ${id}:`, error);
    throw error;
  }
};

export const deleteGenero = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/generos/${id}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar género con ID ${id}:`, error);
    throw error;
  }
};
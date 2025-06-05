import axios from 'axios';
import { API_URL } from '../utils/constants';
import { Pelicula, PeliculaFormData, PeliculaBackend } from '../types/pelicula';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener todas las películas
export const getPeliculas = async (): Promise<Pelicula[]> => {
  try {
    const response = await api.get<any[]>('/peliculas');
    console.log('Películas recibidas del backend:', response.data);
    
    // Adaptar cada película para el frontend con valores predeterminados
    const peliculasAdaptadas = response.data.map(pelicula => ({
      id: pelicula.id,
      titulo: pelicula.titulo || '',
      director: pelicula.director || '',
      anio: pelicula.anio || 0,
      rating: pelicula.rating || 0,
      sinopsis: pelicula.descripcion || '',  // Mapear descripcion a sinopsis
      duracion: pelicula.duracion || 0,
      trailer: pelicula.trailerLink || '',   // Mapear trailerLink a trailer
      genero: pelicula.genero,
      generoId: pelicula.genero?.id || 0     // Extraer ID del género
    }));
    
    return peliculasAdaptadas;
  } catch (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
};

// Función para obtener una película por ID
export const getPeliculaById = async (id: number): Promise<Pelicula> => {
  try {
    console.log(`Solicitando película con ID ${id}`);
    const response = await api.get<any>(`/peliculas/${id}`);
    console.log('Datos recibidos del backend:', response.data);
    
    // Adaptar datos del backend al formato del frontend con valores predeterminados
    const peliculaAdaptada: Pelicula = {
      id: response.data.id,
      titulo: response.data.titulo || '',
      director: response.data.director || '',
      anio: response.data.anio || 0,
      rating: response.data.rating || 0,
      sinopsis: response.data.descripcion || '',  // Convertir descripcion a sinopsis
      duracion: response.data.duracion || 0,
      trailer: response.data.trailerLink || '',   // Convertir trailerLink a trailer
      genero: response.data.genero,
      generoId: response.data.genero?.id || 0     // Extraer ID del género
    };
    
    console.log('Película adaptada para el frontend:', peliculaAdaptada);
    return peliculaAdaptada;
  } catch (error) {
    console.error(`Error al obtener película con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear una nueva película
export const createPelicula = async (pelicula: PeliculaFormData): Promise<Pelicula> => {
  try {
    console.log('Datos recibidos del formulario para crear:', pelicula);
    
    // Adaptar datos del frontend al formato del backend
    const peliculaParaBackend = {
      titulo: pelicula.titulo,
      director: pelicula.director,
      anio: pelicula.anio,
      descripcion: pelicula.sinopsis,    // Convertir sinopsis a descripcion
      duracion: pelicula.duracion,
      rating: pelicula.rating,
      trailerLink: pelicula.trailer,     // Convertir trailer a trailerLink
      genero: { id: pelicula.generoId }  // Convertir generoId a objeto genero
    };
    
    console.log('Datos adaptados para enviar al backend:', peliculaParaBackend);
    
    const response = await api.post<any>('/peliculas', peliculaParaBackend);
    console.log('Respuesta del backend tras crear:', response.data);
    
    // Adaptar la respuesta para el frontend con valores predeterminados
    const peliculaCreada: Pelicula = {
      id: response.data.id,
      titulo: response.data.titulo || '',
      director: response.data.director || '',
      anio: response.data.anio || 0,
      rating: response.data.rating || 0,
      sinopsis: response.data.descripcion || '',
      duracion: response.data.duracion || 0,
      trailer: response.data.trailerLink || '',
      genero: response.data.genero,
      generoId: response.data.genero?.id || 0
    };
    
    return peliculaCreada;
  } catch (error) {
    console.error('Error al crear película:', error);
    throw error;
  }
};

// Función para actualizar una película existente
export const updatePelicula = async (id: number, pelicula: PeliculaFormData): Promise<Pelicula> => {
  try {
    console.log(`Actualizando película ${id} con datos:`, pelicula);
    
    // Adaptar datos del frontend al formato del backend
    const peliculaParaBackend = {
      titulo: pelicula.titulo,
      director: pelicula.director,
      anio: pelicula.anio,
      descripcion: pelicula.sinopsis,    // Convertir sinopsis a descripcion
      duracion: pelicula.duracion,
      rating: pelicula.rating,
      trailerLink: pelicula.trailer,     // Convertir trailer a trailerLink
      genero: { id: pelicula.generoId }  // Convertir generoId a objeto genero
    };
    
    console.log('Datos adaptados para enviar al backend:', peliculaParaBackend);
    
    const response = await api.put<any>(`/peliculas/${id}`, peliculaParaBackend);
    console.log('Respuesta del backend tras actualizar:', response.data);
    
    // Adaptar la respuesta para el frontend con valores predeterminados
    const peliculaActualizada: Pelicula = {
      id: response.data.id,
      titulo: response.data.titulo || '',
      director: response.data.director || '',
      anio: response.data.anio || 0,
      rating: response.data.rating || 0,
      sinopsis: response.data.descripcion || '',
      duracion: response.data.duracion || 0,
      trailer: response.data.trailerLink || '',
      genero: response.data.genero,
      generoId: response.data.genero?.id || 0
    };
    
    return peliculaActualizada;
  } catch (error) {
    console.error(`Error al actualizar película con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar una película
export const deletePelicula = async (id: number): Promise<boolean> => {
  try {
    console.log(`Eliminando película con ID ${id}`);
    await api.delete(`/peliculas/${id}`);
    console.log(`Película ${id} eliminada correctamente`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar película con ID ${id}:`, error);
    throw error;
  }
};

// Exportación explícita de todas las funciones para asegurar que estén disponibles

// Modificación de pelicula.ts
import { Genero } from './genero';

// Lo que devuelve el backend
export interface PeliculaBackend {
  id: number;
  titulo: string;
  director: string;
  anio: number;
  rating: number;
  descripcion: string;   // Backend usa 'descripcion'
  duracion: number;
  trailerLink: string;   // Backend usa 'trailerLink'
  genero: Genero;
}

// Lo que usa el frontend
export interface Pelicula {
  id: number;
  titulo: string;
  director: string;
  anio: number;
  rating: number;
  sinopsis?: string;     // Marcado como opcional
  duracion: number;
  trailer?: string;      // Marcado como opcional
  genero?: Genero;       // Marcado como opcional
  generoId?: number;     // Marcado como opcional
}

// Lo que necesita el formulario
export interface PeliculaFormData {
  titulo: string;
  director: string;
  anio: number;
  rating: number;
  sinopsis: string;
  duracion: number;
  trailer: string;
  generoId: number;
}
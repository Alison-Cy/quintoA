// Cambia esta URL por la de tu servidor Spring Boot
// Para desarrollo local con emulador Android, usa 10.0.2.2 en lugar de localhost
// Para desarrollo local con un dispositivo real, usa tu IP local

export const API_URL = 'https:////192.168.1.40:8081';

// Colores de la aplicación
export const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#f9f9f9',
  text: '#333333',
  lightText: '#7f8c8d',
  error: '#e74c3c',
  white: '#ffffff',
  shadow: '#dddddd',
};

// Tipos de navegación
export type RootStackParamList = {
  Home: undefined;
  PeliculasList: undefined;
  PeliculaDetail: { peliculaId: number };
  PeliculaForm: { peliculaId?: number } | undefined;
  GenerosList: undefined;
  GeneroForm: { generoId?: number } | undefined;
};
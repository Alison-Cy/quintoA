import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pantallas de películas
import PeliculasListScreen from '../screens/peliculas/PeliculasListScreen';
import PeliculaDetailScreen from '../screens/peliculas/PeliculaDetailScreen';
import PeliculaFormScreen from '../screens/peliculas/PeliculaFormScreen';

// Pantallas de géneros
import GenerosListScreen from '../screens/generos/GenerosListScreen';
import GeneroFormScreen from '../screens/generos/GeneroFormScreen';

// Pantallas de autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Colores u otros datos constantes
import { COLORS } from '../utils/constants';

// --- Navegadores ---
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack de Películas
const PeliculasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PeliculasList" component={PeliculasListScreen} />
    <Stack.Screen name="PeliculaDetail" component={PeliculaDetailScreen} />
    <Stack.Screen name="PeliculaForm" component={PeliculaFormScreen} />
  </Stack.Navigator>
);

// Stack de Géneros
const GenerosStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GenerosList" component={GenerosListScreen} />
    <Stack.Screen name="GeneroForm" component={GeneroFormScreen} />
  </Stack.Navigator>
);

// Tabs principal para App cuando está logueado
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.lightText,
      tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 10 },
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Películas"
      component={PeliculasStack}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="movie" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Géneros"
      component={GenerosStack}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="category" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Stack de Autenticación (Login/Register)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// --- AppNavigator con control de sesión ---
const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // Pantalla de carga opcional

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

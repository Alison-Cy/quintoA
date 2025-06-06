import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHome from '../screens/auth/AdminHome';
// aquí podrías agregar más pantallas admin, ej. Reports, Users, etc.

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminHome} options={{ title: 'Inicio Admin' }} />
    </Stack.Navigator>
  );
}

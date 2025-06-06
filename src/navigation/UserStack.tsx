import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserHome from '../screens/auth/UserHome';
// agregar más pantallas usuario si quieres

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserHome" component={UserHome} options={{ title: 'Inicio Usuario' }} />
    </Stack.Navigator>
  );
}

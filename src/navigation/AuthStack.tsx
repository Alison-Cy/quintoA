import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/LoginScreen';
import Register from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="Register" component={Register} options={{ title: 'Registro' }} />
    </Stack.Navigator>
  );
}

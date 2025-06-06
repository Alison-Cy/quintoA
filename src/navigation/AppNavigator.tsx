import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import authStorage from 'storage/authStorage';
import AdminStack from './AdminStack';
import UserStack from './UserStack';
import AuthStack from './AuthStack';

export default function AppNavigator() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userRole = await authStorage.getUserRole(); // 'ROLE_ADMIN', 'ROLE_USER' o null
      setRole(userRole);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {role === 'ROLE_ADMIN' && <AdminStack />}
      {role === 'ROLE_USER' && <UserStack />}
      {!role && <AuthStack />}
    </NavigationContainer>
  );
}

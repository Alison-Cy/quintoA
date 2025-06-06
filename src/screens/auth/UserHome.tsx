import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import authStorage from 'storage/authStorage';

export default function UserHome({ navigation }: any) {
  const handleLogout = async () => {
    await authStorage.logout();
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Usuario</Text>
      <Text style={styles.description}>
        Puedes explorar y ver información de películas y géneros.
      </Text>

      <Button title="Explorar Películas" onPress={() => navigation.navigate('Peliculas')} />
      <Button title="Cerrar sesión" onPress={handleLogout} color="#D9534F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

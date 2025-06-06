import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import authStorage from 'storage/authStorage';

export default function AdminHome({ navigation }: any) {
  const handleLogout = async () => {
    await authStorage.logout();
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Administrador</Text>
      <Text style={styles.description}>
        Tienes permisos para crear, editar, eliminar y guardar contenido.
      </Text>

      <Button title="Ir a Gestión de Películas" onPress={() => navigation.navigate('Peliculas')} />
      <Button title="Cerrar sesión" onPress={handleLogout} color="#D9534F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

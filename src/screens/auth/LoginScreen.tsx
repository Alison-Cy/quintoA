import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { login } from '../../api/authApi';
import authStorage from '../../utils/authStorage';

export default function LoginScreen({ navigation }: any) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Alert.alert('Error', 'Por favor ingresa tu usuario/email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const { token } = await login(emailOrUsername, password);
      if (!token) throw new Error('Token no recibido');

      await authStorage.storeToken(token);

      const role = await authStorage.getUserRole();

      if (role === 'ROLE_ADMIN') {
        navigation.replace('AdminHome');
      } else {
        navigation.replace('UserHome');
      }

    } catch (error: any) {
      Alert.alert('Error al iniciar sesión', error?.message || 'Revisa tus credenciales');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        placeholder="Usuario o Email"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button
        title={loading ? 'Cargando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loading}
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Registrarse"
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});

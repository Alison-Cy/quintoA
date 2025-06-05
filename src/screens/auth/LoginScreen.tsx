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
      // Asumiendo que tu backend acepta email o username en el mismo campo
      const { token } = await login(emailOrUsername, password);

      if (!token) {
        Alert.alert('Error', 'No se recibió token de autenticación');
        setLoading(false);
        return;
      }

      await authStorage.storeToken(token);
      Alert.alert('Éxito', 'Login exitoso');

      // Navega a Home o pantalla principal
      navigation.replace('Home');
    } catch (error: any) {
      // error.message u otro mensaje que venga del backend
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
        keyboardType="email-address"
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

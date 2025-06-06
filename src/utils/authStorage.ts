import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const key = 'authToken';

export async function storeToken(token: string) {
  try {
    await AsyncStorage.setItem(key, token);
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
}

export async function getToken() {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error getting the auth token', error);
    return null;
  }
}

export async function getUserRole() {
  try {
    const token = await getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    // Asegúrate que tu token tenga algo como { roles: ["ROLE_USER"] }
    const role = decoded?.roles?.[0] || null;
    return role;
  } catch (error) {
    console.log('Error decoding token', error);
    return null;
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
}

export default {
  storeToken,
  getToken,
  getUserRole,
  removeToken,
};

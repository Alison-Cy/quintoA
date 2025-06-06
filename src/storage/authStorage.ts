// src/storage/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

const authStorage = {
  setSession: async (token: string, role: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(ROLE_KEY, role);
  },

  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  getUserRole: async () => {
    return await AsyncStorage.getItem(ROLE_KEY);
  },

  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(ROLE_KEY);
  },
};

export default authStorage;

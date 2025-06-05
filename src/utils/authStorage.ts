import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'authToken';

const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(key, token);
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};

export default {
  storeToken,
  getToken,
  removeToken,
};

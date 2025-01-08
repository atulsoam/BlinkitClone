import * as SecureStore from 'expo-secure-store';

const KEYS_STORAGE_KEY = 'secure_store_keys';

const getStoredKeys = async (): Promise<string[]> => {
  const keys = await SecureStore.getItemAsync(KEYS_STORAGE_KEY);
  return keys ? JSON.parse(keys) : [];
};

const saveStoredKeys = async (keys: string[]): Promise<void> => {
  await SecureStore.setItemAsync(KEYS_STORAGE_KEY, JSON.stringify(keys));
};

export const tokenStorage = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
    const keys = await getStoredKeys();
    if (!keys.includes(key)) {
      keys.push(key);
      await saveStoredKeys(keys);
    }
  },
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value ?? null;
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
    const keys = await getStoredKeys();
    const updatedKeys = keys.filter(storedKey => storedKey !== key);
    await saveStoredKeys(updatedKeys);
  },
  clearAll: async () => {
    const keys = await getStoredKeys();
    await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    await SecureStore.deleteItemAsync(KEYS_STORAGE_KEY);
  },
};

export const Storage = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
    const keys = await getStoredKeys();
    if (!keys.includes(key)) {
      keys.push(key);
      await saveStoredKeys(keys);
    }
  },
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(key);
    return value ?? null;
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
    const keys = await getStoredKeys();
    const updatedKeys = keys.filter(storedKey => storedKey !== key);
    await saveStoredKeys(updatedKeys);
  },
  clearAll: async () => {
    const keys = await getStoredKeys();
    await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    await SecureStore.deleteItemAsync(KEYS_STORAGE_KEY);
  },
};

export const mmkvStorage = Storage;
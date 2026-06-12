import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('[Storage] clearAll:', e);
  }
}

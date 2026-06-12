import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';
import { todayStr, yesterdayStr } from './_date';

/**
 * À appeler une fois à la fin de chaque session.
 * - Si déjà joué aujourd'hui : streak inchangé.
 * - Si joué hier             : streak + 1.
 * - Sinon                    : streak remis à 1.
 */
export async function updateStreak() {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.STREAK);
    const data = raw
      ? JSON.parse(raw)
      : { currentStreak: 0, bestStreak: 0, lastPlayedDate: null };

    if (!data.bestStreak) data.bestStreak = data.currentStreak ?? 0;

    const today     = todayStr();
    const yesterday = yesterdayStr();

    if (data.lastPlayedDate === today) return data;

    data.currentStreak =
      data.lastPlayedDate === yesterday ? data.currentStreak + 1 : 1;

    if (data.currentStreak > data.bestStreak) data.bestStreak = data.currentStreak;

    data.lastPlayedDate = today;
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error('[Storage] updateStreak:', e);
    return { currentStreak: 1, bestStreak: 1, lastPlayedDate: todayStr() };
  }
}

export async function getStreak() {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.STREAK);
    const data = raw
      ? JSON.parse(raw)
      : { currentStreak: 0, bestStreak: 0, lastPlayedDate: null };
    if (!data.bestStreak) data.bestStreak = data.currentStreak ?? 0;
    return data;
  } catch {
    return { currentStreak: 0, bestStreak: 0, lastPlayedDate: null };
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';
import { todayStr, _formatDate } from './_date';

export async function addDailyCount(n) {
  try {
    const today = todayStr();
    const raw   = await AsyncStorage.getItem(KEYS.DAILY);
    const data  = raw ? JSON.parse(raw) : { date: today, count: 0 };
    const count = data.date === today ? data.count + n : n;
    await AsyncStorage.setItem(KEYS.DAILY, JSON.stringify({ date: today, count }));
    return count;
  } catch (e) {
    console.error('[Storage] addDailyCount:', e);
    return 0;
  }
}

export async function getDailyCount() {
  try {
    const today       = todayStr();
    const raw         = await AsyncStorage.getItem(KEYS.DAILY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === today ? count : 0;
  } catch {
    return 0;
  }
}

export async function addDailyTime(seconds) {
  try {
    const today = todayStr();
    const raw   = await AsyncStorage.getItem(KEYS.DAILY_TIME);
    const data  = raw ? JSON.parse(raw) : { date: today, seconds: 0 };
    const total = data.date === today ? data.seconds + seconds : seconds;
    await AsyncStorage.setItem(KEYS.DAILY_TIME, JSON.stringify({ date: today, seconds: total }));
    return total;
  } catch { return 0; }
}

export async function getDailyTime() {
  try {
    const today = todayStr();
    const raw   = await AsyncStorage.getItem(KEYS.DAILY_TIME);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return data.date === today ? data.seconds : 0;
  } catch { return 0; }
}

export async function saveDailyScore(pct) {
  try {
    const raw   = await AsyncStorage.getItem(KEYS.DAILY_SCORES);
    const data  = raw ? JSON.parse(raw) : {};
    const today = todayStr();
    data[today] = Math.max(data[today] ?? 0, pct);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    for (const key of Object.keys(data)) {
      if (key < cutoff.toISOString().slice(0, 10)) delete data[key];
    }
    await AsyncStorage.setItem(KEYS.DAILY_SCORES, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] saveDailyScore:', e);
  }
}

export async function getWeeklyScores() {
  try {
    const raw    = await AsyncStorage.getItem(KEYS.DAILY_SCORES);
    const data   = raw ? JSON.parse(raw) : {};
    const days   = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = _formatDate(d);
      result.push({ day: days[d.getDay()], date: d.getDate(), pct: data[key] ?? null, isToday: i === 0 });
    }
    return result;
  } catch {
    return [];
  }
}

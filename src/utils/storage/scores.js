import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export async function saveScore(result) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SCORES);
    const scores = raw ? JSON.parse(raw) : [];
    scores.unshift({ ...result, date: new Date().toISOString() });
    await AsyncStorage.setItem(KEYS.SCORES, JSON.stringify(scores.slice(0, 50)));
    await _updateStats(result);
  } catch (e) {
    console.error('[Storage] saveScore:', e);
  }
}

export async function getScores() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SCORES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function _updateStats({ score, total }) {
  try {
    const raw   = await AsyncStorage.getItem(KEYS.STATS);
    const stats = raw
      ? JSON.parse(raw)
      : { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, bestTotal: 0 };

    stats.sessions       += 1;
    stats.totalCorrect   += score;
    stats.totalQuestions += total;
    if (score > stats.bestScore) {
      stats.bestScore = score;
      stats.bestTotal = total;
    }
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('[Storage] _updateStats:', e);
  }
}

export async function getStats() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STATS);
    return raw
      ? JSON.parse(raw)
      : { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, bestTotal: 0 };
  } catch {
    return { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, bestTotal: 0 };
  }
}

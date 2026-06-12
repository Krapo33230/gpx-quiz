import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export async function updateProgressionMatiere(details) {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.PROG_MATIERE);
    const data = raw ? JSON.parse(raw) : {};

    for (const { question, correct } of details) {
      const cat = question?.categorie;
      if (!cat) continue;
      if (!data[cat]) data[cat] = { correct: 0, total: 0 };
      data[cat].total += 1;
      if (correct) data[cat].correct += 1;
    }
    await AsyncStorage.setItem(KEYS.PROG_MATIERE, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] updateProgressionMatiere:', e);
  }
}

/** @returns {{ [categorie: string]: number }} Pourcentage 0-100 par catégorie. */
export async function getProgressionMatiere() {
  try {
    const raw    = await AsyncStorage.getItem(KEYS.PROG_MATIERE);
    const data   = raw ? JSON.parse(raw) : {};
    const result = {};
    for (const [cat, { correct, total }] of Object.entries(data)) {
      result[cat] = total > 0 ? Math.round((correct / total) * 100) : 0;
    }
    return result;
  } catch {
    return {};
  }
}

export async function recordAnswer(questionId, correct) {
  try {
    const raw      = await AsyncStorage.getItem(KEYS.PROGRESS);
    const progress = raw ? JSON.parse(raw) : {};
    if (!progress[questionId]) progress[questionId] = { attempts: 0, correct: 0 };
    progress[questionId].attempts += 1;
    if (correct) progress[questionId].correct += 1;
    await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('[Storage] recordAnswer:', e);
  }
}

export async function getProgress() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

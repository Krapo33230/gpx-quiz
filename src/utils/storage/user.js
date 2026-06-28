import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export async function isOnboardingDone() {
  try {
    const v = await AsyncStorage.getItem(KEYS.ONBOARDING);
    return v === 'done';
  } catch { return false; }
}

export async function completeOnboarding(name, age, email, matricule, gender) {
  try {
    await AsyncStorage.multiSet([
      [KEYS.ONBOARDING,      'done'],
      [KEYS.USER_NAME,       name ?? ''],
      [KEYS.USER_AGE,        age ? String(age) : ''],
      [KEYS.USER_EMAIL,      email ?? ''],
      [KEYS.USER_MATRICULE,  matricule ?? ''],
      [KEYS.USER_GENDER,     gender ?? ''],
    ]);
  } catch {}
}

export async function getUserEmail() {
  try { return (await AsyncStorage.getItem(KEYS.USER_EMAIL)) ?? ''; } catch { return ''; }
}

export async function getUserMatricule() {
  try { return (await AsyncStorage.getItem(KEYS.USER_MATRICULE)) ?? ''; } catch { return ''; }
}

export async function getUserName() {
  try {
    return (await AsyncStorage.getItem(KEYS.USER_NAME)) ?? '';
  } catch { return ''; }
}

export async function getUserAge() {
  try {
    return (await AsyncStorage.getItem(KEYS.USER_AGE)) ?? '';
  } catch { return ''; }
}

export async function saveObjectif(questions) {
  try { await AsyncStorage.setItem(KEYS.OBJECTIF, String(questions)); } catch {}
}

export async function getObjectif() {
  try {
    const v = await AsyncStorage.getItem(KEYS.OBJECTIF);
    return v ? parseInt(v, 10) : 10;
  } catch { return 10; }
}

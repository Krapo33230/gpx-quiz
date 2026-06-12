import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export const LEVELS = [
  { name: 'Recrue',     emoji: '🎖️', min: 0,    color: '#8892A8', gradient: ['#C8CDD8', '#9298A8', '#B4B9C6', '#72788A'] },
  { name: 'Gardien',    emoji: '🥈',  min: 500,  color: '#8090AC', gradient: ['#E0E5F0', '#9BA6BE', '#CDD4E4', '#8090AC'] },
  { name: 'Brigadier',  emoji: '🥇',  min: 1500, color: '#C09000', gradient: ['#FFE566', '#C09000', '#FFD020', '#A07800'] },
  { name: 'Officier',   emoji: '💎',  min: 3000, color: '#006DBF', gradient: ['#5CC8FF', '#006DBF', '#38AAEE', '#004A90'] },
  { name: 'Commandant', emoji: '🏆',  min: 6000, color: '#C03800', gradient: ['#FFB060', '#C03800', '#FF7020', '#901800'] },
];

export function getLevelInfo(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) level = l;
  }
  const idx  = LEVELS.indexOf(level);
  const next = LEVELS[idx + 1] ?? null;
  const pct  = next
    ? Math.min(100, Math.round(((xp - level.min) / (next.min - level.min)) * 100))
    : 100;
  return { level, next, pct, xp };
}

export function calcXP(score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return score * 10 + (pct >= 80 ? 20 : pct >= 60 ? 10 : 0);
}

export async function addXP(n) {
  try {
    const raw     = await AsyncStorage.getItem(KEYS.XP);
    const current = raw ? parseInt(raw, 10) : 0;
    await AsyncStorage.setItem(KEYS.XP, String(current + n));
    return current + n;
  } catch (e) {
    console.error('[Storage] addXP:', e);
    return 0;
  }
}

export async function getXP() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.XP);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

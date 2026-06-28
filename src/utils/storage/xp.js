import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './_keys';

export const LEVELS = [
  { name: 'Recrue',     emoji: '🎖️', min: 0,    color: '#6B7280', gradient: ['#9CA3AF', '#6B7280', '#D1D5DB', '#4B5563'] },
  { name: 'Gardien',    emoji: '🥈',  min: 500,  color: '#3B82F6', gradient: ['#93C5FD', '#3B82F6', '#60A5FA', '#1D4ED8'] },
  { name: 'Brigadier',  emoji: '🥇',  min: 1500, color: '#D97706', gradient: ['#FDE68A', '#D97706', '#FBBF24', '#B45309'] },
  { name: 'Officier',   emoji: '💎',  min: 3000, color: '#7C3AED', gradient: ['#C4B5FD', '#7C3AED', '#A78BFA', '#5B21B6'] },
  { name: 'Commandant', emoji: '🏆',  min: 6000, color: '#DC2626', gradient: ['#FCA5A5', '#DC2626', '#F87171', '#991B1B'] },
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

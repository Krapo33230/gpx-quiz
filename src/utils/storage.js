import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SCORES:        'gdp_scores',
  PROGRESS:      'gdp_progress',
  STATS:         'gdp_stats',
  STREAK:        'gdp_streak',
  PROG_MATIERE:  'gdp_prog_matiere',
  DAILY:         'gdp_daily',
  XP:            'gdp_xp',
  DAILY_SCORES:  'gdp_daily_scores',
};

// ─── Scores ────────────────────────────────────────────────────────────────────

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

// ─── Statistiques globales ─────────────────────────────────────────────────────

async function _updateStats({ score, total }) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STATS);
    const stats = raw
      ? JSON.parse(raw)
      : { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0 };

    stats.sessions       += 1;
    stats.totalCorrect   += score;
    stats.totalQuestions += total;
    if (score > stats.bestScore) stats.bestScore = score;

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
      : { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0 };
  } catch {
    return { sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0 };
  }
}

// ─── Streak ────────────────────────────────────────────────────────────────────

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * À appeler une fois à la fin de chaque session.
 * - Si déjà joué aujourd'hui : streak inchangé.
 * - Si joué hier             : streak + 1.
 * - Sinon                    : streak remis à 1.
 * @returns {{ currentStreak: number, lastPlayedDate: string }}
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

    if (data.lastPlayedDate === today) {
      return data;
    }

    data.currentStreak =
      data.lastPlayedDate === yesterday
        ? data.currentStreak + 1
        : 1;

    if (data.currentStreak > data.bestStreak) data.bestStreak = data.currentStreak;

    data.lastPlayedDate = today;
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error('[Storage] updateStreak:', e);
    return { currentStreak: 1, bestStreak: 1, lastPlayedDate: todayStr() };
  }
}

/** @returns {{ currentStreak: number, bestStreak: number, lastPlayedDate: string|null }} */
export async function getStreak() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STREAK);
    const data = raw ? JSON.parse(raw) : { currentStreak: 0, bestStreak: 0, lastPlayedDate: null };
    if (!data.bestStreak) data.bestStreak = data.currentStreak ?? 0;
    return data;
  } catch {
    return { currentStreak: 0, bestStreak: 0, lastPlayedDate: null };
  }
}

// ─── XP & Niveaux ─────────────────────────────────────────────────────────────

export const LEVELS = [
  { name: 'Recrue',      emoji: '🎖️',  min: 0,    color: '#A0A0A0' },
  { name: 'Gardien',     emoji: '🥈',  min: 500,  color: '#8B8B8B' },
  { name: 'Brigadier',   emoji: '🥇',  min: 1500, color: '#F5C518' },
  { name: 'Officier',    emoji: '💎',  min: 3000, color: '#00BFFF' },
  { name: 'Commandant',  emoji: '🏆',  min: 6000, color: '#FF6B35' },
];

export function getLevelInfo(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) level = l;
  }
  const idx  = LEVELS.indexOf(level);
  const next = LEVELS[idx + 1] ?? null;
  const pct  = next
    ? Math.round(((xp - level.min) / (next.min - level.min)) * 100)
    : 100;
  return { level, next, pct, xp };
}

export function calcXP(score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return score * 10 + (pct >= 80 ? 20 : pct >= 60 ? 10 : 0);
}

export async function addXP(n) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.XP);
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

// ─── Scores journaliers (graphe hebdo) ────────────────────────────────────────

export async function saveDailyScore(pct) {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.DAILY_SCORES);
    const data = raw ? JSON.parse(raw) : {};
    const today = todayStr();
    // Garde le meilleur score de la journée
    data[today] = Math.max(data[today] ?? 0, pct);
    // Nettoie les entrées > 30 jours
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
    const raw  = await AsyncStorage.getItem(KEYS.DAILY_SCORES);
    const data = raw ? JSON.parse(raw) : {};
    const days = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      result.push({
        day:  days[d.getDay()],
        date: d.getDate(),
        pct:  data[key] ?? null,
        isToday: i === 0,
      });
    }
    return result;
  } catch {
    return [];
  }
}

// ─── Progression par matière ───────────────────────────────────────────────────

/**
 * Met à jour les compteurs par catégorie à partir des détails d'une session.
 * @param {Array<{ question: { categorie: string }, correct: boolean }>} details
 */
export async function updateProgressionMatiere(details) {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.PROG_MATIERE);
    const data = raw ? JSON.parse(raw) : {};

    for (const { question, correct } of details) {
      const cat = question?.categorie;
      if (!cat) continue;
      if (!data[cat]) data[cat] = { correct: 0, total: 0 };
      data[cat].total  += 1;
      if (correct) data[cat].correct += 1;
    }

    await AsyncStorage.setItem(KEYS.PROG_MATIERE, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] updateProgressionMatiere:', e);
  }
}

/**
 * @returns {{ [categorie: string]: number }} Pourcentage 0-100 par catégorie.
 */
export async function getProgressionMatiere() {
  try {
    const raw  = await AsyncStorage.getItem(KEYS.PROG_MATIERE);
    const data = raw ? JSON.parse(raw) : {};
    const result = {};
    for (const [cat, { correct, total }] of Object.entries(data)) {
      result[cat] = total > 0 ? Math.round((correct / total) * 100) : 0;
    }
    return result;
  } catch {
    return {};
  }
}

// ─── Compteur journalier (paywall) ────────────────────────────────────────────

/**
 * Ajoute n questions au compteur du jour.
 * Remet le compteur à zéro si le jour a changé.
 * @param {number} n
 * @returns {number} Nouveau total du jour.
 */
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

/** @returns {number} Nombre de questions répondues aujourd'hui. */
export async function getDailyCount() {
  try {
    const today = todayStr();
    const raw   = await AsyncStorage.getItem(KEYS.DAILY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === today ? count : 0;
  } catch {
    return 0;
  }
}

// ─── Progression par question (existant) ─────────────────────────────────────

export async function recordAnswer(questionId, correct) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
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

// ─── Reset ─────────────────────────────────────────────────────────────────────

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('[Storage] clearAll:', e);
  }
}

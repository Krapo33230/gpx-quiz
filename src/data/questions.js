/**
 * Banque de questions – Concours Gardien de la Paix
 * Les questions sont réparties par fichier catégorie.
 */

import { QUESTIONS_DROIT }    from './questions_droit';
import { QUESTIONS_CULTURE }  from './questions_culture';
import { QUESTIONS_LOGIQUE }  from './questions_logique';
import { QUESTIONS_SECURITE } from './questions_securite';
import { QUESTIONS_FRANÇAIS } from './questions_francais';
import { QUESTIONS_MONDE }    from './questions_monde';
import { QUESTIONS_EXERCICES } from './questions_exercices';

export const CATEGORIES = {
  DROIT:     { label: 'Droit & Institutions',   emoji: '⚖️',  color: '#1A3F7A' },
  CULTURE:   { label: 'Culture Générale',        emoji: '🌍',  color: '#2B7A5B' },
  LOGIQUE:   { label: 'Logique & Raisonnement',  emoji: '🧠',  color: '#7A2B6A' },
  SECURITE:  { label: 'Sécurité & Police',       emoji: '🚔',  color: '#7A4B1A' },
  FRANÇAIS:  { label: 'Français & Expression',   emoji: '📝',  color: '#1A6A7A' },
  MONDE:     { label: 'Monde & Citoyenneté',     emoji: '🌐',  color: '#1A6A3A' },
};

export const QUESTIONS = [
  ...QUESTIONS_DROIT,
  ...QUESTIONS_CULTURE,
  ...QUESTIONS_LOGIQUE,
  ...QUESTIONS_SECURITE,
  ...QUESTIONS_FRANÇAIS,
  ...QUESTIONS_MONDE,
  ...QUESTIONS_EXERCICES,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getByCategorie(categorie) {
  return QUESTIONS.filter(q => q.categorie === categorie);
}

function shuffleOptions(q) {
  if (q.type === 'vrai_faux') return q; // Vrai/Faux ne se mélangent pas
  const indices = Array.from({ length: q.options.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const correctOption = q.options[q.correctIndex];
  const shuffledOptions = indices.map(i => q.options[i]);
  return {
    ...q,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(correctOption),
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomQuestions(n = 10, categorie = null) {
  const all = categorie ? getByCategorie(categorie) : [...QUESTIONS];

  const exercises = shuffle(all.filter(q => q.type === 'vrai_faux' || q.type === 'completion'));
  const qcm       = shuffle(all.filter(q => !q.type || q.type === 'qcm'));

  // Garantit au moins 2 exercices différents (si dispo) dans chaque session
  const exCount  = Math.min(Math.max(2, Math.floor(n * 0.3)), exercises.length);
  const qcmCount = Math.min(n - exCount, qcm.length);

  return shuffle([
    ...exercises.slice(0, exCount),
    ...qcm.slice(0, qcmCount),
  ]).map(shuffleOptions);
}

export function getFlashSession()  { return getRandomQuestions(5);  }
export function getFullSession()   { return getRandomQuestions(20); }

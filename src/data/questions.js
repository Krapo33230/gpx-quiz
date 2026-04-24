/**
 * Banque de questions – Concours Gardien de la Paix
 * Les questions sont réparties par fichier catégorie.
 */

import { QUESTIONS_DROIT }    from './questions_droit';
import { QUESTIONS_CULTURE }  from './questions_culture';
import { QUESTIONS_LOGIQUE }  from './questions_logique';
import { QUESTIONS_SECURITE } from './questions_securite';
import { QUESTIONS_FRANÇAIS } from './questions_francais';

export const CATEGORIES = {
  DROIT:     { label: 'Droit & Institutions',   emoji: '⚖️',  color: '#1A3F7A' },
  CULTURE:   { label: 'Culture Générale',        emoji: '🌍',  color: '#2B7A5B' },
  LOGIQUE:   { label: 'Logique & Raisonnement',  emoji: '🧠',  color: '#7A2B6A' },
  SECURITE:  { label: 'Sécurité & Police',       emoji: '🚔',  color: '#7A4B1A' },
  FRANÇAIS:  { label: 'Français & Expression',   emoji: '📝',  color: '#1A6A7A' },
};

export const QUESTIONS = [
  ...QUESTIONS_DROIT,
  ...QUESTIONS_CULTURE,
  ...QUESTIONS_LOGIQUE,
  ...QUESTIONS_SECURITE,
  ...QUESTIONS_FRANÇAIS,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getByCategorie(categorie) {
  return QUESTIONS.filter(q => q.categorie === categorie);
}

function shuffleOptions(q) {
  const indices = [0, 1, 2, 3];
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

export function getRandomQuestions(n = 10, categorie = null) {
  const pool = categorie ? getByCategorie(categorie) : [...QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(n, pool.length)).map(shuffleOptions);
}

export function getFlashSession()  { return getRandomQuestions(5);  }
export function getFullSession()   { return getRandomQuestions(20); }

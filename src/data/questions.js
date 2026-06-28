/**
 * Banque de questions – Concours Gardien de la Paix
 * Les questions sont réparties par fichier catégorie.
 */

import { QUESTIONS_DROIT }             from './questions_droit';
import { QUESTIONS_DROIT_2 }           from './questions_droit_2';
import { QUESTIONS_CULTURE }           from './questions_culture';
import { QUESTIONS_CULTURE_2 }         from './questions_culture_2';
import { QUESTIONS_LOGIQUE }           from './questions_logique';
import { QUESTIONS_LOGIQUE_2 }         from './questions_logique_2';
import { QUESTIONS_SECURITE }          from './questions_securite';
import { QUESTIONS_SECURITE_2 }        from './questions_securite_2';
import { QUESTIONS_FRANÇAIS }          from './questions_francais';
import { QUESTIONS_FRANÇAIS_2 }        from './questions_francais_2';
import { QUESTIONS_MONDE }             from './questions_monde';
import { QUESTIONS_MONDE_2 }           from './questions_monde_2';
import { QUESTIONS_EXERCICES }         from './questions_exercices';
import { QUESTIONS_EXERCICES_2 }       from './questions_exercices_2';
import { QUESTIONS_PSYCHO_NUM }        from './questions_psycho_num';
import { QUESTIONS_PSYCHO_NUM_2 }      from './questions_psycho_num_2';
import { QUESTIONS_PSYCHO_VERBAL }     from './questions_psycho_verbal';
import { QUESTIONS_PSYCHO_VERBAL_2 }   from './questions_psycho_verbal_2';
import { QUESTIONS_PSYCHO_ABSTRAIT }   from './questions_psycho_abstrait';
import { QUESTIONS_PSYCHO_ABSTRAIT_2 } from './questions_psycho_abstrait_2';
import { QUESTIONS_ANGLAIS }           from './questions_anglais';
import { QUESTIONS_ANGLAIS_2 }         from './questions_anglais_2';

export const CATEGORIES = {
  DROIT:           { label: 'Droit & Institutions',      emoji: '⚖️',  color: '#1A3F7A' },
  CULTURE:         { label: 'Culture Générale',           emoji: '🌍',  color: '#2B7A5B' },
  LOGIQUE:         { label: 'Logique & Raisonnement',     emoji: '🧠',  color: '#7A2B6A' },
  SECURITE:        { label: 'Sécurité & Police',          emoji: '🚔',  color: '#7A4B1A' },
  FRANÇAIS:        { label: 'Français & Expression',      emoji: '📝',  color: '#1A6A7A' },
  MONDE:           { label: 'Monde & Citoyenneté',        emoji: '🌐',  color: '#1A6A3A' },
  PSYCHO_NUM:      { label: 'Calcul & Numérique',         emoji: '🔢',  color: '#4A1A7A' },
  PSYCHO_VERBAL:   { label: 'Raisonnement Verbal',        emoji: '💬',  color: '#1A5A4A' },
  PSYCHO_ABSTRAIT: { label: 'Raisonnement Abstrait',      emoji: '🔷',  color: '#7A3A1A' },
  ANGLAIS:         { label: 'Anglais',                    emoji: '🇬🇧',  color: '#1A2A7A' },
  EXERCICES:       { label: 'Exercices Pratiques',         emoji: '📋',  color: '#5A1A6A' },
};

export const QUESTIONS = [
  ...QUESTIONS_DROIT,           ...QUESTIONS_DROIT_2,
  ...QUESTIONS_CULTURE,         ...QUESTIONS_CULTURE_2,
  ...QUESTIONS_LOGIQUE,         ...QUESTIONS_LOGIQUE_2,
  ...QUESTIONS_SECURITE,        ...QUESTIONS_SECURITE_2,
  ...QUESTIONS_FRANÇAIS,        ...QUESTIONS_FRANÇAIS_2,
  ...QUESTIONS_MONDE,           ...QUESTIONS_MONDE_2,
  ...QUESTIONS_EXERCICES,       ...QUESTIONS_EXERCICES_2,
  ...QUESTIONS_PSYCHO_NUM,      ...QUESTIONS_PSYCHO_NUM_2,
  ...QUESTIONS_PSYCHO_VERBAL,   ...QUESTIONS_PSYCHO_VERBAL_2,
  ...QUESTIONS_PSYCHO_ABSTRAIT, ...QUESTIONS_PSYCHO_ABSTRAIT_2,
  ...QUESTIONS_ANGLAIS,         ...QUESTIONS_ANGLAIS_2,
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

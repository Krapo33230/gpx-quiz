export const INTRO_MESSAGES = [
  "Salut, bienvenue sur ConcoursPolice !",
  "Je vais t'aider à préparer le concours Gardien de la Paix.",
  "Pour adapter ta préparation,\nréponds à 4 questions.",
  "Ça prend moins de 1 minute — promis !",
];

export const LAST_INTRO_IDX  = 3;
export const HIGHLIGHT_INTRO  = '1 minute';
export const HIGHLIGHT_INTRO2 = '4 questions';

export const DATES_CONCOURS = [
  { id: '3m',  label: 'Dans moins de 3 mois',  tag: 'Urgent',  gradient: ['#1A4AFF', '#0F0F0F'] },
  { id: '6m',  label: 'Dans 3 à 6 mois',       tag: 'Bientôt', gradient: ['#1A4AFF', '#0F0F0F'] },
  { id: '12m', label: 'Dans 6 à 12 mois',      tag: 'Serein',  gradient: ['#1A4AFF', '#0F0F0F'] },
  { id: 'nsp', label: 'Je ne sais pas encore', tag: 'Indécis', gradient: ['#1A4AFF', '#0F0F0F'] },
];

export const DATE_REACTIONS = {
  '3m':  "Ok ! Ça va être serré, mais c'est faisable.",
  '6m':  "Super ! C'est le timing parfait.",
  '12m': "Parfait ! Tu as le temps de bien préparer.",
  'nsp': "D'accord ! L'essentiel, c'est de commencer.",
};

export const NIVEAUX = [
  { id: 'nul',   label: 'Je débute, je ne connais rien',          badge: 'DÉBUTANT'  },
  { id: 'peu',   label: 'Quelques notions sur le concours',        badge: 'NOVICE'    },
  { id: 'moyen', label: "J'ai déjà commencé à réviser",           badge: 'CONFIRMÉ'  },
  { id: 'bon',   label: 'Je connais bien le programme',           badge: 'AVANCÉ'    },
  { id: 'pret',  label: 'Je suis quasi prêt(e) pour le concours', badge: 'EXPERT'    },
];

export const NIVEAU_REACTIONS = {
  'nul':   "Ok ! On part de zéro ensemble, pas de souci.",
  'peu':   "Bien ! Tu as déjà une base, c'est un bon départ.",
  'moyen': "Super ! Tu as de l'avance, on va en profiter.",
  'bon':   "Excellent ! On va peaufiner les derniers détails.",
  'pret':  "Waouh ! On vérifie tout pour être au top.",
};

export const OBJECTIFS = [
  { id: 5,  label: '5 min/jour',  tag: 'Tranquille' },
  { id: 10, label: '10 min/jour', tag: 'Normal'     },
  { id: 15, label: '15 min/jour', tag: 'Intensif'   },
  { id: 20, label: '20 min/jour', tag: 'Extrême'    },
];

export const OBJECTIF_REACTIONS = {
  5:  { message: "Bien ! Ça fait environ 10 questions à revoir par jour.",  highlight: "10 questions" },
  10: { message: "Super ! Ça représente environ 20 questions par jour.",    highlight: "20 questions" },
  15: { message: "Sérieux ! Ça fait environ 30 questions par jour.",        highlight: "30 questions" },
  20: { message: "Intense ! Ça représente environ 40 questions par jour.",  highlight: "40 questions" },
};

export const STEP_PROGRESS  = [15, 28, 40, 52, 61, 68, 75, 82, 88, 94, 100];
export const INTRO_PROGRESS = [4, 8, 11, 15];

export const NB_CONFETTI = 60;
export const CONFETTI_COLORS = [
  '#FFC800', '#EF4135', '#58CC02', '#1A4AFF', '#FF6B35',
  '#F0F4FF', '#FF3CA0', '#00D4FF', '#FFE135', '#A855F7',
];
export const SHAPES = [
  { w: 6,  h: 14, br: 2 },
  { w: 10, h: 10, br: 5 },
  { w: 8,  h: 8,  br: 0 },
  { w: 4,  h: 18, br: 1 },
  { w: 12, h: 6,  br: 2 },
  { w: 9,  h: 9,  br: 9 },
];

// ─── Palette principale ────────────────────────────────────────────────────────
export const COLORS = {
  primary:       '#1A3F7A',   // Bleu police nationale
  primaryLight:  '#2B5BA8',   // Bleu hover
  primaryDark:   '#102850',   // Bleu foncé
  accent:        '#F5C518',   // Jaune accent (étoiles, victoire)
  success:       '#3DBE6E',   // Vert bonne réponse
  danger:        '#E84040',   // Rouge mauvaise réponse
  warning:       '#F09E1A',   // Orange
  background:    '#FFFFFF',   // Fond blanc
  surface:       '#F4F6FB',   // Fond carte
  surfaceAlt:    '#EDF0F7',   // Fond alternatif
  border:        '#D8DEEA',   // Bordure
  text:          '#0F1A2E',   // Texte principal
  textSecondary: '#5A6A85',   // Texte secondaire
  textDisabled:  '#A4B0C5',   // Texte désactivé
  white:         '#FFFFFF',
  overlay:       'rgba(10, 20, 50, 0.45)',
};

// ─── Typographie ───────────────────────────────────────────────────────────────
export const FONTS = {
  h1:   { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  h2:   { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3:   { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  sm:   { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  xs:   { fontSize: 12, fontWeight: '500' },
  bold: { fontWeight: '700' },
};

// ─── Ombres ────────────────────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor: '#1A3F7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: '#1A3F7A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};

// ─── Rayons ────────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 50,
};

// ─── Espacement ────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

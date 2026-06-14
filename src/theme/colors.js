// ─── Palette — ConcoursPolice ──────────────────────────────────────────────
export const COLORS = {
  // Drapeau français
  bleuFr:      '#002395',
  rougeFr:     '#EF4135',
  blanc:       '#F0F4FF',

  // Fonds
  background:  '#0F0F0F',
  surface:     '#1C1C1E',
  surfaceAlt:  '#252528',

  // Bordures
  border:      'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.15)',

  // Textes
  text:          '#F0F4FF',
  textSecondary: 'rgba(208,216,232,0.65)',
  textDisabled:  'rgba(208,216,232,0.3)',

  // États (style moderne)
  success:  '#58CC02',   // vert Duolingo
  danger:   '#EF4135',
  warning:  '#FFC800',   // jaune streak
  overlay:  'rgba(0, 0, 0, 0.6)',

  // Alias (compatibilité)
  primary:      '#002395',
  primaryLight: '#1A4AFF',
  primaryDark:  '#0F0F0F',
  accent:       '#EF4135',
  white:        '#F0F4FF',
};

// ─── Typographie ───────────────────────────────────────────────────────────────
export const FONTS = {
  h1:   { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  h2:   { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  h3:   { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  sm:   { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  xs:   { fontSize: 12, fontWeight: '500' },
};

// ─── Ombres ────────────────────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
};

// ─── Rayons — style moderne ────────────────────────────────────────────────────
export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  pill: 100,
};

// ─── Espacement ────────────────────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

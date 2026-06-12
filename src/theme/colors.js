// ─── Palette principale ────────────────────────────────────────────────────────
export const COLORS = {
  primary:       '#4A85E8',   // Bleu lisible sur fond dark
  primaryLight:  '#6B9FF0',
  primaryDark:   '#2B5BA8',
  accent:        '#F5C518',   // Jaune accent
  success:       '#3DBE6E',
  danger:        '#E84040',
  warning:       '#F09E1A',
  background:    '#0A1628',   // Fond sombre
  surface:       '#162034',   // Fond carte
  surfaceAlt:    '#1A2E4A',   // Fond alternatif
  border:        '#1E3A5A',   // Bordure
  text:          '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textDisabled:  'rgba(255,255,255,0.3)',
  white:         '#FFFFFF',
  overlay:       'rgba(0, 0, 0, 0.6)',
};

// ─── Typographie ───────────────────────────────────────────────────────────────
export const FONTS = {
  h1:   { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  h2:   { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3:   { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  sm:   { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  xs:   { fontSize: 12, fontWeight: '500' },
};

// ─── Ombres ────────────────────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: COLORS.primary,
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

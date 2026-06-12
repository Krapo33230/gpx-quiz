// ─── Palette principale — Couleurs de la France ────────────────────────────
export const COLORS = {
  // Drapeau français
  bleuFr:      '#002395',   // bleu officiel drapeau FR
  rougeFr:     '#EF4135',   // rouge officiel drapeau FR
  blanc:       '#F0F4FF',   // blanc légèrement bleuté

  // Fonds
  background:  '#001249',   // bleu très sombre (fond principal)
  surface:     '#001E6B',   // bleu mid (cartes)
  surfaceAlt:  '#002B8F',   // bleu légèrement plus clair

  // Bordures & accents
  border:      '#0035A8',
  borderLight: 'rgba(240,244,255,0.15)',

  // Textes
  text:          '#F0F4FF',
  textSecondary: 'rgba(208,216,232,0.7)',
  textDisabled:  'rgba(208,216,232,0.3)',

  // États
  success:  '#1e6b3a',
  danger:   '#EF4135',
  warning:  '#E8A020',
  overlay:  'rgba(0, 0, 0, 0.6)',

  // Héritage (utilisé dans quelques composants — à migrer progressivement)
  primary:      '#002395',
  primaryLight: '#0035A8',
  primaryDark:  '#001249',
  accent:       '#EF4135',
  white:        '#F0F4FF',
};

// ─── Typographie ───────────────────────────────────────────────────────────────
export const FONTS = {
  h1:   { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  h2:   { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  h3:   { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  sm:   { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  xs:   { fontSize: 12, fontWeight: '500' },
};

// ─── Ombres ────────────────────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
};

// ─── Rayons (max 2px selon DESIGN.md) ─────────────────────────────────────────
export const RADIUS = {
  sm:   2,
  md:   2,
  lg:   2,
  xl:   2,
  pill: 2,
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

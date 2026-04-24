import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';

const SUPPORT_EMAIL  = 'messmacr@gmail.com';
const MAILTO_SUBJECT = encodeURIComponent('Abonnement GardienQuiz Premium');
const MAILTO_BODY    = encodeURIComponent(
  'Bonjour,\n\nJe souhaite démarrer mon essai gratuit de 7 jours pour GardienQuiz Premium.\n\nMerci !',
);
const MAILTO_URL = `mailto:${SUPPORT_EMAIL}?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`;

const AVANTAGES = [
  {
    emoji: '♾️',
    titre: 'Questions illimitées',
    desc:  'Entraîne-toi autant que tu veux, sans restriction journalière.',
  },
  {
    emoji: '📂',
    titre: 'Toutes les annales',
    desc:  'Accède à l\'intégralité des sujets des concours précédents.',
  },
  {
    emoji: '📊',
    titre: 'Statistiques avancées',
    desc:  'Suivi détaillé de ta progression par matière et dans le temps.',
  },
];

export default function PaywallScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // ─── Animations ─────────────────────────────────────────────────────────────
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim   = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0, friction: 8, tension: 60, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function dismiss() {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 700, duration: 250, useNativeDriver: true,
      }),
    ]).start(() => navigation.goBack());
  }

  async function handleCTA() {
    const canOpen = await Linking.canOpenURL(MAILTO_URL);
    if (canOpen) {
      await Linking.openURL(MAILTO_URL);
    }
  }

  return (
    <View style={styles.root}>
      {/* ── Overlay sombre cliquable ── */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayAnim }]}
        pointerEvents="box-only"
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      {/* ── Bottom sheet ── */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + SPACING.lg },
          { transform: [{ translateY: sheetAnim }] },
        ]}
      >
        {/* Poignée */}
        <View style={styles.handle} />

        {/* ── Badge étoile ── */}
        <View style={styles.starBadge}>
          <Text style={styles.starEmoji}>⭐</Text>
        </View>

        {/* ── Titre ── */}
        <Text style={styles.titre}>Continue ta{'\n'}préparation sans limite</Text>
        <Text style={styles.sousTitre}>
          Passe au niveau supérieur et décroche ton concours.
        </Text>

        {/* ── Avantages ── */}
        <View style={styles.avantages}>
          {AVANTAGES.map((a, i) => (
            <View key={i} style={styles.avantageRow}>
              <View style={styles.avantageIconWrap}>
                <Text style={styles.avantageEmoji}>{a.emoji}</Text>
              </View>
              <View style={styles.avantageText}>
                <Text style={styles.avantagetitre}>{a.titre}</Text>
                <Text style={styles.avantageDesc}>{a.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Prix ── */}
        <View style={styles.prixCard}>
          <View style={styles.prixLeft}>
            <Text style={styles.essaiLabel}>7 jours gratuits</Text>
            <Text style={styles.prixDetail}>puis 4,99 € / mois · Sans engagement</Text>
          </View>
          <View style={styles.prixRight}>
            <Text style={styles.prixMontant}>4,99€</Text>
            <Text style={styles.prixMois}>/mois</Text>
          </View>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleCTA}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Commencer 7 jours gratuits</Text>
        </TouchableOpacity>

        {/* ── Dismiss ── */}
        <TouchableOpacity onPress={dismiss} style={styles.laterBtn} hitSlop={12}>
          <Text style={styles.laterText}>Peut-être plus tard</Text>
        </TouchableOpacity>

        {/* ── Mention légale ── */}
        <Text style={styles.legal}>
          Résiliable à tout moment. Aucune facturation pendant l'essai.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 50, 0.55)',
  },

  // Sheet
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    ...SHADOWS.card,
  },
  handle: {
    width: 40, height: 5,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },

  // Badge étoile
  starBadge: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  starEmoji: { fontSize: 32 },

  // Titre
  titre: {
    ...FONTS.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 34,
  },
  sousTitre: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  // Avantages
  avantages: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  avantageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  avantageIconWrap: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '14',
    alignItems: 'center', justifyContent: 'center',
  },
  avantageEmoji:  { fontSize: 22 },
  avantageText:   { flex: 1 },
  avantagetitre:  { ...FONTS.sm, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  avantageDesc:   { ...FONTS.xs, color: COLORS.textSecondary, lineHeight: 16 },

  // Prix
  prixCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '0D',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '40',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  prixLeft:    { flex: 1 },
  essaiLabel:  { ...FONTS.sm, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  prixDetail:  { ...FONTS.xs, color: COLORS.textSecondary },
  prixRight:   { alignItems: 'flex-end' },
  prixMontant: { ...FONTS.h2, color: COLORS.primary },
  prixMois:    { ...FONTS.xs, color: COLORS.textSecondary },

  // CTA
  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  ctaText: {
    ...FONTS.h3,
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // Dismiss
  laterBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  laterText: {
    ...FONTS.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },

  // Légal
  legal: {
    ...FONTS.xs,
    color: COLORS.textDisabled,
    textAlign: 'center',
    lineHeight: 16,
  },
});

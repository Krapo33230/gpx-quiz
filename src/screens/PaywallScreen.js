import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { getOfferings, purchasePackage, restorePurchases } from '../utils/purchases';

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

  const [offering,   setOffering]   = useState(null);
  const [loading,    setLoading]    = useState(false);

  // ─── Animations ─────────────────────────────────────────────────────────────
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim   = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(sheetAnim,   { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();

    getOfferings().then(setOffering);
  }, []);

  // Package mensuel en priorité, premier disponible en fallback
  const pkg = offering?.availablePackages?.find(p => p.packageType === 'MONTHLY')
           ?? offering?.availablePackages?.[0]
           ?? null;

  const priceLabel = pkg?.product?.priceString ?? null;

  // ─── Dismiss avec animation ──────────────────────────────────────────────────
  function dismiss() {
    Animated.parallel([
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetAnim,   { toValue: 700, duration: 250, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }

  // ─── Achat ───────────────────────────────────────────────────────────────────
  async function handlePurchase() {
    if (!pkg || loading) return;
    setLoading(true);
    try {
      const isPremium = await purchasePackage(pkg);
      if (isPremium) dismiss();
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Erreur', 'L\'achat a échoué. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Restore ─────────────────────────────────────────────────────────────────
  async function handleRestore() {
    if (loading) return;
    setLoading(true);
    try {
      const isPremium = await restorePurchases();
      if (isPremium) {
        Alert.alert('Restauré ✓', 'Ton abonnement a été restauré avec succès.', [
          { text: 'Continuer', onPress: dismiss },
        ]);
      } else {
        Alert.alert('Aucun achat', 'Aucun abonnement actif trouvé pour ce compte Google.');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      {/* ── Overlay sombre cliquable ── */}
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} pointerEvents="box-none">
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
            <Text style={styles.prixDetail}>puis {priceLabel ?? '...'} / mois · Sans engagement</Text>
          </View>
          {priceLabel && (
            <View style={styles.prixRight}>
              <Text style={styles.prixMontant}>{priceLabel}</Text>
              <Text style={styles.prixMois}>/mois</Text>
            </View>
          )}
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={[styles.ctaBtn, (!pkg || loading) && styles.ctaBtnDisabled]}
          onPress={handlePurchase}
          activeOpacity={0.85}
          disabled={!pkg || loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.ctaText}>Commencer 7 jours gratuits</Text>
          }
        </TouchableOpacity>

        {/* ── Restore + Dismiss ── */}
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={handleRestore} hitSlop={12} disabled={loading}>
            <Text style={styles.restoreText}>Restaurer mes achats</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={dismiss} hitSlop={12} disabled={loading}>
            <Text style={styles.laterText}>Plus tard</Text>
          </TouchableOpacity>
        </View>

        {/* ── Mention légale ── */}
        <Text style={styles.legal}>
          Résiliable à tout moment depuis Google Play. Aucune facturation pendant l'essai.
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

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 50, 0.55)',
  },

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

  avantages: { gap: SPACING.sm, marginBottom: SPACING.lg },
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

  ctaBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaText: { ...FONTS.h3, color: COLORS.white, letterSpacing: 0.3 },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  restoreText: { ...FONTS.sm, color: COLORS.primary, textDecorationLine: 'underline' },
  laterText:   { ...FONTS.sm, color: COLORS.textSecondary, textDecorationLine: 'underline' },

  legal: {
    ...FONTS.xs,
    color: COLORS.textDisabled,
    textAlign: 'center',
    lineHeight: 16,
  },
});

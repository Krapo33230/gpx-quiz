import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { CATEGORIES } from '../data/questions';

const MODES = [
  {
    id: 'flash',
    emoji: '⚡',
    titre: 'Entraînement éclair',
    description: '5 questions rapides, toutes matières',
    duree: '~3 min',
    couleur: '#F5C518',
    bg: '#FFFBEA',
  },
  {
    id: 'complet',
    emoji: '📋',
    titre: 'Quiz complet',
    description: '20 questions, toutes matières mélangées',
    duree: '~15 min',
    couleur: '#1A3F7A',
    bg: '#EEF2FA',
  },
  {
    id: 'droit',
    emoji: '⚖️',
    titre: 'Droit & Institutions',
    description: 'Spécialisé Droit, Constitution, Procédure',
    duree: '~8 min',
    couleur: '#1A3F7A',
    bg: '#EEF2FA',
    categorie: 'DROIT',
  },
  {
    id: 'culture',
    emoji: '🌍',
    titre: 'Culture Générale',
    description: 'Histoire, géographie, société française',
    duree: '~8 min',
    couleur: '#2B7A5B',
    bg: '#EBF8F2',
    categorie: 'CULTURE',
  },
  {
    id: 'logique',
    emoji: '🧠',
    titre: 'Logique & Raisonnement',
    description: 'Séries, syllogismes, calculs',
    duree: '~8 min',
    couleur: '#7A2B6A',
    bg: '#F8EBF7',
    categorie: 'LOGIQUE',
  },
  {
    id: 'securite',
    emoji: '🚔',
    titre: 'Sécurité & Police',
    description: 'Organisation police, procédures',
    duree: '~8 min',
    couleur: '#7A4B1A',
    bg: '#FBF2E9',
    categorie: 'SECURITE',
  },
  {
    id: 'francais',
    emoji: '📝',
    titre: 'Français & Expression',
    description: 'Orthographe, vocabulaire, grammaire',
    duree: '~8 min',
    couleur: '#1A6A7A',
    bg: '#EBF6F8',
    categorie: 'FRANÇAIS',
  },
];

export default function ChoixModeScreen({ navigation }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  function handleSelectMode(mode) {
    navigation.navigate('Quiz', { mode });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── En-tête ── */}
      <Animated.View
        style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Choisissez votre mode</Text>
        <Text style={styles.sousTitre}>Sélectionnez une matière ou un mode général</Text>
      </Animated.View>

      {/* ── Cartes de mode ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {MODES.map((mode, index) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            index={index}
            onPress={() => handleSelectMode(mode)}
          />
        ))}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeCard({ mode, index, onPress }) {
  const scale     = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 350, delay, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, delay, friction: 8, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale }, { translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: mode.bg }, SHADOWS.card]}
      >
        {/* Barre colorée à gauche */}
        <View style={[styles.accentBar, { backgroundColor: mode.couleur }]} />

        <View style={styles.cardEmoji}>
          <Text style={styles.emoji}>{mode.emoji}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitre, { color: mode.couleur }]}>{mode.titre}</Text>
          <Text style={styles.cardDesc}>{mode.description}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDuree}>⏱ {mode.duree}</Text>
          </View>
        </View>

        <Text style={[styles.arrow, { color: mode.couleur }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: { marginBottom: SPACING.sm },
  backText: { ...FONTS.body, color: COLORS.primary, fontWeight: '600' },
  titre: { ...FONTS.h2, color: COLORS.text, marginBottom: 4 },
  sousTitre: { ...FONTS.sm, color: COLORS.textSecondary },

  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },

  cardWrapper: { marginBottom: SPACING.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    paddingLeft: 0,
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
    borderRadius: RADIUS.pill,
    marginRight: SPACING.md,
    marginLeft: SPACING.xs,
  },
  cardEmoji: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: { fontSize: 24 },
  cardContent: { flex: 1 },
  cardTitre: { ...FONTS.h3, marginBottom: 2 },
  cardDesc: { ...FONTS.sm, color: COLORS.textSecondary, marginBottom: 4 },
  cardMeta: { flexDirection: 'row' },
  cardDuree: { ...FONTS.xs, color: COLORS.textDisabled, fontWeight: '600' },
  arrow: { fontSize: 28, fontWeight: '300', paddingHorizontal: SPACING.sm },
});

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { CATEGORIES } from '../data/questions';

const CONCOURS_BLANC = {
  id: 'concoursBlanc',
  emoji: '🏛️',
  titre: 'Concours Blanc',
  description: 'Simulateur d\'examen complet — 40 questions · 45 min · Toutes matières',
  couleur: '#002395',
};

const MODES = [
  {
    id: 'flash',
    emoji: '⚡',
    titre: 'Entraînement éclair',
    description: '5 questions rapides, toutes matières',
    duree: '~3 min',
    count: 5,
    couleur: '#F5C518',
    bg: '#FFFBEA',
  },
  {
    id: 'complet',
    emoji: '📋',
    titre: 'Quiz complet',
    description: '20 questions, toutes matières mélangées',
    duree: '~15 min',
    count: 20,
    couleur: '#1A3F7A',
    bg: '#EEF2FA',
  },
  {
    id: 'droit',
    emoji: '⚖️',
    titre: 'Droit & Institutions',
    description: '10 questions · Droit, Constitution, Procédure',
    duree: '~8 min',
    count: 10,
    couleur: '#1A3F7A',
    bg: '#EEF2FA',
    categorie: 'DROIT',
  },
  {
    id: 'culture',
    emoji: '🌍',
    titre: 'Culture Générale',
    description: '10 questions · Histoire, géographie, société',
    duree: '~8 min',
    count: 10,
    couleur: '#2B7A5B',
    bg: '#EBF8F2',
    categorie: 'CULTURE',
  },
  {
    id: 'logique',
    emoji: '🧠',
    titre: 'Logique & Raisonnement',
    description: '10 questions · Séries, syllogismes, calculs',
    duree: '~8 min',
    count: 10,
    couleur: '#7A2B6A',
    bg: '#F8EBF7',
    categorie: 'LOGIQUE',
  },
  {
    id: 'securite',
    emoji: '🚔',
    titre: 'Sécurité & Police',
    description: '10 questions · Organisation police, procédures',
    duree: '~8 min',
    count: 10,
    couleur: '#7A4B1A',
    bg: '#FBF2E9',
    categorie: 'SECURITE',
  },
  {
    id: 'francais',
    emoji: '📝',
    titre: 'Français & Expression',
    description: '10 questions · Orthographe, vocabulaire, grammaire',
    duree: '~8 min',
    count: 10,
    couleur: '#1A6A7A',
    bg: '#EBF6F8',
    categorie: 'FRANÇAIS',
  },
  {
    id: 'monde',
    emoji: '🌐',
    titre: 'Monde & Citoyenneté',
    description: '10 questions · ONU, UE, histoire, symboles',
    duree: '~8 min',
    count: 10,
    couleur: '#1A6A3A',
    bg: '#EBF8F0',
    categorie: 'MONDE',
  },
  {
    id: 'psycho_num',
    emoji: '🔢',
    titre: 'Calcul & Numérique',
    description: '10 questions · Calcul mental, suites, pourcentages',
    duree: '~8 min',
    count: 10,
    couleur: '#4A1A7A',
    bg: '#F0EBF8',
    categorie: 'PSYCHO_NUM',
  },
  {
    id: 'psycho_verbal',
    emoji: '💬',
    titre: 'Raisonnement Verbal',
    description: '10 questions · Analogies, synonymes, logique verbale',
    duree: '~8 min',
    count: 10,
    couleur: '#1A5A4A',
    bg: '#EBF6F4',
    categorie: 'PSYCHO_VERBAL',
  },
  {
    id: 'psycho_abstrait',
    emoji: '🔷',
    titre: 'Raisonnement Abstrait',
    description: '10 questions · Matrices, formes, séquences',
    duree: '~8 min',
    count: 10,
    couleur: '#7A3A1A',
    bg: '#FBF0E9',
    categorie: 'PSYCHO_ABSTRAIT',
  },
  {
    id: 'anglais',
    emoji: '🇬🇧',
    titre: 'Anglais',
    description: '10 questions · Compréhension, vocabulaire, grammaire',
    duree: '~8 min',
    count: 10,
    couleur: '#1A2A7A',
    bg: '#EEF0FA',
    categorie: 'ANGLAIS',
  },
  {
    id: 'exercices',
    emoji: '✅',
    titre: 'Exercices Pratiques',
    description: '10 questions · Vrai/faux, mises en situation',
    duree: '~8 min',
    count: 10,
    couleur: '#3A5A1A',
    bg: '#EFF5EB',
    categorie: 'EXERCICES',
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
      {/* ── En-tête ── */}
      <Animated.View
        style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.titre}>Apprendre</Text>
        <Text style={styles.sousTitre}>Sélectionnez une matière ou un mode général</Text>
      </Animated.View>

      {/* ── Grille de modes ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Concours blanc — carte vedette pleine largeur */}
        <TouchableOpacity onPress={() => handleSelectMode(CONCOURS_BLANC)} activeOpacity={0.85}>
          <LinearGradient
            colors={['#1A4AFF', '#002395']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredCard}
          >
            <View style={styles.featuredLeft}>
              <Text style={styles.featuredEmoji}>{CONCOURS_BLANC.emoji}</Text>
              <View>
                <Text style={styles.featuredTitre}>{CONCOURS_BLANC.titre}</Text>
                <Text style={styles.featuredDesc}>{CONCOURS_BLANC.description}</Text>
              </View>
            </View>
            <Text style={styles.featuredArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.grid}>
          {MODES.map((mode, index) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              index={index}
              onPress={() => handleSelectMode(mode)}
            />
          ))}
        </View>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeCard({ mode, index, onPress }) {
  const scale    = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
        style={styles.card}
      >
        <View style={[styles.cardIconBox, { backgroundColor: mode.couleur + '22' }]}>
          <Text style={styles.emoji}>{mode.emoji}</Text>
        </View>
        <Text style={styles.cardTitre} numberOfLines={2}>{mode.titre}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F0F' },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  titre: { ...FONTS.h2, color: '#FFFFFF', marginBottom: 4 },
  sousTitre: { ...FONTS.sm, color: 'rgba(255,255,255,0.7)' },

  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cardWrapper: { width: '48.5%' },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    height: 120,
  },
  cardIconBox: {
    width: 52, height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: { fontSize: 26 },
  cardTitre: { ...FONTS.sm, fontWeight: '800', color: '#FFFFFF', marginBottom: 4, lineHeight: 18 },
  cardDuree: { ...FONTS.xs, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },

  featuredCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  featuredLeft:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  featuredEmoji: { fontSize: 32 },
  featuredTitre: { ...FONTS.body, fontWeight: '900', color: '#FFFFFF', marginBottom: 3 },
  featuredDesc:  { ...FONTS.xs, color: 'rgba(255,255,255,0.6)', lineHeight: 16 },
  featuredArrow: { fontSize: 20, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
});

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
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { CATEGORIES } from '../data/questions';

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
  safe: { flex: 1, backgroundColor: '#0E1829' },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  titre: { ...FONTS.h2, color: '#FFFFFF', marginBottom: 4 },
  sousTitre: { ...FONTS.sm, color: 'rgba(255,255,255,0.55)' },

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
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#1E2F48',
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
});

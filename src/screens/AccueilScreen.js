import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { PrimaryButton, OutlineButton, StatCard } from '../components/ui';
import { getStats, getStreak, getProgressionMatiere } from '../utils/storage';
import { CATEGORIES } from '../data/questions';

// Ordre d'affichage des matières
const MATIERES_ORDER = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS'];

export default function AccueilScreen({ navigation }) {
  const [stats, setStats] = useState({
    sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0,
  });
  const [streak,      setStreak]      = useState(0);
  const [progression, setProgression] = useState({});

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  async function loadAll() {
    const [s, sk, prog] = await Promise.all([
      getStats(),
      getStreak(),
      getProgressionMatiere(),
    ]);
    setStats(s);
    setStreak(sk.currentStreak);
    setProgression(prog);
  }

  useEffect(() => {
    loadAll();
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadAll);
    return unsub;
  }, [navigation]);

  const tauxReussite =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── En-tête + streak ── */}
        <Animated.View
          style={[styles.header, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🚔</Text>
            </View>
            {streak > 0 && <StreakBadge streak={streak} />}
          </View>
          <Text style={styles.appName}>GardienQuiz</Text>
          <Text style={styles.subtitle}>Concours Gardien de la Paix</Text>
          <Text style={styles.subtitle2}>Police Nationale</Text>
        </Animated.View>

        {/* ── Stats globales ── */}
        {stats.sessions > 0 && (
          <Animated.View
            style={[styles.statsRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <StatCard icon="🎯" value={`${tauxReussite}%`} label="Taux de réussite" />
            <StatCard icon="📚" value={stats.sessions}       label="Sessions" />
            <StatCard icon="⭐" value={stats.bestScore}      label="Meilleur score" />
          </Animated.View>
        )}

        {/* ── Boutons principaux ── */}
        <Animated.View
          style={[styles.actions, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <PrimaryButton
            label="🚀  Commencer l'entraînement"
            onPress={() => navigation.navigate('ChoixMode')}
            style={styles.mainBtn}
          />
          {stats.sessions > 0 && (
            <OutlineButton
              label="📊  Voir mes résultats"
              onPress={() => navigation.navigate('Resultats')}
              style={styles.secondBtn}
            />
          )}
        </Animated.View>

        {/* ── Progression par matière ── */}
        <Animated.View
          style={[styles.matieres, SHADOWS.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.matieresTitre}>Progression par matière</Text>
          {MATIERES_ORDER.map((key) => {
            const cat = CATEGORIES[key];
            if (!cat) return null;
            const pct = progression[key] ?? 0;
            return (
              <MatiereBar
                key={key}
                emoji={cat.emoji}
                label={cat.label}
                color={cat.color}
                pct={pct}
                hasData={pct > 0}
              />
            );
          })}
        </Animated.View>

        <Text style={styles.footer}>Préparez-vous avec confiance 💪</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── StreakBadge ──────────────────────────────────────────────────────────────
function StreakBadge({ streak }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.streakBadge, { transform: [{ scale: pulse }] }]}>
      <Text style={styles.streakEmoji}>🔥</Text>
      <Text style={styles.streakNumber}>{streak}</Text>
      <Text style={styles.streakLabel}>{streak === 1 ? 'jour' : 'jours'}</Text>
    </Animated.View>
  );
}

// ─── MatiereBar ───────────────────────────────────────────────────────────────
function MatiereBar({ emoji, label, color, pct, hasData }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct / 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const barColor =
    pct >= 75 ? COLORS.success :
    pct >= 50 ? COLORS.warning :
    pct > 0   ? color :
    COLORS.border;

  return (
    <View style={styles.matiereRow}>
      <Text style={styles.matiereEmoji}>{emoji}</Text>
      <View style={styles.matiereContent}>
        <View style={styles.matiereHeader}>
          <Text style={styles.matiereLabel}>{label}</Text>
          <Text style={[styles.matierePct, { color: hasData ? barColor : COLORS.textDisabled }]}>
            {hasData ? `${pct}%` : '—'}
          </Text>
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                backgroundColor: barColor,
                width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },

  // En-tête
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  badge: {
    width: 90, height: 90,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.button,
  },
  badgeEmoji: { fontSize: 42 },
  appName:   { ...FONTS.h1, color: COLORS.primary, marginBottom: 4 },
  subtitle:  { ...FONTS.body, color: COLORS.textSecondary, fontWeight: '600' },
  subtitle2: { ...FONTS.sm, color: COLORS.textDisabled, marginTop: 2 },

  // Streak
  streakBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F09E1A',
    minWidth: 64,
  },
  streakEmoji:  { fontSize: 22 },
  streakNumber: { ...FONTS.h2, color: '#E67E00', lineHeight: 26 },
  streakLabel:  { ...FONTS.xs, color: '#E67E00', fontWeight: '600' },

  // Stats
  statsRow: { flexDirection: 'row', marginBottom: SPACING.lg },

  // Boutons
  actions: { gap: SPACING.sm, marginBottom: SPACING.xl },
  mainBtn:   { marginBottom: SPACING.xs },
  secondBtn: {},

  // Progression matières
  matieres: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  matieresTitre: { ...FONTS.h3, color: COLORS.text, marginBottom: SPACING.md },

  matiereRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  matiereEmoji:   { fontSize: 20, width: 28 },
  matiereContent: { flex: 1 },
  matiereHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  matiereLabel:   { ...FONTS.sm, color: COLORS.text, flex: 1 },
  matierePct:     { ...FONTS.sm, fontWeight: '700' },

  barTrack: {
    height: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },

  footer: {
    ...FONTS.sm,
    color: COLORS.textDisabled,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

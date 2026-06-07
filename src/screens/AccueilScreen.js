import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { PrimaryButton, OutlineButton, TricolorMark } from '../components/ui';
import {
  getStats, getStreak, getProgressionMatiere,
  getXP, getLevelInfo, getDailyCount, getWeeklyScores, getObjectif,
} from '../utils/storage';
import { CATEGORIES } from '../data/questions';

// Valeur par défaut — remplacée dynamiquement par getObjectif()
const DAILY_GOAL_DEFAULT = 10;
const MATIERES_ORDER = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS', 'MONDE'];

export default function AccueilScreen({ navigation }) {
  const [stats,       setStats]       = useState({ sessions: 0, totalCorrect: 0, totalQuestions: 0 });
  const [streak,      setStreak]      = useState(0);
  const [progression, setProgression] = useState({});
  const [xpInfo,      setXpInfo]      = useState(null);
  const [dailyCount,  setDailyCount]  = useState(0);
  const [dailyGoal,   setDailyGoal]   = useState(DAILY_GOAL_DEFAULT);
  const [weekDays,    setWeekDays]    = useState([]);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  async function loadAll() {
    const [s, sk, prog, xp, daily, weekly, goal] = await Promise.all([
      getStats(),
      getStreak(),
      getProgressionMatiere(),
      getXP(),
      getDailyCount(),
      getWeeklyScores(),
      getObjectif(),
    ]);
    setStats(s);
    setStreak(sk.currentStreak);
    setProgression(prog);
    setXpInfo(getLevelInfo(xp));
    setDailyCount(daily);
    setDailyGoal(goal);
    setWeekDays(buildWeekRow(weekly));
  }

  useEffect(() => {
    loadAll();
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadAll);
    return unsub;
  }, [navigation]);

  const questPct    = Math.min((dailyCount / dailyGoal) * 100, 100);
  const questDone   = dailyCount >= dailyGoal;
  const mascotMsg   = getMascotMessage(streak, dailyCount, stats.sessions);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Barre de stats en haut (style Duolingo) ── */}
        <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
          <View style={styles.topStat}>
            <Text style={styles.topStatIcon}>🔥</Text>
            <Text style={[styles.topStatValue, { color: '#E67E00' }]}>{streak}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Niveaux')} style={styles.topStat}>
            <Text style={styles.topStatIcon}>⚡</Text>
            <Text style={[styles.topStatValue, { color: COLORS.accent }]}>{xpInfo?.xp ?? 0}</Text>
          </TouchableOpacity>
          {xpInfo && (
            <TouchableOpacity onPress={() => navigation.navigate('Niveaux')} style={styles.topStatBadge}>
              <Text style={styles.topStatBadgeEmoji}>{xpInfo.level.emoji}</Text>
              <Text style={[styles.topStatBadgeLabel, { color: xpInfo.level.color }]}>{xpInfo.level.name}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Mascotte + bulle ── */}
        <Animated.View style={[styles.mascotSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.bubbleWrap}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{mascotMsg}</Text>
            </View>
            <View style={styles.bubbleTip} />
          </View>
          <TricolorMark size="xl" style={{ marginBottom: 4 }} />
        </Animated.View>

        {/* ── Quête du jour ── */}
        <Animated.View style={[styles.questCard, SHADOWS.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.questHeader}>
            <Text style={styles.questTag}>QUÊTE DU JOUR</Text>
            {questDone && <Text style={styles.questDoneTag}>✓ COMPLÉTÉE</Text>}
          </View>
          <Text style={styles.questTitle}>Réponds à {dailyGoal} questions</Text>
          <View style={styles.questBarTrack}>
            <View style={[styles.questBarFill, { width: `${questPct}%` }]} />
          </View>
          <Text style={styles.questProgress}>{Math.min(dailyCount, dailyGoal)}/{dailyGoal}</Text>
        </Animated.View>

        {/* ── Série — cercles des jours ── */}
        <Animated.View style={[styles.weekCard, SHADOWS.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>🔥 Série · {streak} {streak === 1 ? 'jour' : 'jours'}</Text>
          </View>
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => (
              <View key={i} style={styles.weekDayCol}>
                <Text style={styles.weekDayLetter}>{d.label}</Text>
                <View style={[
                  styles.weekCircle,
                  d.played  && styles.weekCircleDone,
                  d.isToday && !d.played && styles.weekCircleToday,
                ]}>
                  {d.played
                    ? <Text style={styles.weekCircleCheck}>✓</Text>
                    : <Text style={styles.weekCircleDot}>·</Text>
                  }
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Boutons principaux ── */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <PrimaryButton
            label="🚀  Commencer l'entraînement"
            onPress={() => navigation.navigate('ChoixMode')}
          />
          <OutlineButton
            label="🎯  Faire mon auto-évaluation"
            onPress={() => navigation.navigate('AutoEval')}
          />
          <OutlineButton
            label="📖  Lexique police"
            onPress={() => navigation.navigate('Lexique')}
          />
          {stats.sessions > 0 && (
            <OutlineButton
              label="📊  Voir mes résultats"
              onPress={() => navigation.navigate('Resultats')}
            />
          )}
        </Animated.View>

        {/* ── Progression par matière ── */}
        <Animated.View style={[styles.matieres, SHADOWS.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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

        <Text style={styles.footer}>Prépare-toi avec confiance 💪</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MatiereBar ───────────────────────────────────────────────────────────────
function MatiereBar({ emoji, label, color, pct, hasData }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct / 100, duration: 700, useNativeDriver: false }).start();
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
              { backgroundColor: barColor, width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getMascotMessage(streak, dailyCount, sessions) {
  if (sessions === 0)    return "Bienvenue ! Commençons ta préparation au concours 👋";
  if (dailyCount >= 10)  return "Quête du jour complétée ! Tu es en feu aujourd'hui 🔥";
  if (streak >= 7)       return `${streak} jours de suite ! Tu es inarrêtable 🏆`;
  if (streak >= 3)       return `Série de ${streak} jours ! Continue comme ça 💪`;
  if (dailyCount > 0)    return "Bien parti ! Encore quelques questions pour finir ta quête.";
  return "C'est l'heure de s'entraîner ! Bonne session 🎯";
}

function buildWeekRow(weeklyScores) {
  return weeklyScores.map(item => ({
    label:   item.day,
    played:  item.pct !== null,
    isToday: item.isToday,
  }));
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#0E1829' },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2F48',
    marginBottom: SPACING.lg,
  },
  topStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topStatIcon:  { fontSize: 20 },
  topStatValue: { ...FONTS.h3, fontWeight: '900' },
  topStatBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#162034', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderWidth: 1, borderColor: '#1E2F48' },
  topStatBadgeEmoji: { fontSize: 16 },
  topStatBadgeLabel: { ...FONTS.xs, fontWeight: '800' },

  // Mascotte
  mascotSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bubbleWrap: { alignItems: 'center', marginBottom: 4 },
  bubble: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: '#1E2F48',
    ...SHADOWS.card,
  },
  bubbleText: { ...FONTS.body, color: '#FFFFFF', textAlign: 'center', lineHeight: 22 },
  bubbleTip: {
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#1E2F48',
    marginTop: -1,
  },
  mascot: { fontSize: 72 },

  // Quête du jour
  questCard: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  questHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  questTag:     { ...FONTS.xs, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.8 },
  questDoneTag: { ...FONTS.xs, color: COLORS.success, fontWeight: '800', letterSpacing: 0.8 },
  questTitle:   { ...FONTS.body, color: '#FFFFFF', fontWeight: '600', marginBottom: SPACING.sm },
  questBarTrack: {
    height: 12,
    borderRadius: RADIUS.pill,
    backgroundColor: '#1E2F48',
    overflow: 'hidden',
    marginBottom: 6,
  },
  questBarFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: '#FFFFFF',
  },
  questProgress: { ...FONTS.xs, color: '#8A9BB5', fontWeight: '700', textAlign: 'right' },

  // Semaine / streak
  weekCard: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  weekHeader: { marginBottom: SPACING.sm },
  weekTitle:  { ...FONTS.h3, color: '#FFFFFF' },
  weekRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  weekDayCol: { alignItems: 'center', gap: 4 },
  weekDayLetter: { ...FONTS.xs, color: '#8A9BB5', fontWeight: '700' },
  weekCircle: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#1E2F48',
    alignItems: 'center', justifyContent: 'center',
  },
  weekCircleDone:  { backgroundColor: '#FFFFFF' },
  weekCircleToday: { borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#0E1829' },
  weekCircleCheck: { color: '#0E1829', fontSize: 16, fontWeight: '900' },
  weekCircleDot:   { color: '#4A5A6E', fontSize: 20 },

  // Boutons
  actions: { gap: SPACING.sm, marginBottom: SPACING.xl },

  // Progression matières
  matieres: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  matieresTitre: { ...FONTS.h3, color: '#FFFFFF', marginBottom: SPACING.md },
  matiereRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2F48',
    gap: SPACING.sm,
  },
  matiereEmoji:   { fontSize: 20, width: 28 },
  matiereContent: { flex: 1 },
  matiereHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  matiereLabel:   { ...FONTS.sm, color: '#FFFFFF', flex: 1 },
  matierePct:     { ...FONTS.sm, fontWeight: '700' },
  barTrack: { height: 8, borderRadius: RADIUS.pill, backgroundColor: '#1E2F48', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: RADIUS.pill },

  footer: { ...FONTS.sm, color: '#4A5A6E', textAlign: 'center', marginTop: SPACING.md },
});

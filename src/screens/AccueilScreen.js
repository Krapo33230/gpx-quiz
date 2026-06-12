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
  getStats, getStreak,
  getXP, getLevelInfo, getDailyCount, getDailyTime, getWeeklyScores, getObjectif, getUserName,
} from '../utils/storage';

const DAILY_GOAL_DEFAULT = 10;

export default function AccueilScreen({ navigation }) {
  const [stats,      setStats]      = useState({ sessions: 0, totalCorrect: 0, totalQuestions: 0 });
  const [streak,     setStreak]     = useState(0);
  const [xpInfo,     setXpInfo]     = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [dailyGoal,  setDailyGoal]  = useState(DAILY_GOAL_DEFAULT);
  const [dailyTime,  setDailyTime]  = useState(0);
  const [weekDays,   setWeekDays]   = useState([]);
  const [userName,   setUserName]   = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  async function loadAll() {
    const [s, sk, xp, daily, weekly, goal, name, time] = await Promise.all([
      getStats(),
      getStreak(),
      getXP(),
      getDailyCount(),
      getWeeklyScores(),
      getObjectif(),
      getUserName(),
      getDailyTime(),
    ]);
    setStats(s);
    setStreak(sk.currentStreak);
    setXpInfo(getLevelInfo(xp));
    setDailyCount(daily);
    setDailyGoal(goal);
    setWeekDays(buildWeekRow(weekly));
    setUserName(name);
    setDailyTime(time);
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

  const goalSeconds  = dailyGoal * 60;
  const timePct      = Math.min((dailyTime / goalSeconds) * 100, 100);
  const timeDone     = dailyTime >= goalSeconds;
  const timeMinStr   = `${Math.floor(dailyTime / 60)} min`;
  const mascotMsg    = getMascotMessage(streak, dailyCount, stats.sessions);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <Animated.View style={[styles.topHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.topHeaderLeft}>
            <TricolorMark size="sm" />
            <View style={styles.topHeaderText}>
              <Text style={styles.helloText}>
                Bonjour{userName ? `, ${userName}` : ''} 👋
              </Text>
              <Text style={styles.helloSub} numberOfLines={2}>{mascotMsg}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Niveaux')} style={styles.xpChip}>
            <Text style={styles.xpChipText}>⚡ {xpInfo?.xp ?? 0} XP</Text>
            {xpInfo && <Text style={styles.xpChipLevel}>{xpInfo.level.emoji} {xpInfo.level.name}</Text>}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Streak banner ── */}
        {streak > 0 && (
          <Animated.View style={[styles.streakBanner, { opacity: fadeAnim }]}>
            <Text style={styles.streakBannerText}>
              🔥 {streak} jour{streak > 1 ? 's' : ''} de suite — continue comme ça !
            </Text>
          </Animated.View>
        )}

        {/* ── Quête du jour ── */}
        <Animated.View style={[styles.questCard, SHADOWS.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.questHeader}>
            <Text style={styles.questTag}>QUÊTE DU JOUR</Text>
            {timeDone && <Text style={styles.questDoneTag}>✓ COMPLÉTÉE</Text>}
          </View>
          <Text style={styles.questTitle}>🕐 Objectif : {dailyGoal} min / jour</Text>
          <View style={styles.questBarTrack}>
            <View style={[styles.questBarFill, { width: `${timePct}%` }]} />
          </View>
          <Text style={styles.questProgress}>{timeMinStr} / {dailyGoal} min</Text>
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

        {/* ── Boutons ── */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <PrimaryButton
            label="🚀  Commencer l'entraînement"
            onPress={() => navigation.navigate('ChoixMode')}
          />
          <OutlineButton
            label="🎯  Faire mon auto-évaluation"
            onPress={() => navigation.navigate('AutoEval')}
          />
        </Animated.View>

        <Text style={styles.footer}>Prépare-toi avec confiance 💪</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getMascotMessage(streak, dailyCount, sessions) {
  if (sessions === 0)   return "Bienvenue ! Commençons ta préparation 👋";
  if (dailyCount >= 10) return "Quête du jour complétée ! Tu es en feu 🔥";
  if (streak >= 7)      return `${streak} jours de suite ! Inarrêtable 🏆`;
  if (streak >= 3)      return `Série de ${streak} jours ! Continue 💪`;
  if (dailyCount > 0)   return "Bien parti ! Encore quelques questions.";
  return "C'est l'heure de s'entraîner ! 🎯";
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

  topHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  topHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, minWidth: 0 },
  topHeaderText: { marginLeft: SPACING.sm, flex: 1, minWidth: 0 },
  helloText:  { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  helloSub:   { ...FONTS.xs, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  xpChip: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2F48',
    flexShrink: 0,
  },
  xpChipText:  { ...FONTS.xs, color: '#FFFFFF', fontWeight: '900' },
  xpChipLevel: { ...FONTS.xs, color: 'rgba(255,255,255,0.5)', marginTop: 1 },

  streakBanner: {
    backgroundColor: '#1A2A0A',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#2A4A0A',
  },
  streakBannerText: { ...FONTS.sm, color: '#7DDB3A', fontWeight: '700' },

  questCard: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  questHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  questTag:      { ...FONTS.xs, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.8 },
  questDoneTag:  { ...FONTS.xs, color: COLORS.success, fontWeight: '800', letterSpacing: 0.8 },
  questTitle:    { ...FONTS.body, color: '#FFFFFF', fontWeight: '600', marginBottom: SPACING.sm },
  questBarTrack: { height: 12, borderRadius: RADIUS.pill, backgroundColor: '#1E2F48', overflow: 'hidden', marginBottom: 6 },
  questBarFill:  { height: '100%', borderRadius: RADIUS.pill, backgroundColor: '#FFFFFF' },
  questProgress: { ...FONTS.xs, color: '#8A9BB5', fontWeight: '700', textAlign: 'right' },

  weekCard:   { backgroundColor: '#162034', borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: '#1E2F48' },
  weekHeader: { marginBottom: SPACING.sm },
  weekTitle:  { ...FONTS.h3, color: '#FFFFFF' },
  weekRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  weekDayCol: { alignItems: 'center', gap: 4 },
  weekDayLetter:   { ...FONTS.xs, color: '#8A9BB5', fontWeight: '700' },
  weekCircle:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E2F48', alignItems: 'center', justifyContent: 'center' },
  weekCircleDone:  { backgroundColor: '#FFFFFF' },
  weekCircleToday: { borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#0E1829' },
  weekCircleCheck: { color: '#0E1829', fontSize: 16, fontWeight: '900' },
  weekCircleDot:   { color: '#4A5A6E', fontSize: 20 },

  actions: { gap: SPACING.sm, marginBottom: SPACING.xl },
  footer:  { ...FONTS.sm, color: '#4A5A6E', textAlign: 'center', marginTop: SPACING.md },
});

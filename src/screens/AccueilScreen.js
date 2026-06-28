import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../theme/colors';
import {
  getStats, getStreak, getXP, getLevelInfo,
  getDailyCount, getDailyTime, getWeeklyScores, getObjectif, getUserName,
} from '../utils/storage';

const QUICK_MODES = [
  { id: 'flash',    emoji: '⚡', titre: 'Flash',          description: '5q · ~3 min',  couleur: '#F59E0B', categorie: null },
  { id: 'complet',  emoji: '📋', titre: 'Complet',        description: '20q · ~15 min', couleur: '#1A4AFF', categorie: null },
  { id: 'concours', emoji: '🏛️', titre: 'Concours Blanc', description: '40q · 45 min',  couleur: '#7C3AED', categorie: null },
];

export default function AccueilScreen({ navigation }) {
  const [streak,     setStreak]     = useState(0);
  const [xpInfo,     setXpInfo]     = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [dailyGoal,  setDailyGoal]  = useState(10);
  const [dailyTime,  setDailyTime]  = useState(0);
  const [weekDays,   setWeekDays]   = useState([]);
  const [userName,   setUserName]   = useState('');
  const [stats,      setStats]      = useState(null);

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  async function loadAll() {
    const [s, sk, xp, daily, weekly, goal, name, time] = await Promise.all([
      getStats(), getStreak(), getXP(), getDailyCount(),
      getWeeklyScores(), getObjectif(), getUserName(), getDailyTime(),
    ]);
    setStreak(sk.currentStreak);
    setXpInfo(getLevelInfo(xp));
    setDailyCount(daily);
    setDailyGoal(goal);
    setWeekDays(buildWeekRow(weekly));
    setUserName(name);
    setDailyTime(time);
    setStats(s);
  }

  useEffect(() => {
    loadAll();
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadAll);
    return unsub;
  }, [navigation]);

  const goalSeconds = dailyGoal * 60;
  const timePct     = Math.min((dailyTime / goalSeconds) * 100, 100);
  const timeDone    = dailyTime >= goalSeconds;

  const scoreMoyen = stats && stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <Animated.View style={[s.header, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={s.headerLeft}>
            <Text style={s.hello}>{userName || 'Recrue'}</Text>
            <Text style={s.helloSub}>
              {streak > 0 ? `🔥 ${streak} jour${streak > 1 ? 's' : ''} de suite` : 'Prêt à réviser ?'}
            </Text>
          </View>
          {xpInfo && (
            <TouchableOpacity
              style={[s.gradeBadge, { borderColor: xpInfo.level.color }]}
              onPress={() => navigation.navigate('Niveaux')}
              activeOpacity={0.8}
            >
              <Text style={s.gradeEmoji}>{xpInfo.level.emoji}</Text>
              <Text style={[s.gradeName, { color: xpInfo.level.color }]}>{xpInfo.level.name}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Mission du jour ── */}
        <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }], marginBottom: SPACING.lg }}>
          <LinearGradient
            colors={['#1A4AFF', '#002395']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.heroCard}
          >
            <View style={s.heroTop}>
              <Text style={s.heroLabel}>MISSION DU JOUR</Text>
              {timeDone && (
                <View style={s.heroDoneBadge}>
                  <Text style={s.heroDoneText}>✓ ACCOMPLI</Text>
                </View>
              )}
            </View>
            <Text style={s.heroTitle}>
              {timeDone
                ? 'Objectif atteint ! 🎉'
                : `${dailyCount} question${dailyCount > 1 ? 's' : ''} aujourd'hui`}
            </Text>
            <View style={s.heroBarTrack}>
              <View style={[s.heroBarFill, { width: `${timePct}%`, backgroundColor: timeDone ? COLORS.success : '#F0F4FF' }]} />
            </View>
            <Text style={s.heroBarLabel}>{Math.floor(dailyTime / 60)} / {dailyGoal} min</Text>
            <TouchableOpacity style={s.heroBtn} onPress={() => navigation.navigate('ChoixMode')} activeOpacity={0.85}>
              <Text style={s.heroBtnText}>🚀  Commencer l'entraînement</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* ── Stats row ── */}
        <Animated.View style={[s.statsRow, { opacity: fade }]}>
          <View style={s.statItem}>
            <Text style={s.statNum}>🔥 {streak}</Text>
            <Text style={s.statLabel}>Streak</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.statItem}>
            <Text style={s.statNum}>{stats?.totalQuestions ?? 0}</Text>
            <Text style={s.statLabel}>Questions</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.statItem}>
            <Text style={s.statNum}>{scoreMoyen !== null ? `${scoreMoyen}%` : '—'}</Text>
            <Text style={s.statLabel}>Moy. score</Text>
          </View>
        </Animated.View>

        {/* ── Accès rapide ── */}
        <Animated.View style={{ opacity: fade }}>
          <Text style={s.sectionTitle}>ACCÈS RAPIDE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.quickScroll}
          >
            {QUICK_MODES.map(mode => (
              <TouchableOpacity
                key={mode.id}
                style={[s.quickCard, { borderColor: mode.couleur + '55' }]}
                onPress={() => navigation.navigate('Quiz', { mode })}
                activeOpacity={0.8}
              >
                <Text style={s.quickEmoji}>{mode.emoji}</Text>
                <Text style={s.quickTitle}>{mode.titre}</Text>
                <Text style={s.quickSub}>{mode.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Série semaine ── */}
        <Animated.View style={[s.card, { opacity: fade }]}>
          <Text style={s.sectionTitle}>MA SÉRIE</Text>
          <View style={s.weekRow}>
            {weekDays.map((d, i) => (
              <View key={i} style={s.weekCol}>
                <Text style={s.weekLetter}>{d.label}</Text>
                <View style={[
                  s.weekCircle,
                  d.played  && s.weekCircleDone,
                  d.isToday && !d.played && s.weekCircleToday,
                ]}>
                  <Text style={[s.weekCircleText, d.played && s.weekCircleTextDone]}>
                    {d.played ? '✓' : '·'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function buildWeekRow(weeklyScores) {
  return weeklyScores.map(item => ({
    label:   item.day,
    played:  item.pct !== null,
    isToday: item.isToday,
  }));
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.xxl },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  headerLeft: { flex: 1 },
  hello:    { fontSize: 26, fontWeight: '900', color: COLORS.text },
  helloSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

  gradeBadge: {
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderWidth: 1.5,
    backgroundColor: COLORS.surface,
    minWidth: 72,
  },
  gradeEmoji: { fontSize: 20 },
  gradeName:  { fontSize: 11, fontWeight: '800', marginTop: 2, letterSpacing: 0.3 },

  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  heroTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  heroLabel:    { fontSize: 11, fontWeight: '800', color: 'rgba(240,244,255,0.6)', letterSpacing: 1.5 },
  heroDoneBadge:{ backgroundColor: COLORS.success, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 3 },
  heroDoneText: { fontSize: 10, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  heroTitle:    { fontSize: 20, fontWeight: '900', color: '#F0F4FF', marginBottom: SPACING.md },
  heroBarTrack: { height: 6, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', marginBottom: 6 },
  heroBarFill:  { height: '100%', borderRadius: RADIUS.pill },
  heroBarLabel: { fontSize: 12, color: 'rgba(240,244,255,0.6)', marginBottom: SPACING.md },
  heroBtn:      { backgroundColor: '#F0F4FF', borderRadius: RADIUS.pill, paddingVertical: 14, alignItems: 'center' },
  heroBtnText:  { fontSize: 15, fontWeight: '900', color: COLORS.bleuFr },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    marginBottom: SPACING.lg,
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statNum:   { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  statSep:   { width: 1, backgroundColor: COLORS.border },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.2, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  quickScroll:  { gap: 12, paddingVertical: 4, paddingRight: SPACING.lg },
  quickCard: {
    width: 155,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    gap: 6,
  },
  quickEmoji: { fontSize: 28 },
  quickTitle: { fontSize: 15, fontWeight: '900', color: COLORS.text },
  quickSub:   { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weekRow:            { flexDirection: 'row', justifyContent: 'space-between' },
  weekCol:            { alignItems: 'center', gap: 6 },
  weekLetter:         { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  weekCircle:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  weekCircleDone:     { backgroundColor: COLORS.success },
  weekCircleToday:    { borderWidth: 2, borderColor: '#F0F4FF', backgroundColor: 'transparent' },
  weekCircleText:     { fontSize: 16, color: COLORS.textSecondary, fontWeight: '700' },
  weekCircleTextDone: { color: '#fff' },
});

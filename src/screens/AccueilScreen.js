import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/colors';
import {
  getStats, getStreak, getXP, getLevelInfo,
  getDailyCount, getDailyTime, getWeeklyScores, getObjectif, getUserName,
} from '../utils/storage';

export default function AccueilScreen({ navigation }) {
  const [streak,     setStreak]     = useState(0);
  const [xpInfo,     setXpInfo]     = useState(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [dailyGoal,  setDailyGoal]  = useState(10);
  const [dailyTime,  setDailyTime]  = useState(0);
  const [weekDays,   setWeekDays]   = useState([]);
  const [userName,   setUserName]   = useState('');

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

  const OUTILS = [
    { icon: '📝', label: 'Quiz',           sub: 'Entraîne-toi',        route: 'ChoixMode' },
    { icon: '🎯', label: 'Auto-éval',      sub: 'Teste ton niveau',    route: 'AutoEval'  },
    { icon: '📖', label: 'Lexique',        sub: 'Termes clés',         route: 'Lexique'   },
    { icon: '📊', label: 'Statistiques',   sub: 'Tes performances',    route: 'Resultats' },
  ];

  const BIENTOT = [
    { icon: '📅', label: 'Mon programme',        sub: 'Plan de révision personnalisé' },
    { icon: '🏋️', label: 'Exercices quotidiens', sub: 'Entraînement du jour'          },
    { icon: '🗓️', label: 'Agenda',               sub: 'Dates clés du concours'        },
    { icon: '📰', label: 'Fiches de cours',      sub: 'Résumés par matière'           },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <Animated.View style={[s.header, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={s.headerLeft}>
            <Text style={s.hello}>Bonjour{userName ? `, ${userName}` : ''} 👋</Text>
            <Text style={s.helloSub}>
              {streak > 0 ? `🔥 ${streak} jour${streak > 1 ? 's' : ''} de suite` : 'Prêt à réviser ?'}
            </Text>
          </View>
          <TouchableOpacity style={s.xpChip} onPress={() => navigation.navigate('Niveaux')}>
            <Text style={s.xpChipXP}>⚡ {xpInfo?.xp ?? 0} XP</Text>
            {xpInfo && <Text style={s.xpChipLevel}>{xpInfo.level.emoji} {xpInfo.level.name}</Text>}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Hero — Quiz du jour ── */}
        <Animated.View style={[s.heroCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={s.heroTop}>
            <View>
              <Text style={s.heroLabel}>QUIZ DU JOUR</Text>
              <Text style={s.heroTitle}>
                {timeDone ? 'Objectif atteint ! 🎉' : `${dailyCount} question${dailyCount > 1 ? 's' : ''} aujourd'hui`}
              </Text>
            </View>
            {timeDone && <Text style={s.heroBadge}>✓</Text>}
          </View>
          <View style={s.heroBarTrack}>
            <View style={[s.heroBarFill, { width: `${timePct}%`, backgroundColor: timeDone ? COLORS.success : '#F0F4FF' }]} />
          </View>
          <Text style={s.heroBarLabel}>{Math.floor(dailyTime / 60)} / {dailyGoal} min</Text>
          <TouchableOpacity style={s.heroBtn} onPress={() => navigation.navigate('ChoixMode')} activeOpacity={0.85}>
            <Text style={s.heroBtnText}>🚀  Commencer l'entraînement</Text>
          </TouchableOpacity>
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

        {/* ── Mes outils ── */}
        <Animated.View style={{ opacity: fade }}>
          <Text style={s.sectionTitle}>MES OUTILS</Text>
          <View style={s.grid}>
            {OUTILS.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={s.gridCard}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.8}
              >
                <Text style={s.gridIcon}>{item.icon}</Text>
                <Text style={s.gridLabel}>{item.label}</Text>
                <Text style={s.gridSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ── Bientôt ── */}
        <Animated.View style={{ opacity: fade }}>
          <View style={s.sectionTitleRow}>
            <Text style={s.sectionTitle}>À VENIR</Text>
            <View style={s.bientotBadge}><Text style={s.bientotBadgeText}>Bientôt</Text></View>
          </View>
          <View style={s.grid}>
            {BIENTOT.map((item, i) => (
              <View key={i} style={[s.gridCard, s.gridCardDisabled]}>
                <Text style={[s.gridIcon, s.disabledText]}>{item.icon}</Text>
                <Text style={[s.gridLabel, s.disabledText]}>{item.label}</Text>
                <Text style={[s.gridSub, s.disabledText]}>{item.sub}</Text>
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
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  headerLeft: { flex: 1 },
  hello:    { fontSize: 22, fontWeight: '900', color: COLORS.text },
  helloSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  xpChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 72,
  },
  xpChipXP:    { fontSize: 12, fontWeight: '900', color: COLORS.text },
  xpChipLevel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },

  // Hero card
  heroCard: {
    backgroundColor: COLORS.bleuFr,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  heroTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  heroLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(240,244,255,0.6)', letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { fontSize: 18, fontWeight: '900', color: '#F0F4FF' },
  heroBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.success, textAlign: 'center', lineHeight: 32, fontSize: 16, fontWeight: '900', color: '#fff', overflow: 'hidden' },
  heroBarTrack: { height: 8, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', marginBottom: 6 },
  heroBarFill:  { height: '100%', borderRadius: RADIUS.pill },
  heroBarLabel: { fontSize: 12, color: 'rgba(240,244,255,0.6)', marginBottom: SPACING.md },
  heroBtn: {
    backgroundColor: '#F0F4FF',
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  heroBtnText: { fontSize: 15, fontWeight: '900', color: COLORS.bleuFr },

  // Section title
  sectionTitle:    { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.2, marginBottom: SPACING.sm, marginTop: SPACING.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  bientotBadge:    { backgroundColor: COLORS.warning, borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 2, marginTop: SPACING.md, marginBottom: SPACING.sm },
  bientotBadgeText:{ fontSize: 10, fontWeight: '800', color: '#000' },

  // Card générique
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Série semaine
  weekRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  weekCol:    { alignItems: 'center', gap: 6 },
  weekLetter: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  weekCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  weekCircleDone:     { backgroundColor: COLORS.success },
  weekCircleToday:    { borderWidth: 2, borderColor: '#F0F4FF', backgroundColor: 'transparent' },
  weekCircleText:     { fontSize: 16, color: COLORS.textSecondary, fontWeight: '700' },
  weekCircleTextDone: { color: '#fff' },

  // Grille outils
  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  gridCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridCardDisabled: { opacity: 0.45 },
  gridIcon:  { fontSize: 28, marginBottom: 8 },
  gridLabel: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  gridSub:   { fontSize: 12, color: COLORS.textSecondary },
  disabledText: { color: COLORS.textDisabled },
});

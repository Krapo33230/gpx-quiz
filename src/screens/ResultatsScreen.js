import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { StatCard } from '../components/ui';
import {
  getScores, getStats, clearAll,
  saveScore, updateStreak, updateProgressionMatiere, getStreak,
  addDailyCount, addXP, calcXP, getXP, getLevelInfo, saveDailyScore, getWeeklyScores,
} from '../utils/storage';

const DAILY_LIMIT = 30;

const MODE_LABELS = {
  flash:    { label: '⚡ Éclair',          color: '#F5C518' },
  complet:  { label: '📋 Complet',         color: '#1A3F7A' },
  droit:    { label: '⚖️ Droit',           color: '#1A3F7A' },
  culture:  { label: '🌍 Culture G.',      color: '#2B7A5B' },
  logique:  { label: '🧠 Logique',         color: '#7A2B6A' },
  securite: { label: '🚔 Sécurité',        color: '#7A4B1A' },
  francais: { label: '📝 Français',        color: '#1A6A7A' },
};

export default function ResultatsScreen({ navigation, route }) {
  const sessionParams = route?.params ?? null; // { score, total, details, mode, categorie }
  const sessionSaved  = useRef(false);

  const [scores, setScores] = useState([]);
  const [stats,  setStats]  = useState({
    sessions: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
  });
  const [streak,       setStreak]      = useState(0);
  const [bestStreak,   setBestStreak]  = useState(0);
  const [xpInfo,       setXpInfo]      = useState(null);
  const [weeklyScores, setWeeklyScores] = useState([]);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    useCallback(() => {
      // Sauvegarde la session une seule fois à l'arrivée
      if (sessionParams?.score !== undefined && !sessionSaved.current) {
        sessionSaved.current = true;
        _persistSession(sessionParams);
      } else {
        loadData();
      }
    }, []),
  );

  async function _persistSession({ score, total, details, mode }) {
    const modeId   = typeof mode === 'object' ? (mode?.id ?? 'libre') : (mode ?? 'libre');
    const pct      = total > 0 ? Math.round((score / total) * 100) : 0;
    const xpGained = calcXP(score, total);

    // Niveau avant la session
    const xpBefore    = await getXP();
    const levelBefore = getLevelInfo(xpBefore).level;

    const [dailyTotal] = await Promise.all([
      addDailyCount(total),
      saveScore({ score, total, mode: modeId }),
      updateStreak(),
      details?.length ? updateProgressionMatiere(details) : Promise.resolve(),
      addXP(xpGained),
      saveDailyScore(pct),
    ]);

    const xpAfter    = await getXP();
    const levelAfter = getLevelInfo(xpAfter).level;

    loadData();

    if (levelAfter.name !== levelBefore.name) {
      setTimeout(() => navigation.navigate('LevelUp', {
        newLevel: levelAfter,
        xpGained,
        totalXP: xpAfter,
      }), 500);
    } else if (dailyTotal > DAILY_LIMIT) {
      setTimeout(() => navigation.navigate('Paywall'), 600);
    }
  }

  async function loadData() {
    const [s, sc, sk, xp, weekly] = await Promise.all([
      getStats(), getScores(), getStreak(), getXP(), getWeeklyScores(),
    ]);
    setStats(s);
    setScores(sc);
    setStreak(sk.currentStreak);
    setBestStreak(sk.bestStreak ?? sk.currentStreak);
    setXpInfo(getLevelInfo(xp));
    setWeeklyScores(weekly);

    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }

  function handleReset() {
    Alert.alert(
      'Réinitialiser ?',
      'Toutes vos statistiques et scores seront supprimés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            setScores([]);
            setStats({ sessions: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0 });
          },
        },
      ],
    );
  }

  const tauxReussite =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  const hasData = stats.sessions > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Mes statistiques</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {!hasData ? (
          <EmptyState onStart={() => navigation.navigate('ChoixMode')} />
        ) : (
          <>
            {/* ── Stats globales ── */}
            <Animated.View
              style={[
                styles.statsSection,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
              <View style={styles.statsRow}>
                <StatCard icon="🎯" value={`${tauxReussite}%`} label="Taux de réussite" />
                <StatCard icon="📚" value={stats.sessions}     label="Sessions" />
              </View>
              <View style={[styles.statsRow, { marginTop: SPACING.sm }]}>
                <StatCard icon="✅" value={stats.totalCorrect}   label="Bonnes réponses" />
                <StatCard icon="⭐" value={stats.bestScore}      label="Meilleur score" />
              </View>
            </Animated.View>

            {/* ── Streak + Best streak ── */}
            {xpInfo && (
              <Animated.View
                style={[
                  styles.streakRow,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <View style={styles.streakBox}>
                  <Text style={styles.streakNum}>{streak}</Text>
                  <Text style={styles.streakLbl}>jours de suite</Text>
                </View>
                <View style={[styles.streakBox, styles.streakBoxAlt]}>
                  <Text style={styles.streakNumAlt}>{bestStreak}</Text>
                  <Text style={styles.streakLblAlt}>meilleur record</Text>
                </View>
              </Animated.View>
            )}

            {/* ── XP & Niveau ── */}
            {xpInfo && (
              <Animated.View
                style={[
                  styles.xpCard,
                  SHADOWS.card,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <TouchableOpacity onPress={() => navigation.navigate('Niveaux')} style={styles.xpSeeAll}>
                  <Text style={styles.xpSeeAllText}>Voir tous les grades →</Text>
                </TouchableOpacity>
                <View style={styles.xpHeader}>
                  <Text style={styles.xpEmoji}>{xpInfo.level.emoji}</Text>
                  <View style={styles.xpInfoCol}>
                    <Text style={[styles.xpLevelName, { color: xpInfo.level.color }]}>
                      {xpInfo.level.name}
                    </Text>
                    <Text style={styles.xpTotal}>{xpInfo.xp} XP</Text>
                  </View>
                  {xpInfo.next && (
                    <Text style={styles.xpNext}>→ {xpInfo.next.name} à {xpInfo.next.min} XP</Text>
                  )}
                </View>
                {xpInfo.next && (
                  <View style={styles.xpTrack}>
                    <XPBar pct={xpInfo.pct} color={xpInfo.level.color} />
                    <Text style={styles.xpPct}>{xpInfo.pct}%</Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* ── Graphe hebdomadaire ── */}
            {weeklyScores.length > 0 && (
              <Animated.View
                style={[
                  styles.weekCard,
                  SHADOWS.card,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <Text style={styles.weekTitle}>Ta progression (7 jours)</Text>
                <WeeklyChart data={weeklyScores} />
              </Animated.View>
            )}

            {/* ── Jauge de progression ── */}
            <Animated.View
              style={[
                styles.gaugeCard,
                SHADOWS.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={styles.gaugeTitle}>Progression globale</Text>
              <View style={styles.gaugeTrack}>
                <GaugeBar value={tauxReussite} />
              </View>
              <View style={styles.gaugeLabels}>
                <Text style={styles.gaugeLabel}>0%</Text>
                <Text style={[styles.gaugePct, { color: getGaugeColor(tauxReussite) }]}>
                  {tauxReussite}%
                </Text>
                <Text style={styles.gaugeLabel}>100%</Text>
              </View>
              <Text style={styles.concoursTip}>
                {tauxReussite >= 75
                  ? '🏆 Niveau concours atteint !'
                  : tauxReussite >= 50
                  ? '📈 En bonne progression, continuez !'
                  : '📚 Entraînez-vous régulièrement.'}
              </Text>
            </Animated.View>

            {/* ── Historique ── */}
            {scores.length > 0 && (
              <Animated.View
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
              >
                <Text style={styles.sectionTitle}>Historique des sessions</Text>
                {scores.slice(0, 15).map((s, i) => (
                  <HistoryRow key={i} session={s} index={i} />
                ))}
              </Animated.View>
            )}

            {/* ── Reset ── */}
            <Animated.View
              style={[styles.resetWrap, { opacity: fadeAnim }]}
            >
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <Text style={styles.resetText}>🗑  Réinitialiser mes données</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── GaugeBar ─────────────────────────────────────────────────────────────────
function GaugeBar({ value }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const color = getGaugeColor(value);

  return (
    <View style={styles.gaugeBar}>
      {/* Jalons */}
      {[50, 75].map(mark => (
        <View
          key={mark}
          style={[styles.gaugeMark, { left: `${mark}%` }]}
        />
      ))}
      <Animated.View
        style={[
          styles.gaugeFill,
          {
            backgroundColor: color,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

// ─── XPBar ───────────────────────────────────────────────────────────────────
function XPBar({ pct, color }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct / 100, duration: 900, useNativeDriver: false }).start();
  }, [pct]);
  return (
    <View style={styles.xpBarTrack}>
      <Animated.View
        style={[
          styles.xpBarFill,
          { backgroundColor: color, width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
        ]}
      />
    </View>
  );
}

// ─── WeeklyChart ─────────────────────────────────────────────────────────────
function WeeklyChart({ data }) {
  const maxPct = Math.max(...data.map(d => d.pct ?? 0), 1);
  return (
    <View style={styles.weekChart}>
      {data.map((item, i) => {
        const height = item.pct !== null ? Math.max((item.pct / 100) * 100, 8) : 0;
        const color  = item.pct === null ? 'transparent'
          : item.pct >= 75 ? COLORS.success
          : item.pct >= 50 ? COLORS.warning
          : COLORS.danger;
        return (
          <View key={i} style={styles.weekCol}>
            {item.pct !== null && (
              <View style={[styles.weekTooltip, item.isToday && styles.weekTooltipActive]}>
                <Text style={[styles.weekTooltipText, item.isToday && { color: COLORS.primary }]}>
                  {item.pct}%
                </Text>
              </View>
            )}
            <View style={styles.weekBarWrap}>
              <View style={[styles.weekBar, { height, backgroundColor: color, opacity: item.isToday ? 1 : 0.6 }]} />
            </View>
            <Text style={[styles.weekDay, item.isToday && styles.weekDayActive]}>{item.day}</Text>
            <Text style={styles.weekDate}>{item.date}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── HistoryRow ───────────────────────────────────────────────────────────────
function HistoryRow({ session, index }) {
  const pct     = Math.round((session.score / session.total) * 100);
  // Garde : mode peut être un objet (ancienne donnée) ou une string
  const modeKey = typeof session.mode === 'object' ? (session.mode?.id ?? 'libre') : session.mode;
  const info    = MODE_LABELS[modeKey] ?? { label: modeKey ?? 'Quiz', color: COLORS.primary };
  const date  = new Date(session.date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.histRow, SHADOWS.card, { opacity: fade }]}>
      <View style={[styles.histMode, { backgroundColor: info.color + '18' }]}>
        <Text style={[styles.histModeText, { color: info.color }]}>{info.label}</Text>
      </View>
      <View style={styles.histCenter}>
        <Text style={styles.histDate}>{date}</Text>
        <View style={styles.histMiniBar}>
          <View style={[styles.histMiniFill, { width: `${pct}%`, backgroundColor: getGaugeColor(pct) }]} />
        </View>
      </View>
      <Text style={[styles.histPct, { color: getGaugeColor(pct) }]}>{pct}%</Text>
    </Animated.View>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ onStart }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={styles.emptyTitle}>Pas encore de données</Text>
      <Text style={styles.emptyDesc}>Commencez votre premier quiz pour voir vos statistiques ici !</Text>
      <TouchableOpacity onPress={onStart} style={styles.emptyBtn}>
        <Text style={styles.emptyBtnText}>Commencer maintenant</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGaugeColor(pct) {
  if (pct >= 75) return COLORS.success;
  if (pct >= 50) return COLORS.warning;
  return COLORS.danger;
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn:   { marginBottom: SPACING.sm },
  backText:  { ...FONTS.body, color: COLORS.primary, fontWeight: '600' },
  titre:     { ...FONTS.h1, color: COLORS.text },

  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },

  sectionTitle: { ...FONTS.h2, color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.md },

  statsSection: { marginBottom: SPACING.md },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },

  gaugeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  gaugeTitle: { ...FONTS.h3, color: COLORS.text, marginBottom: SPACING.md },
  gaugeTrack: { marginBottom: SPACING.sm },
  gaugeBar: {
    height: 18,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeFill: { height: '100%', borderRadius: RADIUS.pill },
  gaugeMark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 1,
  },
  gaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gaugeLabel:  { ...FONTS.xs, color: COLORS.textDisabled },
  gaugePct:    { ...FONTS.h3, fontWeight: '900' },
  concoursTip: { ...FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },

  // Streak row
  streakRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  streakBox: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  streakBoxAlt: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  streakNum: { ...FONTS.h1, color: COLORS.white },
  streakNumAlt: { ...FONTS.h1, color: COLORS.primary },
  streakLbl: { ...FONTS.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  streakLblAlt: { ...FONTS.xs, color: COLORS.textSecondary, marginTop: 2 },

  // XP card
  xpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  xpHeader:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  xpEmoji:     { fontSize: 36 },
  xpInfoCol:   { flex: 1 },
  xpLevelName: { ...FONTS.h3, fontWeight: '800' },
  xpTotal:     { ...FONTS.sm, color: COLORS.textSecondary },
  xpNext:      { ...FONTS.xs, color: COLORS.textDisabled, textAlign: 'right', flex: 1 },
  xpTrack:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  xpBarTrack:  { flex: 1, height: 10, borderRadius: RADIUS.pill, backgroundColor: COLORS.border, overflow: 'hidden' },
  xpBarFill:   { height: '100%', borderRadius: RADIUS.pill },
  xpPct:       { ...FONTS.xs, color: COLORS.textSecondary, width: 36, textAlign: 'right' },
  xpSeeAll:    { alignSelf: 'flex-end', marginBottom: SPACING.sm },
  xpSeeAllText: { ...FONTS.xs, color: COLORS.primary, fontWeight: '700' },

  // Weekly chart
  weekCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  weekTitle: { ...FONTS.h3, color: COLORS.text, marginBottom: SPACING.md },
  weekChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  weekCol:   { flex: 1, alignItems: 'center' },
  weekBarWrap: { height: 100, justifyContent: 'flex-end', width: '70%' },
  weekBar:   { width: '100%', borderRadius: RADIUS.sm },
  weekDay:   { ...FONTS.xs, color: COLORS.textSecondary, marginTop: 4 },
  weekDayActive: { color: COLORS.primary, fontWeight: '800' },
  weekDate:  { ...FONTS.xs, color: COLORS.textDisabled },
  weekTooltip: { backgroundColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 4, paddingVertical: 2, marginBottom: 2 },
  weekTooltipActive: { backgroundColor: COLORS.primary + '20' },
  weekTooltipText: { ...FONTS.xs, color: COLORS.textSecondary },

  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  histMode: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  histModeText: { ...FONTS.xs, fontWeight: '700' },
  histCenter:   { flex: 1 },
  histDate:     { ...FONTS.xs, color: COLORS.textSecondary, marginBottom: 4 },
  histMiniBar:  { height: 6, borderRadius: 3, backgroundColor: COLORS.border, overflow: 'hidden' },
  histMiniFill: { height: '100%', borderRadius: 3 },
  histPct:      { ...FONTS.body, fontWeight: '800', width: 44, textAlign: 'right' },

  resetWrap: { marginTop: SPACING.lg },
  resetBtn: {
    borderRadius: RADIUS.pill,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.danger + '80',
  },
  resetText: { ...FONTS.sm, color: COLORS.danger, fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: { ...FONTS.h2, color: COLORS.text, marginBottom: SPACING.sm },
  emptyDesc:  { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.xl },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    ...SHADOWS.button,
  },
  emptyBtnText: { ...FONTS.h3, color: COLORS.white },
});

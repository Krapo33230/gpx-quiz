import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
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
  addDailyCount, addDailyTime, addXP, calcXP, getXP, getLevelInfo, saveDailyScore, getWeeklyScores, getObjectif,
} from '../utils/storage';
import { checkPremiumEntitlement } from '../utils/purchases';

// Limite dynamique : minutes × 2 questions/min (défaut 10 min = 20 questions)
const DEFAULT_DAILY_LIMIT = 20;

const MODE_LABELS = {
  flash:    { label: '⚡ Éclair',          color: '#F5C518' },
  complet:  { label: '📋 Complet',         color: '#4A85E8' },
  droit:    { label: '⚖️ Droit',           color: '#4A85E8' },
  culture:  { label: '🌍 Culture G.',      color: '#3DBE8E' },
  logique:  { label: '🧠 Logique',         color: '#C46FBB' },
  securite: { label: '🚔 Sécurité',        color: '#E08C45' },
  francais: { label: '📝 Français',        color: '#45B8C8' },
  monde:    { label: '🌐 Monde',           color: '#45B870' },
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
    bestTotal: 0,
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

    const sessionSeconds = (details ?? []).reduce((sum, d) => sum + (d.timeSpent ?? 0), 0);

    // Niveau avant la session
    const xpBefore    = await getXP();
    const levelBefore = getLevelInfo(xpBefore).level;

    const [, isPremium, , , , , , userMinutes, dailySeconds] = await Promise.all([
      addDailyCount(total),
      checkPremiumEntitlement(),
      saveScore({ score, total, mode: modeId }),
      updateStreak(),
      details?.length ? updateProgressionMatiere(details) : Promise.resolve(),
      addXP(xpGained),
      saveDailyScore(pct),
      getObjectif(),
      addDailyTime(sessionSeconds),
    ]);

    const dailyLimit = (userMinutes ?? 10) * 60; // minutes → secondes

    const xpAfter    = await getXP();
    const levelAfter = getLevelInfo(xpAfter).level;

    loadData();

    if (levelAfter.name !== levelBefore.name) {
      setTimeout(() => navigation.navigate('LevelUp', {
        newLevel: levelAfter,
        xpGained,
        totalXP: xpAfter,
      }), 500);
    } else if (!isPremium && dailySeconds > dailyLimit) {
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
            loadData();
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
          <EmptyState onStart={() => navigation.navigate('Main', { screen: 'ChoixMode' })} />
        ) : (
          <>
            {/* ── Taux de réussite hero ── */}
            <Animated.View
              style={[styles.heroCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <Text style={styles.heroLabel}>TAUX DE RÉUSSITE GÉNÉRAL</Text>
              <Text style={[styles.heroValue, { color: getGaugeColor(tauxReussite) }]}>
                {tauxReussite} %
              </Text>
              <View style={styles.heroBar}>
                <View style={[styles.heroBarFill, { width: `${tauxReussite}%`, backgroundColor: getGaugeColor(tauxReussite) }]} />
              </View>
              <View style={styles.heroMiniStats}>
                <View style={styles.heroMiniItem}>
                  <Text style={styles.heroMiniVal}>{stats.sessions}</Text>
                  <Text style={styles.heroMiniLbl}>sessions</Text>
                </View>
                <View style={styles.heroMiniSep} />
                <View style={styles.heroMiniItem}>
                  <Text style={styles.heroMiniVal}>{stats.totalCorrect}</Text>
                  <Text style={styles.heroMiniLbl}>bonnes réponses</Text>
                </View>
                <View style={styles.heroMiniSep} />
                <View style={styles.heroMiniItem}>
                  <Text style={styles.heroMiniVal}>
                    {stats.bestTotal > 0 ? `${Math.round((stats.bestScore / stats.bestTotal) * 100)}%` : '—'}
                  </Text>
                  <Text style={styles.heroMiniLbl}>meilleur score</Text>
                </View>
              </View>
            </Animated.View>

            {/* ── Tu peux le faire ── */}
            <Animated.View
              style={[styles.motivCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.motivContent}>
                <Text style={styles.motivTitle}>{getMotivPhrase(tauxReussite)}</Text>
                <Text style={styles.motivSub}>Lance une nouvelle session maintenant →</Text>
              </View>
              <TouchableOpacity
                style={styles.motivBtn}
                onPress={() => navigation.navigate('Main', { screen: 'ChoixMode' })}
                activeOpacity={0.85}
              >
                <Text style={styles.motivBtnText}>→</Text>
              </TouchableOpacity>
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
                <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Niveaux' })} style={styles.xpSeeAll}>
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
                </View>
                {xpInfo.next && (
                  <View style={styles.xpNextRow}>
                    <Text style={styles.xpNext}>→ {xpInfo.next.name} à {xpInfo.next.min} XP</Text>
                    <Text style={styles.xpPct}>{xpInfo.pct}%</Text>
                  </View>
                )}
                {xpInfo.next && (
                  <XPBar pct={xpInfo.pct} color={xpInfo.level.color} />
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

            {/* ── Historique ── */}
            {scores.length > 0 && (
              <Animated.View
                style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
              >
                <Text style={styles.sectionTitle}>Dernières sessions</Text>
                {scores.slice(0, 5).map((s, i) => (
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

const MOTIV_PHRASES = [
  'Chaque question te rapproche du concours 🎯',
  'Les champions s\'entraînent même quand ils n\'en ont pas envie 💪',
  'La régularité fait la différence. Continue ! 🔥',
  'Tu progresses à chaque session. Ne lâche rien ! 🚀',
  'Le concours récompense ceux qui persévèrent 🏆',
  'Une session de plus, une chance de plus de réussir ⚡',
  'Chaque erreur est une leçon. Tu t\'améliores ! 📈',
];
function getMotivPhrase() {
  return MOTIV_PHRASES[Math.floor(Math.random() * MOTIV_PHRASES.length)];
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

  // Hero taux de réussite
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  heroLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.2, marginBottom: SPACING.xs,
  },
  heroValue: {
    fontSize: 56, fontWeight: '900', letterSpacing: -2, marginBottom: SPACING.sm,
  },
  heroBar: {
    height: 8, borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden', marginBottom: SPACING.lg,
  },
  heroBarFill: { height: '100%', borderRadius: RADIUS.pill },
  heroMiniStats: { flexDirection: 'row', alignItems: 'center' },
  heroMiniItem:  { flex: 1, alignItems: 'center' },
  heroMiniVal:   { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  heroMiniLbl:   { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '600' },
  heroMiniSep:   { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Carte motivationnelle
  motivCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  motivContent: { flex: 1 },
  motivTitle:   { ...FONTS.h3, color: COLORS.text, marginBottom: 4 },
  motivSub:     { ...FONTS.sm, color: COLORS.textSecondary, lineHeight: 18 },
  motivBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: SPACING.md,
    ...SHADOWS.button,
  },
  motivBtnText: { fontSize: 20, color: '#FFFFFF', fontWeight: '700' },

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
  xpHeader:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  xpEmoji:     { fontSize: 36 },
  xpInfoCol:   { flex: 1 },
  xpLevelName: { ...FONTS.h3, fontWeight: '800' },
  xpTotal:     { ...FONTS.sm, color: COLORS.textSecondary },
  xpNextRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  xpNext:      { ...FONTS.xs, color: COLORS.textDisabled },
  xpBarTrack:  { flex: 1, height: 10, borderRadius: RADIUS.pill, backgroundColor: COLORS.border, overflow: 'hidden' },
  xpBarFill:   { height: '100%', borderRadius: RADIUS.pill },
  xpPct:       { ...FONTS.xs, color: COLORS.textSecondary, fontWeight: '700' },
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

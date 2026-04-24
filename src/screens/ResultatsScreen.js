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
  addDailyCount,
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
  const [streak, setStreak] = useState(0);

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
    const [dailyTotal] = await Promise.all([
      addDailyCount(total),
      saveScore({ score, total, mode: mode ?? 'libre' }),
      updateStreak(),
      details?.length ? updateProgressionMatiere(details) : Promise.resolve(),
    ]);
    loadData();
    if (dailyTotal > DAILY_LIMIT) {
      // Léger délai pour laisser l'écran s'afficher avant la modale
      setTimeout(() => navigation.navigate('Paywall'), 600);
    }
  }

  async function loadData() {
    const [s, sc, sk] = await Promise.all([getStats(), getScores(), getStreak()]);
    setStats(s);
    setScores(sc);
    setStreak(sk.currentStreak);

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

// ─── HistoryRow ───────────────────────────────────────────────────────────────
function HistoryRow({ session, index }) {
  const pct   = Math.round((session.score / session.total) * 100);
  const info  = MODE_LABELS[session.mode] ?? { label: session.mode, color: COLORS.primary };
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

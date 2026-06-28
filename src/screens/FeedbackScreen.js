import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { TricolorMark } from '../components/ui';
import { CATEGORIES } from '../data/questions';
import { saveScore, calcXP } from '../utils/storage';

export default function FeedbackScreen({ navigation, route }) {
  const { score, total, details, mode } = route.params;
  const pourcentage = Math.round((score / total) * 100);
  const xpGained   = calcXP(score, total);
  const maxCombo   = computeMaxCombo(details);
  const totalTime  = computeTotalTime(details);

  // Sauvegarde dès l'arrivée sur cet écran
  useEffect(() => {
    saveScore({ mode: typeof mode === 'string' ? mode : mode.id, score, total });
  }, []);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const { message, color } = getMotivation(pourcentage);

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Score banner (toujours visible) ── */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <LinearGradient colors={['#1A4AFF', '#002395']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.scoreBanner}>
          <Text style={styles.sessionTag}>SESSION TERMINÉE !</Text>
          <TricolorMark size="lg" style={{ marginBottom: 12, marginTop: 4 }} />
          <Text style={styles.scorePct}>{pourcentage}%</Text>
          <Text style={styles.scoreRatio}>{score} / {total} bonnes réponses</Text>
          <Text style={[styles.scoreMessage, { color }]}>{message}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.badgeXP]}>
              <Text style={styles.badgeIcon}>⚡</Text>
              <Text style={styles.badgeValue}>{xpGained}</Text>
              <Text style={styles.badgeLabel}>XP</Text>
            </View>
            <View style={[styles.badge, styles.badgeCombo]}>
              <Text style={styles.badgeIcon}>🔥</Text>
              <Text style={styles.badgeValue}>x{maxCombo}</Text>
              <Text style={styles.badgeLabel}>COMBO</Text>
            </View>
            <View style={[styles.badge, styles.badgeTime]}>
              <Text style={styles.badgeIcon}>⏱</Text>
              <Text style={styles.badgeValue}>{totalTime}</Text>
              <Text style={styles.badgeLabel}>TEMPS</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* ── Revue des questions (scrollable) ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Revue des questions</Text>
          {details.map((d, i) => (
            <QuestionReview key={d.question.id} detail={d} index={i} />
          ))}
        </Animated.View>
        <View style={{ height: SPACING.lg }} />
      </ScrollView>

      {/* ── Boutons fixes en bas (toujours visibles) ── */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={() => navigation.replace('Quiz', { mode })} activeOpacity={0.85} style={{ flex: 1 }}>
          <LinearGradient colors={['#1A4AFF', '#002395']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.retryBtn}>
            <Text style={styles.retryText}>🔄  Rejouer</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'ChoixMode' } }] })}
          style={styles.newModeBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.newModeText}>🎯  Autre mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          style={styles.homeBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.homeText}>🏠  Accueil</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}

// ─── QuestionReview ───────────────────────────────────────────────────────────
function QuestionReview({ detail, index }) {
  const { question, chosen, correct, timeSpent } = detail;
  const cat = CATEGORIES[question.categorie];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.reviewCard,
        correct ? styles.reviewCorrect : styles.reviewWrong,
        SHADOWS.card,
        { opacity: fadeAnim },
      ]}
    >
      {/* En-tête */}
      <View style={styles.reviewHeader}>
        <Text style={[styles.reviewIcon, { color: correct ? COLORS.success : COLORS.danger }]}>
          {correct ? '✓' : '✗'}
        </Text>
        <Text style={[styles.reviewCat, { color: cat.color }]}>
          {cat.emoji} {cat.label}
        </Text>
        <Text style={styles.reviewTime}>{chosen === -1 ? '⏱ —' : `⏱ ${timeSpent}s`}</Text>
      </View>

      {/* Énoncé */}
      <Text style={styles.reviewEnonce}>{question.enonce}</Text>

      {/* Réponses */}
      {question.options.map((opt, i) => {
        const isCorrect  = i === question.correctIndex;
        const isChosen   = i === chosen;
        let   rowStyle   = styles.reviewOptDefault;
        let   textStyle  = styles.reviewOptTextDefault;

        if (isCorrect)              { rowStyle = styles.reviewOptCorrect; textStyle = styles.reviewOptTextCorrect; }
        if (isChosen && !isCorrect) { rowStyle = styles.reviewOptWrong;   textStyle = styles.reviewOptTextWrong; }

        return (
          <View key={i} style={[styles.reviewOpt, rowStyle]}>
            <Text style={[styles.reviewOptText, textStyle]}>
              {isCorrect ? '✓ ' : isChosen ? '✗ ' : `${String.fromCharCode(65 + i)}. `}
              {opt}
            </Text>
          </View>
        );
      })}

      {/* Explication */}
      <View style={styles.explicationWrap}>
        <Text style={styles.explicationLabel}>💡 Explication</Text>
        <Text style={styles.explicationText}>{question.explication}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function computeMaxCombo(details) {
  let max = 0, current = 0;
  for (const d of details) {
    if (d.correct) { current++; max = Math.max(max, current); }
    else { current = 0; }
  }
  return max;
}

function computeTotalTime(details) {
  const secs = details.reduce((sum, d) => sum + (d.timeSpent || 0), 0);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}

function getMotivation(pct) {
  if (pct >= 90) return { message: 'Excellent ! Tu es prêt(e) !',          color: COLORS.success };
  if (pct >= 75) return { message: 'Très bien ! Continue comme ça !',       color: COLORS.success };
  if (pct >= 60) return { message: 'Bien ! Encore un peu d\'entraînement.', color: COLORS.warning };
  if (pct >= 40) return { message: 'Courage ! Révise les points faibles.',  color: COLORS.warning };
  return           { message: 'Ne lâche pas ! La pratique paie.',            color: COLORS.danger };
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },

  scoreBanner: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  sessionTag: {
    ...FONTS.xs,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  mascot: { fontSize: 72, marginBottom: SPACING.sm },
  scorePct: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -2,
  },
  scoreRatio: { ...FONTS.body, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  scoreMessage: { ...FONTS.h3, marginTop: SPACING.md, textAlign: 'center', color: COLORS.white },

  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    width: '100%',
  },
  badge: {
    flex: 1,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    gap: 2,
  },
  badgeXP:    { backgroundColor: '#2A2200', borderWidth: 2, borderColor: '#F5C518' },
  badgeCombo: { backgroundColor: '#2A1800', borderWidth: 2, borderColor: '#FF6B35' },
  badgeTime:  { backgroundColor: '#1A3828', borderWidth: 2, borderColor: '#2B9E5B' },
  badgeIcon:  { fontSize: 22 },
  badgeValue: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  badgeLabel: { ...FONTS.xs, color: COLORS.textSecondary, fontWeight: '700', letterSpacing: 0.5 },

  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  reviewCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
  },
  reviewCorrect: { backgroundColor: '#1A3828', borderColor: COLORS.success },
  reviewWrong:   { backgroundColor: '#3A1820', borderColor: COLORS.danger },

  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  reviewIcon:   { fontSize: 18, fontWeight: '900', marginRight: SPACING.sm },
  reviewCat:    { ...FONTS.xs, fontWeight: '700', flex: 1 },
  reviewTime:   { ...FONTS.xs, color: COLORS.textDisabled },

  reviewEnonce: { ...FONTS.body, color: COLORS.text, marginBottom: SPACING.sm, fontWeight: '600' },

  reviewOpt:     { borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 },
  reviewOptDefault:  { backgroundColor: 'transparent' },
  reviewOptCorrect:  { backgroundColor: '#1A3828' },
  reviewOptWrong:    { backgroundColor: '#3A1820' },

  reviewOptText:        { ...FONTS.sm },
  reviewOptTextDefault: { color: COLORS.textDisabled },
  reviewOptTextCorrect: { color: COLORS.success, fontWeight: '700' },
  reviewOptTextWrong:   { color: COLORS.danger,  fontWeight: '700' },

  explicationWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  explicationLabel: { ...FONTS.xs, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  explicationText:  { ...FONTS.sm, color: COLORS.text, lineHeight: 20 },

  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  retryBtn: {
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  newModeBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  homeBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  retryText:   { ...FONTS.sm, fontWeight: '800', color: COLORS.white },
  newModeText: { ...FONTS.sm, fontWeight: '700', color: COLORS.text },
  homeText:    { ...FONTS.sm, fontWeight: '700', color: COLORS.text },
});

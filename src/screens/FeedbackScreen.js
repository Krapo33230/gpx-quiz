import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { CATEGORIES } from '../data/questions';
import { saveScore } from '../utils/storage';

export default function FeedbackScreen({ navigation, route }) {
  const { score, total, details, mode } = route.params;
  const pourcentage = Math.round((score / total) * 100);

  // Sauvegarde dès l'arrivée sur cet écran
  useEffect(() => {
    saveScore({ mode: mode.id, score, total });
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

  const { emoji, message, color } = getMotivation(pourcentage);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Résumé du score ── */}
        <Animated.View
          style={[
            styles.scoreBanner,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.scoreEmoji}>{emoji}</Text>
          <Text style={styles.scorePct}>{pourcentage}%</Text>
          <Text style={styles.scoreRatio}>{score} / {total} bonnes réponses</Text>
          <Text style={[styles.scoreMessage, { color }]}>{message}</Text>
        </Animated.View>

        {/* ── Détails par question ── */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <Text style={styles.sectionTitle}>Revue des questions</Text>

          {details.map((d, i) => (
            <QuestionReview key={d.question.id} detail={d} index={i} />
          ))}
        </Animated.View>

        {/* ── Boutons d'action ── */}
        <Animated.View
          style={[
            styles.actions,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.replace('Quiz', { mode })}
            style={styles.retryBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>🔄  Rejouer ce mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChoixMode')}
            style={styles.newModeBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.newModeText}>🎯  Changer de mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Resultats')}
            style={styles.statsBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.statsText}>📊  Voir mes statistiques</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Accueil')}
            style={styles.homeBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.homeText}>🏠  Retour à l'accueil</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
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
        <Text style={styles.reviewTime}>⏱ {timeSpent}s</Text>
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
function getMotivation(pct) {
  if (pct >= 90) return { emoji: '🏆', message: 'Excellent ! Vous êtes prêt(e) !',       color: COLORS.success };
  if (pct >= 75) return { emoji: '⭐', message: 'Très bien ! Continuez comme ça !',       color: COLORS.success };
  if (pct >= 60) return { emoji: '👍', message: 'Bien ! Encore un peu d\'entraînement.', color: COLORS.warning };
  if (pct >= 40) return { emoji: '📚', message: 'Courage ! Révisez les points faibles.', color: COLORS.warning };
  return           { emoji: '💪', message: 'Ne lâchez pas ! La pratique paie.',           color: COLORS.danger };
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },

  scoreBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  scoreEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  scorePct: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -2,
  },
  scoreRatio: { ...FONTS.body, color: COLORS.textSecondary, marginTop: 4 },
  scoreMessage: { ...FONTS.h3, marginTop: SPACING.md, textAlign: 'center' },

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
  reviewCorrect: { backgroundColor: '#F0FBF4', borderColor: COLORS.success },
  reviewWrong:   { backgroundColor: '#FDF2F2', borderColor: COLORS.danger },

  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  reviewIcon:   { fontSize: 18, fontWeight: '900', marginRight: SPACING.sm },
  reviewCat:    { ...FONTS.xs, fontWeight: '700', flex: 1 },
  reviewTime:   { ...FONTS.xs, color: COLORS.textDisabled },

  reviewEnonce: { ...FONTS.body, color: COLORS.text, marginBottom: SPACING.sm, fontWeight: '600' },

  reviewOpt:     { borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 4 },
  reviewOptDefault:  { backgroundColor: 'transparent' },
  reviewOptCorrect:  { backgroundColor: '#D6F5E3' },
  reviewOptWrong:    { backgroundColor: '#FAD7D7' },

  reviewOptText:        { ...FONTS.sm },
  reviewOptTextDefault: { color: COLORS.textDisabled },
  reviewOptTextCorrect: { color: COLORS.success, fontWeight: '700' },
  reviewOptTextWrong:   { color: COLORS.danger,  fontWeight: '700' },

  explicationWrap: {
    backgroundColor: 'rgba(26,63,122,0.06)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  explicationLabel: { ...FONTS.xs, color: COLORS.primary, fontWeight: '700', marginBottom: 4 },
  explicationText:  { ...FONTS.sm, color: COLORS.text, lineHeight: 20 },

  actions: { gap: SPACING.sm, marginTop: SPACING.lg },
  retryBtn:   {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  newModeBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.pill,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statsBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  homeBtn: {
    borderRadius: RADIUS.pill,
    padding: SPACING.md,
    alignItems: 'center',
  },
  retryText:   { ...FONTS.h3, color: COLORS.white },
  newModeText: { ...FONTS.h3, color: COLORS.white },
  statsText:   { ...FONTS.h3, color: COLORS.text },
  homeText:    { ...FONTS.body, color: COLORS.textSecondary },
});

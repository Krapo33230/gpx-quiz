import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { ProgressBar, CategoryBadge } from '../components/ui';
import { CATEGORIES, getRandomQuestions } from '../data/questions';
import { recordAnswer } from '../utils/storage';

const MODE_COUNT = { flash: 5, complet: 20 };
const TIMER_SECONDS = 30;

export default function QuizScreen({ navigation, route }) {
  // ChoixModeScreen passe un objet mode complet {id, categorie?, ...}
  const rawMode   = route.params?.mode ?? {};
  const modeId    = typeof rawMode === 'string' ? rawMode : (rawMode.id ?? 'libre');
  const categorie = route.params?.categorie ?? rawMode.categorie ?? null;

  // ─── State ────────────────────────────────────────────────────────────────────
  const [questions] = useState(() =>
    getRandomQuestions(MODE_COUNT[modeId] ?? 10, categorie),
  );
  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);
  const [details,  setDetails]  = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const timerRef   = useRef(null);
  const timeLeftRef = useRef(TIMER_SECONDS); // ref pour lecture sync dans callback

  const question = questions[index] ?? null;
  const cat      = question ? CATEGORIES[question.categorie] : null;

  // ─── Animations ───────────────────────────────────────────────────────────────
  const cardAnim    = useRef(new Animated.Value(1)).current;
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const bounceAnim  = useRef(new Animated.Value(1)).current;
  const explainAnim = useRef(new Animated.Value(0)).current;

  // ─── handleAnswer (défini avant le useEffect timer qui en dépend) ─────────────
  const handleAnswer = useCallback(
    (answerIndex) => {
      if (answered || !question) return;
      clearInterval(timerRef.current);

      const isCorrect = answerIndex === question.correctIndex;
      setSelected(answerIndex);
      setAnswered(true);
      if (isCorrect) setScore(s => s + 1);

      recordAnswer(question.id, isCorrect);
      setDetails(prev => [
        ...prev,
        {
          question,
          chosen:    answerIndex,
          correct:   isCorrect,
          timeSpent: TIMER_SECONDS - timeLeftRef.current,
        },
      ]);

      // Feedback animation
      if (isCorrect) {
        Animated.sequence([
          Animated.spring(bounceAnim, { toValue: 1.04, useNativeDriver: true }),
          Animated.spring(bounceAnim, { toValue: 1,    useNativeDriver: true }),
        ]).start();
      } else {
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 8,  duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -8, duration: 55, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 5,  duration: 45, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0,  duration: 45, useNativeDriver: true }),
        ]).start();
      }

      // Slide-in explication
      Animated.spring(explainAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }).start();
    },
    [answered, question, bounceAnim, shakeAnim, explainAnim],
  );

  // ─── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (answered) return;
    timeLeftRef.current = TIMER_SECONDS;
    setTimeLeft(TIMER_SECONDS);
    explainAnim.setValue(0);

    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current);
        handleAnswer(-1);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: handleAnswer est stable (useCallback sans deps changeantes) —
  // l'omettre ici évite une double-initialisation du timer au montage.

  // ─── Navigation suivante ──────────────────────────────────────────────────────
  function handleNext() {
    const isLast = index >= questions.length - 1;
    if (isLast) {
      navigation.replace('Resultats', {
        score,
        total: questions.length,
        details,
        mode: modeId,
        categorie,
      });
      return;
    }

    Animated.timing(cardAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
      shakeAnim.setValue(0);
      bounceAnim.setValue(1);
      explainAnim.setValue(0);
      Animated.spring(cardAnim, { toValue: 1, friction: 7, useNativeDriver: true }).start();
    });
  }

  // ─── Abandon ──────────────────────────────────────────────────────────────────
  function handleQuit() {
    Alert.alert(
      'Quitter le quiz ?',
      'Ta progression sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  }

  // ─── Helpers visuels ──────────────────────────────────────────────────────────
  const timerColor =
    timeLeft > 15 ? COLORS.success :
    timeLeft > 8  ? COLORS.warning :
    COLORS.danger;

  const isTimeout = answered && selected === -1;

  if (!question) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Top bar : quitter + progression + timer ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitBtn} hitSlop={8}>
          <Text style={styles.quitText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressWrap}>
          <ProgressBar current={index + (answered ? 1 : 0)} total={questions.length} />
          <Text style={styles.progressText}>
            {index + 1} / {questions.length}
          </Text>
        </View>

        <View style={[styles.timerBadge, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Carte énoncé ── */}
        <Animated.View
          style={[
            styles.card,
            SHADOWS.card,
            {
              opacity: cardAnim,
              transform: [
                { scale: bounceAnim },
                { translateX: shakeAnim },
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.cardTop}>
            <CategoryBadge label={cat.label} emoji={cat.emoji} color={cat.color} />
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>⭐ {score}</Text>
            </View>
          </View>

          <Text style={styles.enonce}>{question.enonce}</Text>
        </Animated.View>

        {/* ── Boutons réponses ── */}
        <View style={styles.options}>
          {question.options.map((opt, i) => (
            <OptionButton
              key={i}
              index={i}
              label={opt}
              answered={answered}
              selected={selected}
              correctIndex={question.correctIndex}
              onPress={() => handleAnswer(i)}
            />
          ))}
        </View>

        {/* ── Panneau explication ── */}
        {answered && (
          <Animated.View
            style={[
              styles.explainPanel,
              answered && selected === question.correctIndex
                ? styles.explainCorrect
                : styles.explainWrong,
              {
                opacity: explainAnim,
                transform: [
                  {
                    translateY: explainAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.explainTitle}>
              {isTimeout
                ? '⏱ Temps écoulé !'
                : selected === question.correctIndex
                ? '✓ Bonne réponse !'
                : '✗ Mauvaise réponse'}
            </Text>
            {isTimeout && (
              <Text style={styles.explainCorrectAnswer}>
                Réponse : {question.options[question.correctIndex]}
              </Text>
            )}
            <Text style={styles.explainBody}>{question.explication}</Text>
          </Animated.View>
        )}

        {/* ── Bouton Suivant ── */}
        {answered && (
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.nextBtn,
              selected === question.correctIndex
                ? styles.nextBtnCorrect
                : styles.nextBtnWrong,
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>
              {index >= questions.length - 1 ? 'Voir les résultats 🎯' : 'Continuer →'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── OptionButton ─────────────────────────────────────────────────────────────
function OptionButton({ index, label, answered, selected, correctIndex, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () =>
    !answered && Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    !answered && Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const letter = String.fromCharCode(65 + index); // A, B, C, D

  let containerStyle = styles.optDefault;
  let letterStyle    = styles.letterDefault;
  let textStyle      = styles.optTextDefault;
  let indicator      = null;

  if (answered) {
    if (index === correctIndex) {
      containerStyle = styles.optCorrect;
      letterStyle    = styles.letterCorrect;
      textStyle      = styles.optTextCorrect;
      indicator      = <Text style={styles.indicatorCorrect}>✓</Text>;
    } else if (index === selected) {
      containerStyle = styles.optWrong;
      letterStyle    = styles.letterWrong;
      textStyle      = styles.optTextWrong;
      indicator      = <Text style={styles.indicatorWrong}>✗</Text>;
    } else {
      containerStyle = styles.optDimmed;
      letterStyle    = styles.letterDimmed;
      textStyle      = styles.optTextDimmed;
    }
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={answered}
        activeOpacity={0.8}
        style={[styles.optBase, containerStyle]}
      >
        <View style={[styles.letterBadge, letterStyle]}>
          <Text style={[styles.letterText, answered && index === correctIndex && { color: COLORS.white }]}>
            {letter}
          </Text>
        </View>
        <Text style={[styles.optTextBase, textStyle]} numberOfLines={3}>
          {label}
        </Text>
        {indicator}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  quitBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  quitText: { ...FONTS.sm, color: COLORS.textSecondary, fontWeight: '700' },
  progressWrap: { flex: 1, gap: 4 },
  progressText: { ...FONTS.xs, color: COLORS.textSecondary, textAlign: 'right' },
  timerBadge: {
    width: 52, height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  timerText: { ...FONTS.sm, fontWeight: '800' },

  // Scroll
  scroll: { padding: SPACING.lg },

  // Carte énoncé
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scorePill: {
    backgroundColor: COLORS.accent + '22',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  scoreText: { ...FONTS.sm, color: COLORS.primary, fontWeight: '700' },
  enonce: { ...FONTS.h3, color: COLORS.text, lineHeight: 28 },

  // Options
  options: { gap: SPACING.sm, marginBottom: SPACING.lg },

  optBase: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  optDefault: { backgroundColor: COLORS.white,   borderColor: COLORS.border },
  optCorrect: { backgroundColor: '#E8FAF0',       borderColor: COLORS.success },
  optWrong:   { backgroundColor: '#FDEAEA',       borderColor: COLORS.danger },
  optDimmed:  { backgroundColor: COLORS.surface,  borderColor: COLORS.border, opacity: 0.5 },

  letterBadge: {
    width: 32, height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  letterDefault: { borderColor: COLORS.border,   backgroundColor: COLORS.surface },
  letterCorrect: { borderColor: COLORS.success,  backgroundColor: COLORS.success },
  letterWrong:   { borderColor: COLORS.danger,   backgroundColor: 'transparent' },
  letterDimmed:  { borderColor: COLORS.border,   backgroundColor: 'transparent' },

  letterText: { ...FONTS.xs, fontWeight: '800', color: COLORS.textSecondary },

  optTextBase:    { ...FONTS.body, flex: 1 },
  optTextDefault: { color: COLORS.text },
  optTextCorrect: { color: COLORS.success, fontWeight: '700' },
  optTextWrong:   { color: COLORS.danger,  fontWeight: '700' },
  optTextDimmed:  { color: COLORS.textDisabled },

  indicatorCorrect: { fontSize: 18, color: COLORS.success, fontWeight: '700' },
  indicatorWrong:   { fontSize: 18, color: COLORS.danger,  fontWeight: '700' },

  // Panneau explication
  explainPanel: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    marginBottom: SPACING.md,
  },
  explainCorrect: {
    backgroundColor: '#E8FAF0',
    borderLeftColor: COLORS.success,
  },
  explainWrong: {
    backgroundColor: '#FDEAEA',
    borderLeftColor: COLORS.danger,
  },
  explainTitle: {
    ...FONTS.sm,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  explainCorrectAnswer: {
    ...FONTS.sm,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  explainBody: {
    ...FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Bouton suivant
  nextBtn: {
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  nextBtnCorrect: { backgroundColor: COLORS.success },
  nextBtnWrong:   { backgroundColor: COLORS.primary },
  nextText: { ...FONTS.h3, color: COLORS.white },
});

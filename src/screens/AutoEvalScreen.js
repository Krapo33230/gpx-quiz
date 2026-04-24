import React, { useState, useRef, useEffect } from 'react';
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
import { QUESTIONS, CATEGORIES } from '../data/questions';

const CATS = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS'];
const NB_PAR_CAT = 2;

const CAT_TO_MODE = {
  DROIT:    { id: 'droit',    emoji: '⚖️',  titre: 'Droit & Institutions',  description: 'Spécialisé Droit, Constitution, Procédure', duree: '~8 min', couleur: '#1A3F7A', bg: '#EEF2FA', categorie: 'DROIT' },
  CULTURE:  { id: 'culture',  emoji: '🌍',  titre: 'Culture Générale',       description: 'Histoire, géographie, société française',   duree: '~8 min', couleur: '#2B7A5B', bg: '#EBF8F2', categorie: 'CULTURE' },
  LOGIQUE:  { id: 'logique',  emoji: '🧠',  titre: 'Logique & Raisonnement', description: 'Séries, syllogismes, calculs',               duree: '~8 min', couleur: '#7A2B6A', bg: '#F8EBF7', categorie: 'LOGIQUE' },
  SECURITE: { id: 'securite', emoji: '🚔',  titre: 'Sécurité & Police',      description: 'Organisation police, procédures',            duree: '~8 min', couleur: '#7A4B1A', bg: '#FBF2E9', categorie: 'SECURITE' },
  FRANÇAIS: { id: 'francais', emoji: '📝',  titre: 'Français & Expression',  description: 'Orthographe, vocabulaire, grammaire',        duree: '~8 min', couleur: '#1A6A7A', bg: '#EBF6F8', categorie: 'FRANÇAIS' },
};

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function buildQuestions() {
  return CATS.flatMap(cat =>
    pickRandom(QUESTIONS.filter(q => q.categorie === cat), NB_PAR_CAT),
  );
}

export default function AutoEvalScreen({ navigation }) {
  const [questions]   = useState(buildQuestions);
  const [index,        setIndex]        = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [answers,      setAnswers]       = useState([]);
  const [phase,        setPhase]         = useState('quiz'); // 'quiz' | 'results'

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: index / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  function handleAnswer(optIndex) {
    if (selected !== null) return;
    setSelected(optIndex);
    const q = questions[index];
    const isCorrect = optIndex === q.correctIndex;
    const newAnswers = [...answers, { categorie: q.categorie, correct: isCorrect }];

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(i => i + 1);
        setSelected(null);
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
        ]).start();
      } else {
        setAnswers(newAnswers);
        setPhase('results');
      }
    }, 900);

    setAnswers(newAnswers);
  }

  if (phase === 'results') {
    return <ResultsPhase answers={answers} navigation={navigation} />;
  }

  const q = questions[index];
  const total = questions.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Auto-évaluation</Text>
        <Text style={styles.counter}>{index + 1} / {total}</Text>
      </View>

      {/* ── Barre de progression ── */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Catégorie ── */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.catBadge}>
            <Text style={styles.catText}>
              {CATEGORIES[q.categorie]?.emoji} {CATEGORIES[q.categorie]?.label}
            </Text>
          </View>

          {/* ── Question ── */}
          <View style={[styles.questionCard, SHADOWS.card]}>
            <Text style={styles.questionText}>{q.enonce}</Text>
          </View>

          {/* ── Options ── */}
          <View style={styles.options}>
            {q.options.map((opt, i) => {
              let bg    = COLORS.surface;
              let color = COLORS.text;
              let border = COLORS.border;

              if (selected !== null) {
                if (i === q.correctIndex) {
                  bg = '#E8F8EF'; color = COLORS.success; border = COLORS.success;
                } else if (i === selected && i !== q.correctIndex) {
                  bg = '#FEE8E8'; color = COLORS.danger;  border = COLORS.danger;
                }
              }

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(i)}
                  activeOpacity={0.8}
                  style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                >
                  <View style={[styles.optLetter, { borderColor: border }]}>
                    <Text style={[styles.optLetterText, { color }]}>
                      {['A', 'B', 'C', 'D'][i]}
                    </Text>
                  </View>
                  <Text style={[styles.optText, { color }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ResultsPhase ─────────────────────────────────────────────────────────────
function ResultsPhase({ answers, navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const scores = CATS.reduce((acc, cat) => {
    const catAnswers = answers.filter(a => a.categorie === cat);
    acc[cat] = {
      correct: catAnswers.filter(a => a.correct).length,
      total: NB_PAR_CAT,
    };
    return acc;
  }, {});

  const weakest = CATS.reduce((min, cat) =>
    scores[cat].correct < scores[min].correct ? cat : min,
  );

  const globalPct = Math.round(
    (answers.filter(a => a.correct).length / answers.length) * 100,
  );

  function getMessage() {
    if (globalPct >= 80) return { emoji: '🏆', text: 'Excellent niveau ! Continue comme ça.' };
    if (globalPct >= 60) return { emoji: '📈', text: 'Bon début, quelques matières à consolider.' };
    return { emoji: '💪', text: 'Du travail en perspective — c\'est maintenant que ça commence !' };
  }

  const msg = getMessage();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Accueil')} style={styles.backBtn}>
          <Text style={styles.backText}>← Accueil</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── Titre ── */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsEmoji}>{msg.emoji}</Text>
            <Text style={styles.resultsTitre}>Ton diagnostic</Text>
            <Text style={styles.resultsGlobal}>{globalPct}% de bonnes réponses</Text>
            <Text style={styles.resultsMsg}>{msg.text}</Text>
          </View>

          {/* ── Scores par matière ── */}
          <Text style={styles.sectionTitle}>Résultats par matière</Text>
          {CATS.map(cat => {
            const { correct, total } = scores[cat];
            const pct = Math.round((correct / total) * 100);
            const isWeak = cat === weakest && correct < total;
            const cat_info = CATEGORIES[cat];
            const barColor = pct === 100 ? COLORS.success : pct >= 50 ? COLORS.warning : COLORS.danger;

            return (
              <View
                key={cat}
                style={[styles.catRow, SHADOWS.card, isWeak && styles.catRowWeak]}
              >
                <Text style={styles.catRowEmoji}>{cat_info.emoji}</Text>
                <View style={styles.catRowContent}>
                  <View style={styles.catRowHeader}>
                    <Text style={styles.catRowLabel}>{cat_info.label}</Text>
                    <Text style={[styles.catRowScore, { color: barColor }]}>
                      {correct}/{total}
                    </Text>
                  </View>
                  <View style={styles.miniTrack}>
                    <View style={[styles.miniFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                  </View>
                </View>
                {isWeak && <Text style={styles.weakTag}>À travailler</Text>}
              </View>
            );
          })}

          {/* ── Recommandation ── */}
          {scores[weakest].correct < NB_PAR_CAT && (
            <View style={[styles.recoCard, SHADOWS.card]}>
              <Text style={styles.recoTitle}>
                Priorité : {CATEGORIES[weakest].emoji} {CATEGORIES[weakest].label}
              </Text>
              <Text style={styles.recoDesc}>
                C'est ta matière la plus faible. On commence par là ?
              </Text>
              <TouchableOpacity
                style={styles.recoBtn}
                onPress={() => navigation.navigate('Quiz', { mode: CAT_TO_MODE[weakest] })}
              >
                <Text style={styles.recoBtnText}>
                  S'entraîner en {CATEGORIES[weakest].label}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Secondaire ── */}
          <TouchableOpacity
            style={styles.freeBtn}
            onPress={() => navigation.navigate('ChoixMode')}
          >
            <Text style={styles.freeBtnText}>Choisir une autre matière</Text>
          </TouchableOpacity>

          <View style={{ height: SPACING.xxl }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn:  { marginBottom: SPACING.sm },
  backText: { ...FONTS.body, color: COLORS.primary, fontWeight: '600' },
  titre:    { ...FONTS.h2, color: COLORS.text },
  counter:  { ...FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },

  progressTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
  },

  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catText: { ...FONTS.sm, color: COLORS.textSecondary, fontWeight: '600' },

  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  questionText: { ...FONTS.h3, color: COLORS.text, lineHeight: 26 },

  options: { gap: SPACING.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  optLetter: {
    width: 32, height: 32,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optLetterText: { ...FONTS.sm, fontWeight: '800' },
  optText: { ...FONTS.body, flex: 1 },

  // Results
  resultsHeader: { alignItems: 'center', paddingVertical: SPACING.xl },
  resultsEmoji:  { fontSize: 56, marginBottom: SPACING.sm },
  resultsTitre:  { ...FONTS.h1, color: COLORS.text, marginBottom: 4 },
  resultsGlobal: { ...FONTS.h2, color: COLORS.primary, marginBottom: SPACING.sm },
  resultsMsg:    { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.lg },

  sectionTitle: { ...FONTS.h3, color: COLORS.text, marginBottom: SPACING.md },

  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  catRowWeak: {
    borderWidth: 1.5,
    borderColor: COLORS.danger + '60',
    backgroundColor: '#FEF5F5',
  },
  catRowEmoji:   { fontSize: 22, width: 30 },
  catRowContent: { flex: 1 },
  catRowHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catRowLabel:   { ...FONTS.sm, color: COLORS.text, fontWeight: '600' },
  catRowScore:   { ...FONTS.sm, fontWeight: '800' },
  miniTrack: { height: 6, borderRadius: 3, backgroundColor: COLORS.border, overflow: 'hidden' },
  miniFill:  { height: '100%', borderRadius: 3 },
  weakTag: {
    ...FONTS.xs,
    color: COLORS.danger,
    fontWeight: '700',
    backgroundColor: '#FEE8E8',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },

  recoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  recoTitle: { ...FONTS.h3, color: COLORS.white, marginBottom: 4 },
  recoDesc:  { ...FONTS.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.md },
  recoBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  recoBtnText: { ...FONTS.body, color: COLORS.primary, fontWeight: '700' },

  freeBtn: {
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  freeBtnText: { ...FONTS.body, color: COLORS.textSecondary, fontWeight: '600' },
});

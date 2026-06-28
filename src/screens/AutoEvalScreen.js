import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { QUESTIONS, CATEGORIES } from '../data/questions';

const CATS = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS', 'MONDE', 'PSYCHO_NUM', 'PSYCHO_VERBAL', 'PSYCHO_ABSTRAIT', 'ANGLAIS', 'EXERCICES'];
const NB_PAR_CAT = 2;

const CAT_TO_MODE = {
  DROIT:           { id: 'droit',           emoji: '⚖️',  titre: 'Droit & Institutions',    description: 'Droit, Constitution, Procédure',         duree: '~8 min', couleur: '#1A3F7A', bg: '#EEF2FA', categorie: 'DROIT' },
  CULTURE:         { id: 'culture',         emoji: '🌍',  titre: 'Culture Générale',         description: 'Histoire, géographie, société française', duree: '~8 min', couleur: '#2B7A5B', bg: '#EBF8F2', categorie: 'CULTURE' },
  LOGIQUE:         { id: 'logique',         emoji: '🧠',  titre: 'Logique & Raisonnement',   description: 'Séries, syllogismes, calculs',             duree: '~8 min', couleur: '#7A2B6A', bg: '#F8EBF7', categorie: 'LOGIQUE' },
  SECURITE:        { id: 'securite',        emoji: '🚔',  titre: 'Sécurité & Police',        description: 'Organisation police, procédures',          duree: '~8 min', couleur: '#7A4B1A', bg: '#FBF2E9', categorie: 'SECURITE' },
  FRANÇAIS:        { id: 'francais',        emoji: '📝',  titre: 'Français & Expression',    description: 'Orthographe, vocabulaire, grammaire',      duree: '~8 min', couleur: '#1A6A7A', bg: '#EBF6F8', categorie: 'FRANÇAIS' },
  MONDE:           { id: 'monde',           emoji: '🌐',  titre: 'Monde & Citoyenneté',      description: 'Actualité, institutions, citoyenneté',     duree: '~8 min', couleur: '#1A6A3A', bg: '#EBF8F0', categorie: 'MONDE' },
  PSYCHO_NUM:      { id: 'psycho_num',      emoji: '🔢',  titre: 'Calcul & Numérique',       description: 'Calcul mental, suites numériques',         duree: '~8 min', couleur: '#4A1A7A', bg: '#F0EBF8', categorie: 'PSYCHO_NUM' },
  PSYCHO_VERBAL:   { id: 'psycho_verbal',   emoji: '💬',  titre: 'Raisonnement Verbal',      description: 'Analogies, synonymes, logique verbale',    duree: '~8 min', couleur: '#1A5A4A', bg: '#EBF6F4', categorie: 'PSYCHO_VERBAL' },
  PSYCHO_ABSTRAIT: { id: 'psycho_abstrait', emoji: '🔷',  titre: 'Raisonnement Abstrait',    description: 'Matrices, formes, séquences visuelles',    duree: '~8 min', couleur: '#7A3A1A', bg: '#FBF0E9', categorie: 'PSYCHO_ABSTRAIT' },
  ANGLAIS:         { id: 'anglais',         emoji: '🇬🇧', titre: 'Anglais',                  description: 'Compréhension, vocabulaire, grammaire',    duree: '~8 min', couleur: '#1A2A7A', bg: '#EEF0FA', categorie: 'ANGLAIS' },
  EXERCICES:       { id: 'exercices',       emoji: '✅',  titre: 'Exercices Pratiques',      description: 'Vrai/faux, mises en situation',            duree: '~8 min', couleur: '#3A5A1A', bg: '#EFF5EB', categorie: 'EXERCICES' },
};

const DIAG_LABELS = {
  DROIT:           { code: 'DR',  label: 'Connaissances Institutionnelles & Droit' },
  CULTURE:         { code: 'CG',  label: 'Culture Générale' },
  LOGIQUE:         { code: 'LG',  label: 'Raisonnement Logique' },
  SECURITE:        { code: 'SÉC', label: 'Déontologie & Missions de Sécurité' },
  FRANÇAIS:        { code: 'FR',  label: 'Expression Écrite & Rédaction' },
  MONDE:           { code: 'MDE', label: 'Monde & Citoyenneté' },
  PSYCHO_NUM:      { code: 'NUM', label: 'Aptitudes Numériques' },
  PSYCHO_VERBAL:   { code: 'VRB', label: 'Raisonnement Verbal' },
  PSYCHO_ABSTRAIT: { code: 'ABS', label: 'Raisonnement Abstrait' },
  ANGLAIS:         { code: 'ANG', label: 'Langue Anglaise' },
  EXERCICES:       { code: 'EX',  label: 'Exercices Pratiques' },
};

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function buildQuestions() {
  return CATS.flatMap(cat =>
    pickRandom(QUESTIONS.filter(q => q.categorie === cat), NB_PAR_CAT),
  );
}

export default function AutoEvalScreen({ navigation, route }) {
  const fromOnboarding = route?.params?.fromOnboarding ?? false;
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

    setAnswers(newAnswers);

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
        setPhase('results');
      }
    }, 900);
  }

  if (phase === 'results') {
    return <ResultsPhase answers={answers} navigation={navigation} fromOnboarding={fromOnboarding} />;
  }

  const q = questions[index];
  const total = questions.length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        {fromOnboarding ? (
          <View style={styles.onboardingHeaderRow}>
            <Text style={styles.titre}>Diagnostic initial</Text>
            <Text style={styles.counter}>{index + 1} / {total}</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
            <Text style={styles.titre}>Auto-évaluation</Text>
            <Text style={styles.counter}>{index + 1} / {total}</Text>
          </>
        )}
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
                  bg = '#1A3828'; color = COLORS.success; border = COLORS.success;
                } else if (i === selected && i !== q.correctIndex) {
                  bg = '#3A1820'; color = COLORS.danger;  border = COLORS.danger;
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
function ResultsPhase({ answers, navigation, fromOnboarding }) {
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

  function getLevel() {
    if (globalPct >= 80) return {
      label: 'APTITUDE : CONFIRMÉE',
      color: '#22C55E',
      msg: "Niveau de préparation élevé. Maintenez la cadence et affinez vos lacunes résiduelles.",
    };
    if (globalPct >= 60) return {
      label: 'APTITUDE : EN DÉVELOPPEMENT',
      color: '#F59E0B',
      msg: "Base solide identifiée. Des domaines ciblés requièrent un renforcement immédiat.",
    };
    return {
      label: 'APTITUDE : À CONSOLIDER',
      color: '#EF4444',
      msg: "Lacunes identifiées. L'entraînement commence maintenant pour élever votre état de préparation.",
    };
  }

  const level = getLevel();

  function getStatus(correct, total) {
    const pct = correct / total;
    if (pct === 1)  return { label: 'MAÎTRISÉ',    color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'  };
    if (pct >= 0.5) return { label: 'À RENFORCER', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' };
    return                 { label: 'NON VALIDÉ',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'  };
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={rs.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── Document header ── */}
          <View style={rs.docCard}>
            <View style={rs.docHeader}>
              <Text style={rs.docTitle}>RAPPORT D'ÉVALUATION INITIALE</Text>
              <Text style={rs.docRef}>Réf : DIAG-REC-2026 // Classification : Interne</Text>
            </View>
            <View style={rs.docDivider} />
            <View style={rs.scoreSection}>
              <View style={[rs.scoreRing, { borderColor: level.color }]}>
                <Text style={[rs.scorePct, { color: level.color }]}>{globalPct}%</Text>
              </View>
              <View style={rs.scoreRight}>
                <Text style={[rs.scoreLevel, { color: level.color }]}>{level.label}</Text>
                <Text style={rs.scoreMsg}>{level.msg}</Text>
              </View>
            </View>
          </View>

          {/* ── Domaines ── */}
          <Text style={rs.sectionLabel}>DOMAINES DE COMPÉTENCE ÉVALUÉS</Text>
          <View style={rs.domainesCard}>
            {CATS.map((cat, i) => {
              const { correct, total } = scores[cat];
              const status = getStatus(correct, total);
              const info = DIAG_LABELS[cat];
              return (
                <View key={cat} style={[rs.domRow, i < CATS.length - 1 && rs.domRowBorder]}>
                  <View style={rs.domCode}>
                    <Text style={rs.domCodeText}>{info.code}</Text>
                  </View>
                  <Text style={rs.domLabel} numberOfLines={2}>{info.label}</Text>
                  <View style={[rs.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
                    <Text style={[rs.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Priorité ── */}
          {scores[weakest].correct < NB_PAR_CAT && (
            <View style={rs.priorityCard}>
              <Text style={rs.priorityLabel}>PRIORITÉ D'ENTRAÎNEMENT</Text>
              <Text style={rs.priorityTitle}>{DIAG_LABELS[weakest].label}</Text>
              <Text style={rs.priorityDesc}>
                Domaine critique identifié. Focus recommandé pour optimiser votre niveau de préparation.
              </Text>
            </View>
          )}

          {/* ── CTA ── */}
          <TouchableOpacity
            onPress={() => fromOnboarding
              ? navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
              : navigation.navigate('Main', { screen: 'Accueil' })
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#1A4AFF', '#002395']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={rs.cta}
            >
              <Text style={rs.ctaText}>REJOINDRE LA FORMATION →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
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
    backgroundColor: '#2A1414',
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
    backgroundColor: '#3A1820',
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

  onboardingHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  recoInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recoInfoTitle: { ...FONTS.h3, color: COLORS.text, marginBottom: 4 },
  recoInfoDesc:  { ...FONTS.sm, color: COLORS.textSecondary },

  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  continueBtnText: { ...FONTS.h3, color: COLORS.white, letterSpacing: 0.3 },
});

const rs = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  docCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1A4AFF',
    overflow: 'hidden',
    marginBottom: 20,
  },
  docHeader: {
    backgroundColor: '#002395',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  docTitle: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
  docRef:   { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, letterSpacing: 0.5 },
  docDivider: { height: 1, backgroundColor: 'rgba(26,74,255,0.25)' },

  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  scoreRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 4,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scorePct:   { fontSize: 22, fontWeight: '900' },
  scoreRight: { flex: 1 },
  scoreLevel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.8, marginBottom: 6 },
  scoreMsg:   { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },

  sectionLabel: {
    fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5, marginBottom: 10,
  },

  domainesCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  domRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 12,
  },
  domRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  domCode: {
    width: 38, height: 38, borderRadius: 8,
    backgroundColor: 'rgba(26,74,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(26,74,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  domCodeText:  { fontSize: 9, fontWeight: '900', color: '#A0B8FF', letterSpacing: 0.5 },
  domLabel:     { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '600', lineHeight: 17 },
  statusBadge:  { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  statusText:   { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },

  priorityCard: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 16,
    marginBottom: 16,
  },
  priorityLabel: { fontSize: 10, fontWeight: '800', color: '#EF4444', letterSpacing: 1, marginBottom: 6 },
  priorityTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  priorityDesc:  { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 19 },

  cta: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.8 },
});

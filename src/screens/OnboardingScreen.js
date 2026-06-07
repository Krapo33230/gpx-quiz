import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/colors';
import { completeOnboarding, saveObjectif } from '../utils/storage';
import { TricolorMark } from '../components/ui';

const BG     = '#0A1628';
const ACCENT = '#FFFFFF';
const CARD   = '#1A2E4A';
const TOTAL_STEPS = 7;

// ─── Données des étapes ───────────────────────────────────────────────────────

const DATES_CONCOURS = [
  { id: '3m',  label: 'Dans moins de 3 mois',  tag: 'Urgent',  gradient: ['#6B0A0A', '#1A2E4A'] },
  { id: '6m',  label: 'Dans 3 à 6 mois',       tag: 'Bientôt', gradient: ['#5A006B', '#1A2E4A'] },
  { id: '12m', label: 'Dans 6 à 12 mois',      tag: 'Serein',  gradient: ['#0A3A6B', '#1A2E4A'] },
  { id: 'nsp', label: 'Je ne sais pas encore', tag: 'Indécis', gradient: ['#2A3A4A', '#1A2E4A'] },
];

const NIVEAUX = [
  { id: 'nul',   label: 'Je débute, je ne connais rien',          badge: 'DÉBUTANT',  badgeColor: '#3A4A5E' },
  { id: 'peu',   label: 'Quelques notions sur le concours',        badge: 'NOVICE',    badgeColor: '#3A4A6B' },
  { id: 'moyen', label: "J'ai déjà commencé à réviser",           badge: 'CONFIRMÉ',  badgeColor: '#1A5A6B' },
  { id: 'bon',   label: 'Je connais bien le programme',           badge: 'AVANCÉ',    badgeColor: '#1A5A3A' },
  { id: 'pret',  label: 'Je suis quasi prêt(e) pour le concours', badge: 'EXPERT',    badgeColor: '#003870' },
];

const OBJECTIFS = [
  { id: 5,  label: '5 questions/jour',  tag: 'Tranquille' },
  { id: 10, label: '10 questions/jour', tag: 'Normal'     },
  { id: 15, label: '15 questions/jour', tag: 'Intensif'   },
  { id: 20, label: '20 questions/jour', tag: 'Extrême'    },
];

// ─── Composants réutilisables ─────────────────────────────────────────────────

function MascotBubble({ message }) {
  return (
    <View style={styles.mascotRow}>
      <TricolorMark size="sm" />
      <View style={styles.bubbleSide}>
        <Text style={styles.bubbleSideText}>{message}</Text>
      </View>
    </View>
  );
}

function OptionRow({ label, tag, badge, badgeColor, gradient, selected, onPress }) {
  const inner = (
    <>
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      {tag && (
        <Text style={[styles.optionTag, selected && styles.optionTagSelected]}>{tag}</Text>
      )}
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.optionTouchable}>
        <LinearGradient
          colors={selected ? [gradient[0], '#1E3555'] : gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.optionRow, selected && styles.optionRowSelected]}
        >
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (badge) {
    return (
      <TouchableOpacity
        style={[styles.optionRowCol, selected && styles.optionRowSelected]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.levelBadge, { backgroundColor: badgeColor ?? '#2A3A4A' }]}>
          <Text style={styles.levelBadgeText}>{badge}</Text>
        </View>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.optionRow, selected && styles.optionRowSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {inner}
    </TouchableOpacity>
  );
}

function Cta({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.cta, disabled && styles.ctaDisabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.85}
    >
      <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation, route }) {
  const returning = route?.params?.returning ?? false;
  const [step,    setStep]    = useState(returning ? 6 : 0);
  const [name,          setName]         = useState('');
  const [dateConcours,  setDateConcours] = useState(null);
  const [niveau,        setNiveau]       = useState(null);
  const [objectif,      setObjectif]     = useState(null);

  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  function animStep(nextStep) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }

  // Step 4 = loading → auto-advance après 2.5s
  useEffect(() => {
    if (step !== 4) return;
    loadingAnim.setValue(0);
    Animated.timing(loadingAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
    const t = setTimeout(() => animStep(5), 2500);
    return () => clearTimeout(t);
  }, [step]);

  async function handleFinish() {
    await completeOnboarding(name.trim() || 'Candidat');
    if (objectif) await saveObjectif(objectif);
    navigation.replace('Main');
  }

  function handleNotif() {
    Alert.alert(
      'Autoriser les notifications',
      'ConcoursPolice souhaite t\'envoyer des rappels d\'entraînement.',
      [
        { text: 'Refuser',   style: 'cancel', onPress: () => animStep(6) },
        { text: 'Autoriser', onPress: () => animStep(6) },
      ],
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>

          {/* ── Header ── */}
          {step !== 4 && (
            <View style={styles.header}>
              {step > 0
                ? <TouchableOpacity onPress={() => animStep(step - 1)} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                  </TouchableOpacity>
                : <View style={styles.backBtn} />
              }
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          )}

          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

            {/* ────────── STEP 0 : Intro ────────── */}
            {step === 0 && (
              <View style={styles.centerFull}>
                <View style={styles.bubbleCenter}>
                  <Text style={styles.bubbleCenterText}>
                    Salut ! Réponds à quelques questions avant de commencer ta première session !
                  </Text>
                </View>
                <TricolorMark size="lg" style={{ marginBottom: 8 }} />
              </View>
            )}

            {/* ────────── STEP 1 : Date concours ────────── */}
            {step === 1 && (
              <View style={styles.stepWrap}>
                <MascotBubble message="Quand passes-tu le concours Gardien de la Paix ?" />
                <ScrollView style={styles.optionList} showsVerticalScrollIndicator={false}>
                  {DATES_CONCOURS.map(d => (
                    <OptionRow
                      key={d.id}
                      label={d.label}
                      tag={d.tag}
                      gradient={d.gradient}
                      selected={dateConcours === d.id}
                      onPress={() => setDateConcours(d.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ────────── STEP 2 : Niveau ────────── */}
            {step === 2 && (
              <View style={styles.stepWrap}>
                <MascotBubble message="Quel est ton niveau de préparation au concours ?" />
                <ScrollView style={styles.optionList} showsVerticalScrollIndicator={false}>
                  {NIVEAUX.map(n => (
                    <OptionRow
                      key={n.id}
                      label={n.label}
                      badge={n.badge}
                      badgeColor={n.badgeColor}
                      selected={niveau === n.id}
                      onPress={() => setNiveau(n.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ────────── STEP 3 : Objectif ────────── */}
            {step === 3 && (
              <View style={styles.stepWrap}>
                <MascotBubble message="Quel est ton objectif quotidien ?" />
                <ScrollView style={styles.optionList} showsVerticalScrollIndicator={false}>
                  {OBJECTIFS.map(o => (
                    <OptionRow
                      key={o.id}
                      label={o.label}
                      tag={o.tag}
                      selected={objectif === o.id}
                      onPress={() => setObjectif(o.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ────────── STEP 4 : Chargement ────────── */}
            {step === 4 && (
              <View style={styles.centerFull}>
                <TricolorMark size="lg" style={{ marginBottom: 8 }} />
                <Text style={styles.loadingLabel}>PRÉPARATION DE TON PROGRAMME...</Text>
                <View style={styles.loadingBarTrack}>
                  <Animated.View
                    style={[styles.loadingBarFill, {
                      width: loadingAnim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }),
                    }]}
                  />
                </View>
                <Text style={styles.loadingText}>
                  Rejoins les candidats qui{'\n'}se préparent avec <Text style={{ color: ACCENT, fontWeight: '900' }}>ConcoursPolice</Text> !
                </Text>
              </View>
            )}

            {/* ────────── STEP 5 : Prénom ────────── */}
            {step === 5 && (
              <View style={styles.centerFull}>
                <Text style={styles.inputTitle}>Comment tu t'appelles ?</Text>
                <Text style={styles.inputSubtitle}>On personnalisera ton expérience</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ton prénom"
                    placeholderTextColor="#9AAABB"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="done"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onSubmitEditing={() => name.trim() && animStep(6)}
                  />
                </View>
              </View>
            )}

            {/* ────────── STEP 6 : Résumé ────────── */}
            {step === 6 && (
              <View style={styles.stepWrap}>
                <MascotBubble message={`Regarde tout ce que tu peux accomplir en 3 mois${name ? `, ${name}` : ''} !`} />
                <View style={styles.featureList}>
                  {[
                    { icon: '⚖️', title: 'Droit & Procédure',        sub: '40 questions de droit pénal, pénitentiaire et institutions' },
                    { icon: '🌍', title: 'Culture générale',          sub: 'Actualité, histoire, géographie, citoyenneté' },
                    { icon: '🧠', title: 'Logique & Français',        sub: 'Raisonnement, expression écrite, vocabulaire' },
                  ].map(f => (
                    <View key={f.title} style={styles.featureRow}>
                      <View style={styles.featureIcon}><Text style={{ fontSize: 28 }}>{f.icon}</Text></View>
                      <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>{f.title}</Text>
                        <Text style={styles.featureSub}>{f.sub}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </Animated.View>

          {/* ── Boutons bas ── */}
          {step !== 4 && (
            <View style={styles.footer}>
              {step === 0 && <Cta label="CONTINUER" onPress={() => animStep(1)} />}
              {step === 1 && <Cta label="CONTINUER" onPress={() => animStep(2)} disabled={!dateConcours} />}
              {step === 2 && <Cta label="CONTINUER" onPress={() => animStep(3)} disabled={!niveau} />}
              {step === 3 && <Cta label="C'EST PARTI !" onPress={() => animStep(4)} disabled={!objectif} />}
              {step === 5 && (
                <>
                  <Cta label="CONTINUER" onPress={() => animStep(6)} disabled={!name.trim()} />
                  <TouchableOpacity onPress={handleNotif} style={styles.notifBtn}>
                    <Text style={styles.notifText}>🔔  Me rappeler de m'entraîner</Text>
                  </TouchableOpacity>
                </>
              )}
              {step === 6 && <Cta label="COMMENCER" onPress={handleFinish} />}
            </View>
          )}

        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  backBtn:  { width: 32, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  progressTrack: { flex: 1, height: 8, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: RADIUS.pill, backgroundColor: ACCENT },

  // Layouts
  centerFull: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  stepWrap:   { flex: 1, paddingHorizontal: SPACING.lg },

  // Mascot centré (step 0 & 4)
  bubbleCenter: {
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: SPACING.sm,
    maxWidth: '100%',
  },
  bubbleCenterText: { ...FONTS.body, color: '#fff', textAlign: 'center', lineHeight: 26 },
  mascotLarge: { fontSize: 96, marginTop: SPACING.sm },

  // Mascot côté (steps 1-3, 5-6)
  mascotRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.md, marginBottom: SPACING.lg, paddingTop: SPACING.sm },
  mascotSmall: { fontSize: 56 },
  bubbleSide: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bubbleSideText: { ...FONTS.body, color: '#fff', lineHeight: 24 },

  // Options
  optionList: { flex: 1 },
  optionTouchable: { marginBottom: SPACING.sm, borderRadius: RADIUS.md, overflow: 'hidden' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 16,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  optionRowCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: CARD,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    marginBottom: SPACING.sm,
    gap: 6,
  },
  optionRowSelected: { borderColor: ACCENT },
  optionLabel:         { ...FONTS.body, color: '#fff', fontWeight: '600', flex: 1 },
  optionLabelSelected: { color: ACCENT },
  optionTag:           { ...FONTS.sm, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  optionTagSelected:   { color: ACCENT },

  // Badge de niveau
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.8,
  },

  // Loading (step 4)
  loadingLabel:   { ...FONTS.xs, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, marginTop: SPACING.lg, marginBottom: SPACING.md },
  loadingBarTrack:{ width: '100%', height: 8, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: SPACING.lg },
  loadingBarFill: { height: '100%', borderRadius: RADIUS.pill, backgroundColor: ACCENT },
  loadingText:    { ...FONTS.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 28 },

  // Input prénom (step 5)
  inputTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputWrap: { width: '100%' },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: '#1A3F7A',
    color: '#0A1628',
    paddingHorizontal: SPACING.md,
    paddingVertical: 18,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Features résumé (step 6)
  featureList: { gap: SPACING.lg, paddingTop: SPACING.sm },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  featureIcon: {
    width: 56, height: 56, borderRadius: RADIUS.md,
    backgroundColor: CARD,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText:  { flex: 1 },
  featureTitle: { ...FONTS.h3, color: '#fff', marginBottom: 4 },
  featureSub:   { ...FONTS.sm, color: 'rgba(255,255,255,0.5)', lineHeight: 20 },

  // Footer
  footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.sm },
  cta: { backgroundColor: ACCENT, borderRadius: RADIUS.pill, paddingVertical: 18, alignItems: 'center' },
  ctaDisabled: { backgroundColor: '#2A3A52' },
  ctaText: { fontSize: 16, fontWeight: '900', color: '#0A1628', letterSpacing: 1 },
  ctaTextDisabled: { color: 'rgba(255,255,255,0.3)' },
  notifBtn: { borderRadius: RADIUS.pill, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
  notifText: { ...FONTS.sm, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
});

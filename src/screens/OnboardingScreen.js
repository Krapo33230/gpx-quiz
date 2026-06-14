import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/colors';
import { completeOnboarding, saveObjectif } from '../utils/storage';
import { TricolorMark } from '../components/ui';

const BG     = '#0A1628';
const ACCENT = '#FFFFFF';
const CARD   = '#1A2E4A';

// ─────────────────────────────────────────────────────────────────────────────
// FLOW : 0 Intro → 1 Date → 2 Réaction date → 3 Niveau → 4 Réaction niveau
//      → 5 Objectif → 6 Réaction objectif → 7 Loading
//      → 8 Profil (nom+âge+email) → 9 Notifs → 10 Résumé
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 11;

// ─── Données ──────────────────────────────────────────────────────────────────

const DATES_CONCOURS = [
  { id: '3m',  label: 'Dans moins de 3 mois',  tag: 'Urgent',  gradient: ['#6B0A0A', '#1A2E4A'] },
  { id: '6m',  label: 'Dans 3 à 6 mois',       tag: 'Bientôt', gradient: ['rgba(255,255,255,0.18)', '#1A2E4A'] },
  { id: '12m', label: 'Dans 6 à 12 mois',      tag: 'Serein',  gradient: ['#0A3A6B', '#1A2E4A'] },
  { id: 'nsp', label: 'Je ne sais pas encore', tag: 'Indécis', gradient: ['#2A3A4A', '#1A2E4A'] },
];

const DATE_REACTIONS = {
  '3m':  "Ok ! Ça va être serré, mais c'est faisable.",
  '6m':  "Super ! C'est le timing parfait.",
  '12m': "Parfait ! Tu as le temps de bien préparer.",
  'nsp': "D'accord ! L'essentiel, c'est de commencer.",
};

const NIVEAUX = [
  { id: 'nul',   label: 'Je débute, je ne connais rien',          badge: 'DÉBUTANT',  badgeColor: '#3A4A5E' },
  { id: 'peu',   label: 'Quelques notions sur le concours',        badge: 'NOVICE',    badgeColor: '#3A4A6B' },
  { id: 'moyen', label: "J'ai déjà commencé à réviser",           badge: 'CONFIRMÉ',  badgeColor: '#1A5A6B' },
  { id: 'bon',   label: 'Je connais bien le programme',           badge: 'AVANCÉ',    badgeColor: '#1A5A3A' },
  { id: 'pret',  label: 'Je suis quasi prêt(e) pour le concours', badge: 'EXPERT',    badgeColor: '#003870' },
];

const NIVEAU_REACTIONS = {
  'nul':   "Ok ! On part de zéro ensemble, pas de souci.",
  'peu':   "Bien ! Tu as déjà une base, c'est un bon départ.",
  'moyen': "Super ! Tu as de l'avance, on va en profiter.",
  'bon':   "Excellent ! On va peaufiner les derniers détails.",
  'pret':  "Waouh ! On vérifie tout pour être au top.",
};

const OBJECTIFS = [
  { id: 5,  label: '5 min/jour',  tag: 'Tranquille' },
  { id: 10, label: '10 min/jour', tag: 'Normal'     },
  { id: 15, label: '15 min/jour', tag: 'Intensif'   },
  { id: 20, label: '20 min/jour', tag: 'Extrême'    },
];

const OBJECTIF_REACTIONS = {
  5:  { message: "Bien ! Ça fait environ 10 questions à revoir par jour.",      highlight: "10 questions" },
  10: { message: "Super ! Ça représente environ 20 questions par jour.",        highlight: "20 questions" },
  15: { message: "Sérieux ! Ça fait environ 30 questions par jour.",            highlight: "30 questions" },
  20: { message: "Intense ! Ça représente environ 40 questions par jour.",      highlight: "40 questions" },
};

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
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }
  return (
    <TouchableOpacity
      style={[styles.cta, disabled && styles.ctaDisabled]}
      onPress={disabled ? undefined : handlePress}
      activeOpacity={disabled ? 1 : 0.85}
    >
      <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation, route }) {
  const returning = route?.params?.returning ?? false;
  const [step,         setStep]        = useState(returning ? 10 : 0);
  const [showCta,      setShowCta]     = useState(false);
  const [introIndex,   setIntroIndex]  = useState(0);
  const [name,         setName]        = useState('');
  const [age,          setAge]         = useState('');
  const [dateConcours, setDateConcours]= useState(null);
  const [niveau,       setNiveau]      = useState(null);
  const [objectif,     setObjectif]    = useState(null);

  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  function animStep(nextStep) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }

  // Réinitialise showCta à l'entrée des steps de réaction (2, 4, 6)
  useEffect(() => {
    if (step === 2 || step === 4 || step === 6) setShowCta(false);
  }, [step]);

  // Step 7 = loading → avance automatiquement après 2.5s
  useEffect(() => {
    if (step !== 7) return;
    loadingAnim.setValue(0);
    Animated.timing(loadingAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
    const t = setTimeout(() => animStep(8), 2500);
    return () => clearTimeout(t);
  }, [step]);

  async function handleFinish() {
    await completeOnboarding(name.trim() || 'Candidat', age.trim());
    if (objectif) await saveObjectif(objectif);
    navigation.replace('AutoEvalIntro', { fromOnboarding: true });
  }

  function handleNotifYes() {
    Alert.alert(
      'Autoriser les notifications',
      "ConcoursPolice souhaite t'envoyer des rappels d'entraînement.",
      [
        { text: 'Refuser',   style: 'cancel', onPress: () => animStep(10) },
        { text: 'Autoriser', onPress: () => animStep(10) },
      ],
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>

          {/* ── Header (masqué pendant le loading) ── */}
          {step !== 7 && (
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (step > 0) { animStep(step - 1); }
                  else if (introIndex > 0) { setShowCta(false); setIntroIndex(i => i - 1); }
                  else { navigation.goBack(); }
                }}
                style={styles.backBtn}
              >
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#F0F4FF' }]} />
                <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
              </View>
            </View>
          )}

          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

            {/* ── 0 · Intro ── */}
            {step === 0 && (
              <IntroChat msgIndex={introIndex} onDone={() => setShowCta(true)} />
            )}

            {/* ── 1 · Quand passe-t-il le concours ? ── */}
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

            {/* ── 2 · Réaction à la date ── */}
            {step === 2 && (
              <TypewriterChat
                message={DATE_REACTIONS[dateConcours] ?? ''}
                onDone={() => setShowCta(true)}
              />
            )}

            {/* ── 3 · Quel est son niveau ? ── */}
            {step === 3 && (
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

            {/* ── 4 · Réaction au niveau ── */}
            {step === 4 && (
              <TypewriterChat
                message={NIVEAU_REACTIONS[niveau] ?? ''}
                onDone={() => setShowCta(true)}
              />
            )}

            {/* ── 5 · Objectif temps / jour ── */}
            {step === 5 && (
              <View style={styles.stepWrap}>
                <MascotBubble message="Combien de temps veux-tu t'entraîner par jour ?" />
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

            {/* ── 6 · Réaction à l'objectif ── */}
            {step === 6 && (
              <TypewriterChat
                message={OBJECTIF_REACTIONS[objectif]?.message ?? ''}
                highlight={OBJECTIF_REACTIONS[objectif]?.highlight}
                onDone={() => setShowCta(true)}
              />
            )}

            {/* ── 7 · Chargement ── */}
            {step === 7 && (
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

            {/* ── 8 · Profil ── */}
            {step === 8 && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.profileScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.sectionBadgeRow}>
                  <Text style={styles.sectionBadge}>CRÉER TON PROFIL</Text>
                  <Text style={styles.sectionBadgeStep}>1 / 2</Text>
                </View>

                <Text style={styles.profileTitle}>Comment tu t'appelles ?</Text>

                <TextInput
                  style={styles.profileInput}
                  placeholder="Prénom"
                  placeholderTextColor="#4A6A8A"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />

                <TextInput
                  style={[styles.profileInput, { marginTop: SPACING.sm }]}
                  placeholder="Âge (facultatif)"
                  placeholderTextColor="#4A6A8A"
                  value={age}
                  onChangeText={t => setAge(t.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={2}
                />

                <View style={styles.orRow}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>ou</Text>
                  <View style={styles.orLine} />
                </View>

                <TouchableOpacity style={styles.emailBtn} activeOpacity={0.8}>
                  <Text style={styles.emailBtnText}>Se connecter avec un compte mail</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* ── 9 · Notifications ── */}
            {step === 9 && (
              <View style={styles.centerFull}>
                <View style={styles.sectionBadgeRow}>
                  <Text style={styles.sectionBadge}>CRÉER TON PROFIL</Text>
                  <Text style={styles.sectionBadgeStep}>2 / 2</Text>
                </View>
                <Text style={styles.notifTitle}>Rappels d'entraînement</Text>
                <Text style={styles.notifSub}>
                  On te rappelle de t'entraîner chaque jour pour maintenir ta série.
                </Text>
                <TouchableOpacity
                  style={styles.notifYesBtn}
                  onPress={handleNotifYes}
                  activeOpacity={0.85}
                >
                  <Text style={styles.notifYesBtnText}>Oui, active les rappels !</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notifNoBtn}
                  onPress={() => animStep(10)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.notifNoBtnText}>Non merci</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── 10 · Résumé / vente ── */}
            {step === 10 && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.sellScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.sellTitle}>
                  {name ? `${name}, tu es` : 'Tu es'} à la bonne place. 💪
                </Text>
                <Text style={styles.sellSub}>
                  ConcoursPolice prépare les candidats au concours Gardien de la Paix de A à Z.
                </Text>

                <View style={styles.statsChocRow}>
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>200+</Text>
                    <Text style={styles.statsChocLabel}>questions</Text>
                  </View>
                  <View style={styles.statsChocSep} />
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>6</Text>
                    <Text style={styles.statsChocLabel}>matières</Text>
                  </View>
                  <View style={styles.statsChocSep} />
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>100%</Text>
                    <Text style={styles.statsChocLabel}>gratuit</Text>
                  </View>
                </View>

                {[
                  { icon: '⚖️', title: 'Droit & Procédure',      sub: 'Droit pénal, institutions, procédure pénale' },
                  { icon: '🌍', title: 'Culture Générale',        sub: 'Histoire, géographie, actualités, citoyenneté' },
                  { icon: '🧠', title: 'Logique & Français',      sub: 'Raisonnement, expression écrite, vocabulaire' },
                  { icon: '🚔', title: 'Sécurité & Police',       sub: 'Organisation police, procédures, hiérarchie' },
                  { icon: '✅', title: 'Vrai / Faux & Exercices', sub: "Plusieurs types d'exercices comme au concours" },
                  { icon: '📊', title: 'Suivi de progression',    sub: 'Statistiques, streak, XP et grades' },
                ].map(f => (
                  <View key={f.title} style={styles.featureRow}>
                    <View style={styles.featureIcon}><Text style={{ fontSize: 24 }}>{f.icon}</Text></View>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{f.title}</Text>
                      <Text style={styles.featureSub}>{f.sub}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

          </Animated.View>

          {/* ── Boutons bas (masqués pendant le loading) ── */}
          {step !== 7 && (
            <View style={styles.footer}>
              {step === 0 && (
                <Cta
                  label="CONTINUER"
                  disabled={!showCta}
                  onPress={() => {
                    if (introIndex < INTRO_MESSAGES.length - 1) {
                      setShowCta(false);
                      setIntroIndex(i => i + 1);
                    } else {
                      animStep(1);
                    }
                  }}
                />
              )}
              {step === 1 && <Cta label="CONTINUER" onPress={() => animStep(2)} disabled={!dateConcours} />}
              {step === 2 && <Cta label="CONTINUER" onPress={() => animStep(3)} disabled={!showCta} />}
              {step === 3 && <Cta label="CONTINUER" onPress={() => animStep(4)} disabled={!niveau} />}
              {step === 4 && <Cta label="CONTINUER" onPress={() => animStep(5)} disabled={!showCta} />}
              {step === 5 && <Cta label="C'EST PARTI !" onPress={() => animStep(6)} disabled={!objectif} />}
              {step === 6 && <Cta label="CONTINUER" onPress={() => animStep(7)} disabled={!showCta} />}
              {step === 8 && <Cta label="CONTINUER" onPress={() => animStep(9)} disabled={!name.trim()} />}
              {step === 10 && <Cta label="COMMENCER →" onPress={handleFinish} />}
            </View>
          )}

        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Typewriter générique ─────────────────────────────────────────────────────

const INTRO_MESSAGES = [
  "Salut, bienvenue sur ConcoursPolice !",
  "Je vais t'aider à préparer le concours Gardien de la Paix.",
  "Pour adapter ta préparation,\nréponds à 4 questions.",
  "Ça prend moins de 2 minutes — promis !",
];

const BUBBLE_BG     = '#1A2E4A';
const BUBBLE_BORDER = 'rgba(255,255,255,0.08)';
const CONFETTI_COLORS = ['#F5C518', '#E84040', '#3DBE6E', '#4A85E8', '#F09E1A', '#FF6B35', '#FFFFFF'];
const LAST_INTRO_IDX  = 3;
const HIGHLIGHT_INTRO  = '2 minutes';
const HIGHLIGHT_INTRO2 = '4 questions';

// ─── Hook typewriter (caractère par caractère) ───────────────────────────────
function useTypewriter(text, speed, onDone) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let cancelled = false;

    function showChar(i) {
      if (cancelled) return;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        setTimeout(() => showChar(i + 1), speed);
      } else {
        setDone(true);
        onDone?.();
      }
    }

    setTimeout(() => showChar(1), speed);
    return () => { cancelled = true; };
  }, [text]);

  return { displayed, done };
}

// ─── Curseur clignotant ───────────────────────────────────────────────────────
function Cursor({ visible }) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  if (!visible) return null;
  return <Animated.Text style={{ opacity: anim, color: 'rgba(255,255,255,0.6)' }}>|</Animated.Text>;
}

// ─── Réaction style Duolingo : mascot gauche + bulle droite ──────────────────
function TypewriterChat({ message, onDone, speed = 32, highlight }) {
  const { displayed, done } = useTypewriter(message, speed, onDone);

  const hlStart = highlight ? message.indexOf(highlight) : -1;
  const hlEnd   = hlStart >= 0 ? hlStart + highlight.length : -1;

  function renderText() {
    const text = displayed || '';
    if (hlStart === -1 || text.length <= hlStart) {
      return (
        <Text style={chatStyles.sideBubbleText}>
          {text}<Cursor visible={!done} />
        </Text>
      );
    }
    const before      = text.slice(0, hlStart);
    const highlighted = text.slice(hlStart, Math.min(text.length, hlEnd));
    const after       = text.slice(hlEnd);
    return (
      <Text style={chatStyles.sideBubbleText}>
        {before}
        <Text style={{ color: '#4A85E8', fontWeight: '800' }}>{highlighted}</Text>
        {after}
        <Cursor visible={!done} />
      </Text>
    );
  }

  return (
    <View style={chatStyles.sideContainer}>
      <View style={chatStyles.sideRow}>
        <TricolorMark size="lg" />
        <View style={chatStyles.sideBubble}>
          {renderText()}
        </View>
      </View>
    </View>
  );
}

// ─── Confetti burst ───────────────────────────────────────────────────────────
const NB_CONFETTI = 40;
// shapes: 0 = rectangle fin, 1 = carré, 2 = losange (rotation 45°), 3 = bande longue
const SHAPES = [
  { w: 4,  h: 12, br: 1 },
  { w: 8,  h: 8,  br: 1 },
  { w: 6,  h: 6,  br: 0 },
  { w: 3,  h: 14, br: 0 },
];

function BubbleConfetti() {
  const anims = useRef(
    Array.from({ length: NB_CONFETTI }, () => ({
      x:  new Animated.Value(0),
      y:  new Animated.Value(0),
      op: new Animated.Value(1),
      r:  new Animated.Value(0),
    }))
  ).current;

  const pieces = useRef(
    Array.from({ length: NB_CONFETTI }, (_, i) => ({
      tx:    (Math.random() - 0.5) * 340,
      ty:    -(40 + Math.random() * 160),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: Math.random() * 300,
      dur:   600 + Math.random() * 500,
      spin:  Math.random() > 0.5 ? '720deg' : '-540deg',
    }))
  ).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      const { tx, ty, delay, dur } = pieces[i];
      Animated.parallel([
        Animated.timing(anim.x, { toValue: tx, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(anim.y, { toValue: ty, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(anim.r, { toValue: 1,  duration: dur, delay, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(delay + dur * 0.4),
          Animated.timing(anim.op, { toValue: 0, duration: dur * 0.6, useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, []);

  return (
    <View style={{ position: 'absolute', bottom: 10, left: '50%' }} pointerEvents="none">
      {anims.map((anim, i) => {
        const { shape, color, spin } = pieces[i];
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width:  shape.w,
              height: shape.h,
              borderRadius: shape.br,
              backgroundColor: color,
              opacity: anim.op,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                { rotate: anim.r.interpolate({ inputRange: [0, 1], outputRange: ['0deg', spin] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Intro step 0 : centré, bulle pleine largeur ──────────────────────────────
function IntroChat({ msgIndex, onDone }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const isLast = msgIndex === LAST_INTRO_IDX;

  useEffect(() => {
    if (isLast) setShowConfetti(true);
  }, [msgIndex]);

  const { displayed, done } = useTypewriter(INTRO_MESSAGES[msgIndex], 32, onDone);

  const hlWord  = isLast ? HIGHLIGHT_INTRO : (msgIndex === 2 ? HIGHLIGHT_INTRO2 : null);
  const hlColor = isLast ? '#4A85E8' : '#F5C518';
  const fullMsg = INTRO_MESSAGES[msgIndex];
  const hlStart = hlWord ? fullMsg.indexOf(hlWord) : -1;
  const hlEnd   = hlStart >= 0 ? hlStart + hlWord.length : -1;

  function renderText() {
    const text = displayed || '';
    if (hlStart === -1 || text.length <= hlStart) {
      return (
        <Text style={chatStyles.centerBubbleText}>
          {text}<Cursor visible={!done} />
        </Text>
      );
    }
    const before      = text.slice(0, hlStart);
    const highlighted = text.slice(hlStart, Math.min(text.length, hlEnd));
    const after       = text.slice(hlEnd);
    return (
      <Text style={chatStyles.centerBubbleText}>
        {before}
        <Text style={{ color: hlColor, fontWeight: '800' }}>{highlighted}</Text>
        {after}
        <Cursor visible={!done} />
      </Text>
    );
  }

  return (
    <View style={chatStyles.centerContainer}>
      <TricolorMark size="lg" style={{ marginBottom: SPACING.xl }} />
      <View style={{ position: 'relative', width: '100%' }}>
        {showConfetti && <BubbleConfetti />}
        <View style={chatStyles.centerBubble}>
          {renderText()}
        </View>
      </View>
    </View>
  );
}

const chatStyles = StyleSheet.create({
  // Step 0 : centré
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  centerBubble: {
    backgroundColor: BUBBLE_BG,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: BUBBLE_BORDER,
    width: '100%',
    height: 130,
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  centerBubbleText: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '400',
  },

  // Steps 2 & 4 : style Duolingo (mascot gauche + bulle droite, en haut)
  sideContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  sideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  sideBubble: {
    flex: 1,
    backgroundColor: BUBBLE_BG,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: BUBBLE_BORDER,
  },
  sideBubbleText: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 26,
    fontWeight: '400',
  },
});

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
  progressTrack: { flex: 1, height: 20, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', justifyContent: 'center' },
  progressFill:  { ...StyleSheet.absoluteFillObject, height: '100%' },
  progressPct:   { fontSize: 11, fontWeight: '900', color: '#fff', textAlign: 'center', zIndex: 1 },

  centerFull: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  stepWrap:   { flex: 1, paddingHorizontal: SPACING.lg },

  mascotRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.md, marginBottom: SPACING.lg, paddingTop: SPACING.sm },
  bubbleSide: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bubbleSideText: { ...FONTS.body, color: '#fff', lineHeight: 24 },

  optionList:    { flex: 1 },
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
  optionRowSelected:   { borderColor: ACCENT },
  optionLabel:         { ...FONTS.body, color: '#fff', fontWeight: '600', flex: 1 },
  optionLabelSelected: { color: ACCENT },
  optionTag:           { ...FONTS.sm, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  optionTagSelected:   { color: ACCENT },

  levelBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, alignItems: 'center', justifyContent: 'center',
  },
  levelBadgeText: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.8 },

  loadingLabel:    { ...FONTS.xs, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, marginTop: SPACING.lg, marginBottom: SPACING.md },
  loadingBarTrack: { width: '100%', height: 8, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: SPACING.lg },
  loadingBarFill:  { height: '100%', borderRadius: RADIUS.pill, backgroundColor: ACCENT },
  loadingText:     { ...FONTS.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 28 },

  inputTitle:    { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  inputSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: SPACING.xl },
  inputWrap:     { width: '100%' },
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

  sellScroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  sellTitle:  { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: SPACING.sm, marginTop: SPACING.sm, lineHeight: 32 },
  sellSub:    { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 22, marginBottom: SPACING.xl },
  statsChocRow: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statsChocItem:  { flex: 1, alignItems: 'center' },
  statsChocNum:   { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  statsChocLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginTop: 4 },
  statsChocSep:   { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  featureIcon: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: CARD, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', flexShrink: 0,
  },
  featureText:  { flex: 1 },
  featureTitle: { ...FONTS.body, fontWeight: '800', color: '#fff', marginBottom: 3 },
  featureSub:   { ...FONTS.sm, color: 'rgba(255,255,255,0.45)', lineHeight: 18 },

  // Profil (step 8)
  profileScroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl ?? 48 },
  sectionBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sectionBadge:    { ...FONTS.xs, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1.2 },
  sectionBadgeStep:{ ...FONTS.xs, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  profileTitle:  { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: SPACING.lg },
  profileInput: {
    backgroundColor: CARD,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    color: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '600',
  },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginVertical: SPACING.lg },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  orText: { ...FONTS.sm, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  emailBtn: {
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 16,
    alignItems: 'center',
  },
  emailBtnText: { ...FONTS.body, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  // Notifs (step 9)
  notifTitle:      { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginTop: SPACING.xl, marginBottom: SPACING.sm },
  notifSub:        { ...FONTS.body, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 24, marginBottom: SPACING.xl, paddingHorizontal: SPACING.sm },
  notifYesBtn:     { backgroundColor: ACCENT, borderRadius: RADIUS.pill, paddingVertical: 18, alignItems: 'center', width: '100%', marginBottom: SPACING.sm },
  notifYesBtnText: { fontSize: 16, fontWeight: '900', color: '#0A1628', letterSpacing: 1 },
  notifNoBtn:      { paddingVertical: 14, alignItems: 'center', width: '100%' },
  notifNoBtnText:  { ...FONTS.body, color: 'rgba(255,255,255,0.35)', fontWeight: '600' },

  footer:          { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.sm },
  cta:             { backgroundColor: ACCENT, borderRadius: RADIUS.pill, paddingVertical: 18, alignItems: 'center' },
  ctaDisabled:     { backgroundColor: '#B0B0B0' },
  ctaText:         { fontSize: 16, fontWeight: '900', color: '#0A1628', letterSpacing: 1 },
  ctaTextDisabled: { color: 'rgba(255,255,255,0.6)' },
  notifBtn:        { borderRadius: RADIUS.pill, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
  notifText:       { ...FONTS.sm, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
});

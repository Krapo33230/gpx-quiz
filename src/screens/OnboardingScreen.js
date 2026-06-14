import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Animated, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SPACING } from '../theme/colors';
import { completeOnboarding, saveObjectif } from '../utils/storage';

import { BG } from './onboarding/theme';
import { styles } from './onboarding/styles';
import { Cta, MascotBubble, OptionRow, TypewriterChat, IntroChat, LoadingStep } from './onboarding/components';
import {
  DATES_CONCOURS, DATE_REACTIONS,
  NIVEAUX, NIVEAU_REACTIONS,
  OBJECTIFS, OBJECTIF_REACTIONS,
  INTRO_MESSAGES, STEP_PROGRESS, INTRO_PROGRESS,
} from './onboarding/data';

export default function OnboardingScreen({ navigation, route }) {
  const returning = route?.params?.returning ?? false;
  const [step,         setStep]         = useState(returning ? 10 : 0);
  const [showCta,      setShowCta]      = useState(false);
  const [introIndex,   setIntroIndex]   = useState(0);
  const [name,         setName]         = useState('');
  const [age,          setAge]          = useState('');
  const [dateConcours, setDateConcours] = useState(null);
  const [niveau,       setNiveau]       = useState(null);
  const [objectif,     setObjectif]     = useState(null);

  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  function animStep(nextStep) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  }

  useEffect(() => {
    if (step === 2 || step === 4 || step === 6) setShowCta(false);
  }, [step]);

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

  const progress = step === 0
    ? INTRO_PROGRESS[Math.min(introIndex, INTRO_PROGRESS.length - 1)]
    : STEP_PROGRESS[Math.min(step, STEP_PROGRESS.length - 1)];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>

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
              </View>
            </View>
          )}

          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

            {step === 0 && (
              <IntroChat msgIndex={introIndex} onDone={() => setShowCta(true)} />
            )}

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

            {step === 2 && (
              <TypewriterChat message={DATE_REACTIONS[dateConcours] ?? ''} onDone={() => setShowCta(true)} />
            )}

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

            {step === 4 && (
              <TypewriterChat message={NIVEAU_REACTIONS[niveau] ?? ''} onDone={() => setShowCta(true)} />
            )}

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

            {step === 6 && (
              <TypewriterChat
                message={OBJECTIF_REACTIONS[objectif]?.message ?? ''}
                highlight={OBJECTIF_REACTIONS[objectif]?.highlight}
                onDone={() => setShowCta(true)}
              />
            )}

            {step === 7 && <LoadingStep loadingAnim={loadingAnim} />}

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
                <TouchableOpacity style={styles.notifYesBtn} onPress={handleNotifYes} activeOpacity={0.85}>
                  <Text style={styles.notifYesBtnText}>Oui, active les rappels !</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.notifNoBtn} onPress={() => animStep(10)} activeOpacity={0.8}>
                  <Text style={styles.notifNoBtnText}>Non merci</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 10 && (
              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.sellScroll} showsVerticalScrollIndicator={false}>
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
              {step === 1  && <Cta label="CONTINUER"    onPress={() => animStep(2)}  disabled={!dateConcours} />}
              {step === 2  && <Cta label="CONTINUER"    onPress={() => animStep(3)}  disabled={!showCta} />}
              {step === 3  && <Cta label="CONTINUER"    onPress={() => animStep(4)}  disabled={!niveau} />}
              {step === 4  && <Cta label="CONTINUER"    onPress={() => animStep(5)}  disabled={!showCta} />}
              {step === 5  && <Cta label="C'EST PARTI !" onPress={() => animStep(6)} disabled={!objectif} />}
              {step === 6  && <Cta label="CONTINUER"    onPress={() => animStep(7)}  disabled={!showCta} />}
              {step === 8  && <Cta label="CONTINUER"    onPress={() => animStep(9)}  disabled={!name.trim()} />}
              {step === 10 && <Cta label="COMMENCER →"  onPress={handleFinish} />}
            </View>
          )}

        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Animated, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING } from '../theme/colors';
import { completeOnboarding, saveObjectif } from '../utils/storage';
import { requestAndScheduleDailyNotif } from '../utils/notifications';
import { sendLeadToSheets } from '../utils/leads';

import { BG } from './onboarding/theme';
import { styles } from './onboarding/styles';
import { Cta, MascotBubble, OptionRow, TypewriterChat, IntroChat, LoadingStep, NotifStep9 } from './onboarding/components';
import {
  DATES_CONCOURS, DATE_REACTIONS,
  NIVEAUX, NIVEAU_REACTIONS,
  OBJECTIFS, OBJECTIF_REACTIONS,
  INTRO_MESSAGES, STEP_PROGRESS, INTRO_PROGRESS,
} from './onboarding/data';

export default function OnboardingScreen({ navigation, route }) {
  const returning = route?.params?.returning ?? false;
  const [step,         setStep]         = useState(0); // DEV
  const [showCta,      setShowCta]      = useState(false);
  const [introIndex,   setIntroIndex]   = useState(0);
  const [name,         setName]         = useState('');
  const [age,          setAge]          = useState('');
  const [email,        setEmail]        = useState('');
  const [gender,       setGender]       = useState(null);
  const matricule = useRef(`CGP-${Math.floor(10000 + Math.random() * 90000)}`).current;
  const [step8Errors,  setStep8Errors]  = useState(false);
  const shakeStep8 = useRef(new Animated.Value(0)).current;
  const [dateConcours, setDateConcours] = useState(null);
  const [niveau,       setNiveau]       = useState(null);
  const [objectif,     setObjectif]     = useState(null);
  const [notifHour,    setNotifHour]    = useState(19);

  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    const t = setTimeout(() => animStep(8), 2500);
    return () => clearTimeout(t);
  }, [step]);

  function handleStep8Next() {
    if (!name.trim() || !gender || !email.trim()) {
      setStep8Errors(true);
      Animated.sequence([
        Animated.timing(shakeStep8, { toValue: 12,  duration: 50, useNativeDriver: true }),
        Animated.timing(shakeStep8, { toValue: -12, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeStep8, { toValue: 8,   duration: 40, useNativeDriver: true }),
        Animated.timing(shakeStep8, { toValue: -8,  duration: 40, useNativeDriver: true }),
        Animated.timing(shakeStep8, { toValue: 0,   duration: 40, useNativeDriver: true }),
      ]).start();
      return;
    }
    animStep(9);
  }

  async function handleFinish() {
    const finalName = name.trim() || 'Candidat';
    await completeOnboarding(finalName, age.trim(), email.trim(), matricule, gender);
    if (objectif) await saveObjectif(objectif);
    sendLeadToSheets({ matricule, name: finalName, gender, age: age.trim(), email: email.trim() });
    navigation.reset({ index: 0, routes: [{ name: 'AutoEvalIntro', params: { fromOnboarding: true } }] });
  }

  async function handleNotifYes() {
    try {
      const granted = await requestAndScheduleDailyNotif(notifHour);
      if (!granted) {
        Alert.alert(
          'Notifications refusées',
          'Tu pourras les activer plus tard dans les paramètres de ton téléphone.',
          [{ text: 'OK', onPress: () => animStep(10) }],
        );
        return;
      }
    } catch (_) {
      // expo-notifications non disponible en Expo Go — on passe quand même
    }
    animStep(10);
  }

  const isTalkingStep = step === 0 || step === 2 || step === 4 || step === 6;

  const progress = step === 0
    ? INTRO_PROGRESS[Math.min(introIndex, INTRO_PROGRESS.length - 1)]
    : STEP_PROGRESS[Math.min(step, STEP_PROGRESS.length - 1)];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        {isTalkingStep && (
          <LinearGradient
            colors={['transparent', 'rgba(26,74,255,0.18)', 'rgba(26,74,255,0.32)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%' }}
            pointerEvents="none"
          />
        )}
        <SafeAreaView style={{ flex: 1 }}>

          {step !== 7 && (
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (step > 0) { animStep(step - 1); }
                  else if (introIndex > 0) { setShowCta(false); setIntroIndex(i => i - 1); }
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

            {step === 7 && <LoadingStep />}

            {step === 8 && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.profileScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.sectionBadgeRow}>
                  <Text style={styles.sectionBadge}>FICHE MATRICULE</Text>
                  <Text style={styles.sectionBadgeStep}>1 / 2</Text>
                </View>
                <Text style={styles.profileTitle}>Identification{'\n'}de la Recrue</Text>
                <Text style={styles.profileSubtitle}>
                  Renseigne tes informations pour personnaliser ta préparation.
                </Text>

                <Animated.View style={{ transform: [{ translateX: shakeStep8 }] }}>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>N° MATRICULE :</Text>
                    <Text style={styles.fieldMatricule}>{matricule}</Text>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, step8Errors && !name.trim() && { color: '#EF4135' }]}>
                      PRÉNOM :{step8Errors && !name.trim() ? '  champ requis' : ''}
                    </Text>
                    <TextInput
                      style={[styles.fieldInput, step8Errors && !name.trim() && { borderBottomColor: '#EF4135' }]}
                      placeholder="ex : Thomas"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={name}
                      onChangeText={v => { setName(v); if (v.trim()) setStep8Errors(false); }}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                    <View style={styles.genderRow}>
                      {[
                        { id: 'M', symbol: '♂', label: 'Homme', color: '#1A4AFF', bg: 'rgba(26,74,255,0.15)', text: '#A0B8FF' },
                        { id: 'F', symbol: '♀', label: 'Femme', color: '#FF4A8D', bg: 'rgba(255,74,141,0.15)', text: '#FFB0D0' },
                      ].map(g => (
                        <TouchableOpacity
                          key={g.id}
                          style={[
                            styles.genderBtn,
                            gender === g.id && { borderColor: g.color, backgroundColor: g.bg },
                            step8Errors && !gender && { borderColor: '#EF4135' },
                          ]}
                          onPress={() => { setGender(g.id); setStep8Errors(false); }}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.genderSymbol, gender === g.id && { color: g.color }]}>{g.symbol}</Text>
                          <Text style={[styles.genderLabel, gender === g.id && { color: g.text }]}>{g.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>ÂGE :</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="ex : 24  (facultatif)"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={age}
                      onChangeText={t => setAge(t.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      maxLength={2}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, step8Errors && !email.trim() && { color: '#EF4135' }]}>
                      ADRESSE MAIL :{step8Errors && !email.trim() ? '  champ requis' : ''}
                    </Text>
                    <TextInput
                      style={[styles.fieldInput, step8Errors && !email.trim() && { borderBottomColor: '#EF4135' }]}
                      placeholder="ex : thomas@mail.com"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={email}
                      onChangeText={v => { setEmail(v); if (v.trim()) setStep8Errors(false); }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                    />
                  </View>

                </Animated.View>
              </ScrollView>
            )}

            {step === 9 && <NotifStep9 hour={notifHour} onHourChange={setNotifHour} />}

            {step === 10 && (
              <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32, justifyContent: 'center' }}>
                <Text style={styles.sellTitle}>
                  {name ? `${name}, tu es` : 'Tu es'}{'\n'}à la bonne place. 💪
                </Text>
                <Text style={styles.sellSub}>
                  Tout ce qu'il faut pour réussir le concours Gardien de la Paix.
                </Text>

                <View style={styles.statsChocRow}>
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>1100+</Text>
                    <Text style={styles.statsChocLabel}>questions</Text>
                  </View>
                  <View style={styles.statsChocSep} />
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>11</Text>
                    <Text style={styles.statsChocLabel}>matières</Text>
                  </View>
                  <View style={styles.statsChocSep} />
                  <View style={styles.statsChocItem}>
                    <Text style={styles.statsChocNum}>100%</Text>
                    <Text style={styles.statsChocLabel}>gratuit</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.catalogScroll}
                  style={{ marginHorizontal: -24 }}
                >
                  {[
                    { icon: '⚖️', title: 'Droit',      color: '#1A3F7A' },
                    { icon: '🌍', title: 'Culture',     color: '#2B7A5B' },
                    { icon: '🧠', title: 'Logique',     color: '#7A2B6A' },
                    { icon: '📝', title: 'Français',    color: '#1A6A7A' },
                    { icon: '🚔', title: 'Sécurité',    color: '#7A4B1A' },
                    { icon: '🌐', title: 'Monde',       color: '#1A6A3A' },
                    { icon: '🔢', title: 'Calcul',      color: '#4A1A7A' },
                    { icon: '💬', title: 'Verbal',      color: '#1A5A4A' },
                    { icon: '🔷', title: 'Abstrait',    color: '#7A3A1A' },
                    { icon: '✅', title: 'Exercices',   color: '#3A5A1A' },
                    { icon: '🇬🇧', title: 'Anglais',   color: '#1A2A7A' },
                  ].map((c, i) => (
                    <View key={i} style={[styles.catalogCard, { borderColor: c.color + 'AA' }]}>
                      <Text style={styles.catalogIcon}>{c.icon}</Text>
                      <Text style={styles.catalogTitle}>{c.title}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
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
              {step === 8  && <Cta label="CONTINUER"   onPress={handleStep8Next} />}
              {step === 9  && (
                <View style={{ width: '100%', gap: 4 }}>
                  <Cta label="ACTIVER LES RAPPELS →" onPress={handleNotifYes} />
                  <TouchableOpacity style={{ paddingVertical: 14, alignItems: 'center' }} onPress={() => animStep(10)} activeOpacity={0.7}>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>Passer sans rappels</Text>
                  </TouchableOpacity>
                </View>
              )}
              {step === 10 && <Cta label="COMMENCER →"  onPress={handleFinish} />}
            </View>
          )}

        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

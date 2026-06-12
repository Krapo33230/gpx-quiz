import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, RADIUS, SPACING } from '../theme/colors';
import { TricolorMark } from '../components/ui';

const BG     = '#0A1628';
const CARD   = '#1A2E4A';
const ACCENT = '#FFFFFF';

const STEPS = [
  { icon: '📋', text: '10 questions courtes — 2 par matière' },
  { icon: '⏱️', text: 'Réponds à ton rythme, sans chrono' },
  { icon: '🎯', text: 'On identifie tes points forts et tes lacunes' },
  { icon: '🗺️', text: 'Résultat immédiat + plan de révision personnalisé' },
];

export default function AutoEvalIntroScreen({ navigation, route }) {
  const fromOnboarding = route?.params?.fromOnboarding ?? false;

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, []);

  function handleStart() {
    navigation.replace('AutoEval', { fromOnboarding });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <TricolorMark size="md" style={{ marginBottom: 12 }} />

          <Text style={styles.title}>Ton diagnostic{'\n'}de niveau</Text>
          <Text style={styles.subtitle}>
            On évalue ton niveau sur chaque matière du concours.
          </Text>

          <View style={styles.stepsCard}>
            {STEPS.map((s, i) => (
              <View key={i} style={[styles.stepRow, i < STEPS.length - 1 && styles.stepBorder]}>
                <Text style={styles.stepIcon}>{s.icon}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeNum}>10</Text>
              <Text style={styles.badgeLabel}>questions</Text>
            </View>
            <View style={styles.badgeSep} />
            <View style={styles.badge}>
              <Text style={styles.badgeNum}>5</Text>
              <Text style={styles.badgeLabel}>matières</Text>
            </View>
            <View style={styles.badgeSep} />
            <View style={styles.badge}>
              <Text style={styles.badgeNum}>~5</Text>
              <Text style={styles.badgeLabel}>minutes</Text>
            </View>
          </View>

        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cta} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.ctaText}>COMMENCER L'AUTO-ÉVALUATION →</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  safe:      { flex: 1 },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: ACCENT,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: SPACING.md,
  },

  stepsCard: {
    width: '100%',
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  stepIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  stepText: { ...FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.85)', flex: 1, lineHeight: 21 },

  badgeRow: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: RADIUS.lg,
    width: '100%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  badge:      { flex: 1, alignItems: 'center' },
  badgeNum:   { fontSize: 24, fontWeight: '900', color: ACCENT },
  badgeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginTop: 3 },
  badgeSep:   { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  cta: {
    backgroundColor: ACCENT,
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: { fontSize: 15, fontWeight: '900', color: BG, letterSpacing: 0.8 },
});

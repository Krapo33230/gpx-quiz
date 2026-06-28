import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SPACING } from '../theme/colors';
import { TricolorMark } from '../components/ui';

const STEPS = [
  { icon: '📋', text: '22 questions courtes — 2 par matière' },
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

  return (
    <View style={s.container}>
      <SafeAreaView style={s.safe}>

        <Animated.View style={[s.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <TricolorMark size="md" style={{ marginBottom: 20 }} />

          <Text style={s.title}>Diagnostic{'\n'}de niveau</Text>
          <Text style={s.subtitle}>
            On évalue ton niveau sur chaque matière du concours.
          </Text>

          <View style={s.card}>
            {STEPS.map((step, i) => (
              <View key={i} style={[s.row, i < STEPS.length - 1 && s.rowBorder]}>
                <View style={s.iconWrap}>
                  <Text style={s.icon}>{step.icon}</Text>
                </View>
                <Text style={s.rowText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={s.statsRow}>
            {[
              { num: '22',  label: 'questions' },
              { num: '11',  label: 'matières'  },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <View style={s.statItem}>
                  <Text style={s.statNum}>{item.num}</Text>
                  <Text style={s.statLabel}>{item.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={s.statSep} />}
              </React.Fragment>
            ))}
          </View>

        </Animated.View>

        <View style={s.footer}>
          <TouchableOpacity onPress={() => navigation.replace('AutoEval', { fromOnboarding })} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1A4AFF', '#002395']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.cta}
            >
              <Text style={s.ctaText}>COMMENCER L'AUTO-ÉVALUATION →</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={s.skip} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })} activeOpacity={0.7}>
            <Text style={s.skipText}>Passer et accéder à l'appli</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  safe:      { flex: 1 },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  card: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(26,74,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  icon:    { fontSize: 18 },
  rowText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', flex: 1, lineHeight: 21, fontWeight: '500' },

  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 16,
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statNum:   { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 3 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  statSep:   { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  cta: {
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaText: { fontSize: 15, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.8 },
  skip:     { paddingVertical: 14, alignItems: 'center' },
  skipText: { fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, RADIUS, SPACING } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const BG = '#060D1A';

export default function WelcomeScreen({ navigation }) {
  const [phase, setPhase] = useState('splash');

  const blueY          = useRef(new Animated.Value(height)).current;
  const whiteY         = useRef(new Animated.Value(height)).current;
  const redY           = useRef(new Animated.Value(height)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide   = useRef(new Animated.Value(16)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSlide   = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(blueY,  { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(whiteY, { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(redY,   { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
    ]).start();

    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(contentSlide,   { toValue: 0, friction: 7, useNativeDriver: true }),
      ]).start();
    }, 800);

    const t2 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(blueY,          { toValue: -height, duration: 380, useNativeDriver: true }),
        Animated.timing(whiteY,         { toValue: -height, duration: 430, useNativeDriver: true }),
        Animated.timing(redY,           { toValue: -height, duration: 480, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setPhase('welcome');
        Animated.parallel([
          Animated.timing(welcomeOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(welcomeSlide,   { toValue: 0, friction: 7,  useNativeDriver: true }),
        ]).start();
      });
    }, 2900);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── SPLASH ──────────────────────────────────────────────────────────────────
  if (phase === 'splash') {
    return (
      <View style={styles.splash}>
        <Animated.View style={[styles.band, { left: 0,            backgroundColor: '#002395', transform: [{ translateY: blueY  }] }]} />
        <Animated.View style={[styles.band, { left: width / 3,    backgroundColor: '#FFFFFF', transform: [{ translateY: whiteY }] }]} />
        <Animated.View style={[styles.band, { left: width * 2 / 3, backgroundColor: '#ED2939', transform: [{ translateY: redY   }] }]} />

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlay, { opacity: overlayOpacity }]} />

        <Animated.View style={[styles.splashContent, {
          opacity: contentOpacity,
          transform: [{ translateY: contentSlide }],
        }]}>
          <Text style={styles.splashLabel}>PRÉPARATION AU CONCOURS</Text>
          <Text style={styles.splashName}>ConcoursPolice</Text>
          <View style={styles.splashDivider} />
          <Text style={styles.splashSub}>Gardien de la Paix · Police Nationale</Text>
        </Animated.View>
      </View>
    );
  }

  // ── WELCOME ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.welcomeBg}>
      <SafeAreaView style={{ flex: 1 }}>

        <Animated.View style={[styles.center, {
          opacity: welcomeOpacity,
          transform: [{ translateY: welcomeSlide }],
        }]}>
          {/* Marque tricolore */}
          <View style={styles.trimark}>
            <View style={[styles.tribar, { backgroundColor: '#002395' }]} />
            <View style={[styles.tribar, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.tribar, { backgroundColor: '#ED2939' }]} />
          </View>

          <Text style={styles.appName}>ConcoursPolice</Text>
          <Text style={styles.tagline}>
            La préparation fait la différence.{'\n'}Commence dès aujourd'hui.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttons, { opacity: welcomeOpacity }]}>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}
            onPress={() => navigation.navigate('Onboarding')}>
            <Text style={styles.primaryText}>COMMENCER LA PRÉPARATION</Text>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: width / 3,
  },
  overlay: {
    backgroundColor: 'rgba(0,5,20,0.60)',
  },
  splashContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  splashLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 3,
    marginBottom: 14,
  },
  splashName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  splashDivider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 1,
    marginVertical: 14,
  },
  splashSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.50)',
    letterSpacing: 0.4,
  },

  // Welcome
  welcomeBg: { flex: 1, backgroundColor: BG },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },

  trimark: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 28,
  },
  tribar: {
    width: 9,
    height: 36,
    borderRadius: 4,
  },

  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: SPACING.md,
  },
  tagline: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.50)',
    textAlign: 'center',
    lineHeight: 26,
  },

  buttons: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#060D1A',
    letterSpacing: 0.8,
  },
});

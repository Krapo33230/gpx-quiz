import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
  TouchableOpacity, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = ['#F5C518', '#E84040', '#3DBE6E', '#1A3F7A', '#F09E1A', '#00BFFF', '#FF6B35', '#C0C0C0'];
const NB_CONFETTI = 30;

function makeConfetti() {
  return Array.from({ length: NB_CONFETTI }, (_, i) => ({
    x: Math.random() * width,
    delay: Math.random() * 600,
    duration: 1200 + Math.random() * 800,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 10,
    rotation: Math.random() * 360,
  }));
}

const CONFETTI_DATA = makeConfetti();

export default function LevelUpScreen({ navigation, route }) {
  const { newLevel, xpGained, totalXP } = route.params;

  // Confetti animations
  const confettiAnims = useRef(
    CONFETTI_DATA.map(() => ({
      y: new Animated.Value(-60),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  // Badge animation
  const badgeScale  = useRef(new Animated.Value(0)).current;
  const badgeBounce = useRef(new Animated.Value(0)).current;
  const textFade    = useRef(new Animated.Value(0)).current;
  const btnFade     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Lancer les confettis
    confettiAnims.forEach(({ y, opacity, rotate }, i) => {
      const { delay, duration } = CONFETTI_DATA[i];
      Animated.parallel([
        Animated.timing(y, {
          toValue: height + 60,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.4,
          delay: delay + duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Badge pop
    Animated.sequence([
      Animated.spring(badgeScale, { toValue: 1.2, friction: 4, tension: 200, useNativeDriver: true }),
      Animated.spring(badgeScale, { toValue: 1,   friction: 6, useNativeDriver: true }),
    ]).start();

    // Pulse badge
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.spring(badgeBounce, { toValue: -10, friction: 3, useNativeDriver: true }),
          Animated.spring(badgeBounce, { toValue: 0,   friction: 3, useNativeDriver: true }),
        ])
      ).start();
    }, 600);

    // Texte + bouton
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(textFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(700),
      Animated.timing(btnFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8E1" />

      {/* ── Confettis ── */}
      {CONFETTI_DATA.map((c, i) => {
        const { y, opacity, rotate } = confettiAnims[i];
        const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: [`${c.rotation}deg`, `${c.rotation + 720}deg`] });
        return (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                left: c.x,
                width: c.size,
                height: c.size * 0.5,
                backgroundColor: c.color,
                borderRadius: 2,
                opacity,
                transform: [{ translateY: y }, { rotate: spin }],
              },
            ]}
          />
        );
      })}

      <SafeAreaView style={styles.inner}>
        {/* ── Badge niveau ── */}
        <Animated.View
          style={[
            styles.badgeWrap,
            { transform: [{ scale: badgeScale }, { translateY: badgeBounce }] },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: newLevel.color }]}>
            <Text style={styles.badgeEmoji}>{newLevel.emoji}</Text>
          </View>
          <View style={[styles.badgeRing, { borderColor: newLevel.color }]} />
        </Animated.View>

        {/* ── Texte ── */}
        <Animated.View style={[styles.textBlock, { opacity: textFade }]}>
          <Text style={styles.levelUp}>NOUVEAU GRADE !</Text>
          <Text style={[styles.levelName, { color: newLevel.color }]}>{newLevel.name}</Text>
          <Text style={styles.levelDesc}>{newLevel.emoji} Tu passes au grade suivant — félicitations !</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>+{xpGained} XP</Text>
              <Text style={styles.statLbl}>gagnés cette session</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxAlt]}>
              <Text style={[styles.statVal, { color: newLevel.color }]}>{totalXP} XP</Text>
              <Text style={styles.statLbl}>total</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Bouton ── */}
        <Animated.View style={[styles.btnWrap, { opacity: btnFade }]}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: newLevel.color }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Continuer</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8E1' },
  inner:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },

  confetti: { position: 'absolute', top: 0 },

  badgeWrap: { marginBottom: SPACING.xl, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 120, height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  badgeRing: {
    position: 'absolute',
    width: 140, height: 140,
    borderRadius: 70,
    borderWidth: 3,
    opacity: 0.3,
  },
  badgeEmoji: { fontSize: 60 },

  textBlock: { alignItems: 'center', marginBottom: SPACING.xl },
  levelUp:   { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: SPACING.xs },
  levelName: { fontSize: 36, fontWeight: '900', marginBottom: SPACING.sm },
  levelDesc: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },

  statsRow: { flexDirection: 'row', gap: SPACING.md },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statBoxAlt: { backgroundColor: COLORS.white },
  statVal:    { ...FONTS.h2, color: COLORS.text },
  statLbl:    { ...FONTS.xs, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },

  btnWrap: { width: '100%' },
  btn: {
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  btnText: { ...FONTS.h3, color: COLORS.white },
});

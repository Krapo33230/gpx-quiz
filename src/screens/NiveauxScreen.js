import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_H } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { getXP, getLevelInfo, LEVELS } from '../utils/storage';

export default function NiveauxScreen({ navigation }) {
  const [xpInfo, setXpInfo] = useState(null);

  function loadXP() {
    getXP().then(xp => setXpInfo(getLevelInfo(xp)));
  }

  useEffect(() => {
    loadXP();
    const unsub = navigation.addListener('focus', loadXP);
    return unsub;
  }, [navigation]);

  if (!xpInfo) return null;

  const currentIdx = LEVELS.indexOf(xpInfo.level);

  const glowColor = xpInfo.level.color;

  return (
    <View style={styles.safe}>
      {/* Glow ambiant couleur du grade actuel */}
      <LinearGradient
        colors={[glowColor + 'CC', glowColor + '55', 'transparent']}
        style={styles.glowTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', glowColor + '44']}
        style={styles.glowBottom}
        pointerEvents="none"
      />
      {/* Halo central */}
      <LinearGradient
        colors={['transparent', glowColor + '33', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.glowCenter}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.titre}>Grades</Text>
          <Text style={styles.sousTitre}>{xpInfo.xp} XP au total</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {LEVELS.map((level, i) => {
          const isCurrent  = i === currentIdx;
          const isUnlocked = i < currentIdx;
          const isLocked   = i > currentIdx;
          const next       = LEVELS[i + 1] ?? null;
          const pct        = isCurrent ? xpInfo.pct : isUnlocked ? 100 : 0;

          return (
            <React.Fragment key={level.name}>
              <LevelCard
                level={level}
                next={next}
                pct={pct}
                xp={xpInfo.xp}
                isCurrent={isCurrent}
                isUnlocked={isUnlocked}
                isLocked={isLocked}
              />
              {i < LEVELS.length - 1 && (
                <View style={styles.connector}>
                  {[0, 1, 2].map(j => (
                    <View
                      key={j}
                      style={[
                        styles.dot,
                        { backgroundColor: isUnlocked ? level.color : COLORS.border },
                      ]}
                    />
                  ))}
                </View>
              )}
            </React.Fragment>
          );
        })}
          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LevelCard({ level, next, pct, xp, isCurrent, isUnlocked, isLocked }) {
  const scaleAnim = useRef(new Animated.Value(isCurrent ? 0.9 : 1)).current;

  useEffect(() => {
    if (isCurrent) {
      Animated.loop(
        Animated.sequence([
          Animated.spring(scaleAnim, { toValue: 1.04, friction: 3, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1,    friction: 3, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [isCurrent]);

  const showGradient = isCurrent || isUnlocked;
  const border = isCurrent ? level.color : isUnlocked ? level.color + '60' : COLORS.border;
  const textC  = isCurrent || isUnlocked ? COLORS.white : isLocked ? COLORS.textDisabled : COLORS.text;

  return (
    <Animated.View
      style={[
        styles.card,
        SHADOWS.card,
        {
          backgroundColor: isLocked ? '#1C1C1E' : 'transparent',
          borderColor: border,
          transform: [{ scale: scaleAnim }],
          overflow: 'hidden',
        },
      ]}
    >
      {showGradient && (
        <LinearGradient
          colors={level.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: showGradient ? 'rgba(255,255,255,0.22)' : level.color + '20' }]}>
        <Text style={styles.badgeEmoji}>{isLocked ? '🔒' : level.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.levelName, { color: textC, opacity: isLocked ? 0.5 : 1 }]}>
          {level.name}
        </Text>
        <Text style={[styles.levelXP, { color: showGradient ? 'rgba(255,255,255,0.85)' : COLORS.textSecondary, opacity: isLocked ? 0.5 : 1 }]}>
          {isUnlocked ? `✓ Débloqué` : isCurrent ? `${xp} / ${next?.min ?? '∞'} XP` : `À partir de ${level.min} XP`}
        </Text>

        {isCurrent && next && (
          <View style={styles.barWrap}>
            <XPBar pct={pct} />
          </View>
        )}
      </View>

      {isCurrent && (
        <View style={styles.currentTag}>
          <Text style={styles.currentTagText}>Actuel</Text>
        </View>
      )}
    </Animated.View>
  );
}

function XPBar({ pct }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct / 100, duration: 900, useNativeDriver: false }).start();
  }, [pct]);
  return (
    <View style={styles.xpTrack}>
      <Animated.View
        style={[
          styles.xpFill,
          { width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#0F0F0F' },
  glowTop:    { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_H * 0.5 },
  glowBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_H * 0.4 },
  glowCenter: { position: 'absolute', top: SCREEN_H * 0.2, left: -60, right: -60, height: SCREEN_H * 0.5 },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  titre:     { ...FONTS.h1, color: '#FFFFFF' },
  sousTitre: { ...FONTS.sm, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  badge: {
    width: 56, height: 56,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: { fontSize: 28 },
  info:       { flex: 1 },
  levelName:  { ...FONTS.h3, marginBottom: 2 },
  levelXP:    { ...FONTS.sm },
  barWrap:    { marginTop: SPACING.sm },
  xpTrack:    { height: 8, borderRadius: RADIUS.pill, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  xpFill:     { height: '100%', borderRadius: RADIUS.pill, backgroundColor: COLORS.white },

  currentTag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  currentTagText: { ...FONTS.xs, color: COLORS.white, fontWeight: '700' },

  connector: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

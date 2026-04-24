import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { getXP, getLevelInfo, LEVELS } from '../utils/storage';

export default function NiveauxScreen({ navigation }) {
  const [xpInfo, setXpInfo] = useState(null);

  useEffect(() => {
    getXP().then(xp => setXpInfo(getLevelInfo(xp)));
  }, []);

  if (!xpInfo) return null;

  const currentIdx = LEVELS.indexOf(xpInfo.level);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Tes grades</Text>
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

  const bg     = isCurrent ? level.color : isUnlocked ? level.color + '15' : COLORS.surface;
  const border = isCurrent ? level.color : isUnlocked ? level.color + '40' : COLORS.border;
  const textC  = isCurrent ? COLORS.white : isLocked ? COLORS.textDisabled : COLORS.text;

  return (
    <Animated.View
      style={[
        styles.card,
        SHADOWS.card,
        { backgroundColor: bg, borderColor: border, transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: isCurrent ? 'rgba(255,255,255,0.2)' : level.color + '20' }]}>
        <Text style={styles.badgeEmoji}>{isLocked ? '🔒' : level.emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.levelName, { color: textC, opacity: isLocked ? 0.5 : 1 }]}>
          {level.name}
        </Text>
        <Text style={[styles.levelXP, { color: isCurrent ? 'rgba(255,255,255,0.8)' : COLORS.textSecondary, opacity: isLocked ? 0.5 : 1 }]}>
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
  safe:   { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  backBtn:   { marginBottom: SPACING.sm },
  backText:  { ...FONTS.body, color: COLORS.primary, fontWeight: '600' },
  titre:     { ...FONTS.h1, color: COLORS.text },
  sousTitre: { ...FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },

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

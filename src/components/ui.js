import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';

// ─── PrimaryButton ─────────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, disabled = false, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.primaryBtn,
          disabled && styles.primaryBtnDisabled,
          SHADOWS.button,
        ]}
      >
        <Text style={styles.primaryBtnText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── OutlineButton ─────────────────────────────────────────────────────────────
export function OutlineButton({ label, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
        style={styles.outlineBtn}
      >
        <Text style={styles.outlineBtnText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ current, total }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: total > 0 ? current / total : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[styles.progressFill, { width: widthInterpolated }]}
      />
    </View>
  );
}

// ─── CategoryBadge ────────────────────────────────────────────────────────────
export function CategoryBadge({ label, emoji, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ value, label, icon }) {
  return (
    <View style={[styles.statCard, SHADOWS.card]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  primaryBtnText: {
    ...FONTS.h3,
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  outlineBtn: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  outlineBtnText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },

  progressTrack: {
    height: 10,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeEmoji: { fontSize: 14 },
  badgeLabel: { ...FONTS.xs, fontWeight: '700' },

  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  statIcon:  { fontSize: 22, marginBottom: 4 },
  statValue: { ...FONTS.h2, color: COLORS.primary, marginBottom: 2 },
  statLabel: { ...FONTS.xs, color: COLORS.textSecondary, textAlign: 'center' },
});

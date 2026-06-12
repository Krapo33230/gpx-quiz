import React, { useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';

export function PrimaryButton({ label, onPress, disabled = false, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.85}
        style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled, SHADOWS.button]}
      >
        <Text style={styles.primaryBtnText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function OutlineButton({ label, onPress, disabled = false, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => !disabled && Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => !disabled && Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.outlineBtn, disabled && styles.outlineBtnDisabled]}
      >
        <Text style={[styles.outlineBtnText, disabled && styles.outlineBtnTextDisabled]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled:     { backgroundColor: COLORS.textDisabled },
  primaryBtnText: {
    ...FONTS.h3,
    color: COLORS.white,
    letterSpacing: 0.5,
    textAlign: 'center',
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
  outlineBtnText:         { ...FONTS.h3, color: COLORS.primary, textAlign: 'center' },
  outlineBtnDisabled:     { borderColor: COLORS.textDisabled, backgroundColor: COLORS.surface },
  outlineBtnTextDisabled: { color: COLORS.textDisabled },
});

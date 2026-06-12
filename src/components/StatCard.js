import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';

export function StatCard({ value, label, icon }) {
  return (
    <View style={[styles.statCard, SHADOWS.card]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

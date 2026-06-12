import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../theme/colors';

export function CategoryBadge({ label, emoji, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

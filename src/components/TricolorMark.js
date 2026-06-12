import React from 'react';
import { View } from 'react-native';

const TRICOLOR_SIZES = {
  xs: { w: 5,  h: 20, r: 3, gap: 3 },
  sm: { w: 7,  h: 28, r: 3, gap: 4 },
  md: { w: 9,  h: 36, r: 4, gap: 5 },
  lg: { w: 13, h: 52, r: 5, gap: 6 },
  xl: { w: 17, h: 68, r: 7, gap: 8 },
};

export function TricolorMark({ size = 'md', style }) {
  const s = TRICOLOR_SIZES[size] || TRICOLOR_SIZES.md;
  return (
    <View style={[{ flexDirection: 'row', gap: s.gap }, style]}>
      <View style={{ width: s.w, height: s.h, borderRadius: s.r, backgroundColor: '#002395' }} />
      <View style={{ width: s.w, height: s.h, borderRadius: s.r, backgroundColor: '#FFFFFF' }} />
      <View style={{ width: s.w, height: s.h, borderRadius: s.r, backgroundColor: '#ED2939' }} />
    </View>
  );
}

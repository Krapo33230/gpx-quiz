import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const bar   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1, friction: 7, tension: 90, useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: 1, duration: 1600, delay: 200, useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      {/* Texture lignes fines EFFET-01 */}
      <View style={s.texture} pointerEvents="none">
        {Array.from({ length: 28 }).map((_, i) => (
          <View key={i} style={[s.line, { top: i * 28 }]} />
        ))}
      </View>

      {/* Contenu centré */}
      <Animated.View style={[s.center, { opacity: fade, transform: [{ scale }] }]}>

        {/* Badge PN */}
        <View style={s.badge}>
          <View style={s.badgeInner}>
            <Text style={s.badgeStar}>✦  ✦  ✦</Text>
            <Text style={s.badgePN}>PN</Text>
            <Text style={s.badgeStar}>✦  ✦  ✦</Text>
          </View>
        </View>

        {/* Séparateur gold */}
        <LinearGradient
          colors={['transparent', '#c9a84c', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.sep}
        />

        <Text style={s.titleSm}>PRÉPARATION AU CONCOURS</Text>
        <Text style={s.titleLg}>GARDIEN DE LA PAIX</Text>

        <LinearGradient
          colors={['transparent', '#7a6030', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.sepDim}
        />

        <Text style={s.subtitle}>Police Nationale · France</Text>
      </Animated.View>

      {/* Barre de chargement */}
      <View style={s.barTrack}>
        <Animated.View
          style={[s.barFill, {
            width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]}
        />
        {/* Glow à l'extrémité */}
        <Animated.View
          style={[s.barGlow, {
            left: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '97%'] }),
          }]}
        />
      </View>

      <Text style={s.version}>ConcoursPolice · v1.0</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
  },

  texture: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.012)',
  },

  center: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  badge: {
    width: 96,
    height: 96,
    borderWidth: 2,
    borderColor: '#c9a84c',
    backgroundColor: '#0f2040',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  badgeInner: {
    alignItems: 'center',
  },
  badgeStar: {
    fontSize: 8,
    color: '#c9a84c',
    letterSpacing: 2,
    marginVertical: 2,
  },
  badgePN: {
    fontSize: 26,
    fontWeight: '900',
    color: '#e8cc80',
    letterSpacing: 6,
  },

  sep: {
    width: 200,
    height: 1,
    marginBottom: 20,
  },
  sepDim: {
    width: 140,
    height: 1,
    marginTop: 20,
    marginBottom: 16,
  },

  titleSm: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c9a84c',
    letterSpacing: 3,
    marginBottom: 8,
  },
  titleLg: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f0f4ff',
    letterSpacing: 4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12,
    color: 'rgba(208,216,232,0.55)',
    letterSpacing: 2,
  },

  barTrack: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    height: 2,
    backgroundColor: '#1a3560',
  },
  barFill: {
    height: 2,
    backgroundColor: '#c9a84c',
  },
  barGlow: {
    position: 'absolute',
    top: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e8cc80',
    shadowColor: '#c9a84c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  version: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: 1,
  },
});

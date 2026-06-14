import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const bar  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: 1, duration: 1500, delay: 300, useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <Animated.View style={[s.center, { opacity: fade }]}>
        <Text style={s.label}>PRÉPARATION AU CONCOURS</Text>
        <Text style={s.title}>ConcoursPolice</Text>
        <View style={s.sep} />
        <Text style={s.subtitle}>Gardien de la Paix · Police Nationale</Text>
      </Animated.View>

      <View style={s.barTrack}>
        <Animated.View style={[s.barFill, {
          width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }]} />
      </View>

      <Text style={s.version}>ConcoursPolice · v1.0</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#001249',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(240,244,255,0.5)',
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  sep: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(240,244,255,0.25)',
    marginTop: 16,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(208,216,232,0.55)',
    letterSpacing: 0.5,
  },
  barTrack: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: 2,
    backgroundColor: '#F0F4FF',
  },
  version: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
});

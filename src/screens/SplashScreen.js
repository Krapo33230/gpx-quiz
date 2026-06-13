import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const bar   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1, duration: 350, useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1, friction: 8, tension: 100, useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: 1, duration: 1500, delay: 150, useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>

      {/* Bandes tricolores en fond — opacité douce */}
      <View style={s.tricolorBg} pointerEvents="none">
        <View style={[s.band, { backgroundColor: '#002395' }]} />
        <View style={[s.band, { backgroundColor: '#F0F4FF' }]} />
        <View style={[s.band, { backgroundColor: '#EF4135' }]} />
      </View>

      {/* Overlay sombre pour garder le texte lisible */}
      <View style={s.overlay} pointerEvents="none" />

      {/* Contenu centré */}
      <Animated.View style={[s.center, { opacity: fade, transform: [{ scale }] }]}>

        {/* Logo */}
        <Image
          source={require('../../assets/icon.png')}
          style={s.logo}
          resizeMode="contain"
        />

        {/* Séparateur tricolore */}
        <View style={s.triSep}>
          <View style={[s.triBar, { backgroundColor: '#002395' }]} />
          <View style={[s.triBar, { backgroundColor: '#F0F4FF' }]} />
          <View style={[s.triBar, { backgroundColor: '#EF4135' }]} />
        </View>

        <Text style={s.titleSm}>PRÉPARATION AU CONCOURS</Text>
        <Text style={s.titleLg}>GARDIEN DE LA PAIX</Text>

        {/* Séparateur simple */}
        <View style={s.simpleSep} />

        <Text style={s.subtitle}>Police Nationale · France</Text>
      </Animated.View>

      {/* Barre de chargement tricolore */}
      <View style={s.barTrack}>
        <Animated.View style={[s.barFill, {
          width: bar.interpolate({ inputRange: [0, 0.33, 0.66, 1], outputRange: ['0%', '33%', '66%', '100%'] }),
        }]}>
          <View style={[s.barSegment, { backgroundColor: '#002395' }]} />
          <View style={[s.barSegment, { backgroundColor: '#F0F4FF' }]} />
          <View style={[s.barSegment, { backgroundColor: '#EF4135' }]} />
        </Animated.View>
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

  tricolorBg: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  band: {
    flex: 1,
    opacity: 0.13,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 10, 40, 0.55)',
  },

  center: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 28,
  },

  triSep: {
    flexDirection: 'row',
    width: 180,
    height: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  triBar: {
    flex: 1,
    height: 2,
  },

  simpleSep: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(240,244,255,0.3)',
    marginTop: 20,
    marginBottom: 16,
  },

  titleSm: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F0F4FF',
    letterSpacing: 3,
    marginBottom: 10,
    opacity: 0.7,
  },
  titleLg: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: 3,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: 'rgba(208,216,232,0.6)',
    letterSpacing: 1.5,
  },

  barTrack: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    flexDirection: 'row',
  },
  barSegment: {
    flex: 1,
    height: 3,
  },

  version: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
});

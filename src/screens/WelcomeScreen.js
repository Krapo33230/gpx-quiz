import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SPACING } from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const slide   = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slide,   { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <LinearGradient
        colors={['transparent', 'rgba(26,74,255,0.12)', 'rgba(26,74,255,0.28)']}
        style={s.ambientGlow}
        pointerEvents="none"
      />
      <SafeAreaView style={{ flex: 1 }}>

        <Animated.View style={[s.center, { opacity, transform: [{ translateY: slide }] }]}>
          <View style={s.flagWrap}>
            <View style={s.trimark}>
              <View style={[s.tribar, { backgroundColor: '#002395' }]} />
              <View style={[s.tribar, { backgroundColor: '#F0F4FF' }]} />
              <View style={[s.tribar, { backgroundColor: '#EF4135' }]} />
            </View>
          </View>

          <Text style={s.appName}>ConcoursPolice</Text>
          <Text style={s.subtitle}>Gardien de la Paix · Police Nationale</Text>
          <Text style={s.tagline}>
            La préparation fait la différence.{'\n'}Commence dès aujourd'hui.
          </Text>
        </Animated.View>

        <Animated.View style={[s.buttons, { opacity }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <LinearGradient
              colors={['#1A4AFF', '#002395']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.primaryBtn}
            >
              <Text style={s.primaryText}>COMMENCER LA PRÉPARATION</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F0F0F' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  flagWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  trimark: { flexDirection: 'row', gap: 6 },
  tribar:  { width: 12, height: 52, borderRadius: 3 },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(160,180,220,0.7)',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  tagline: {
    ...FONTS.body,
    color: 'rgba(208,216,232,0.75)',
    textAlign: 'center',
    lineHeight: 26,
  },
  ambientGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  buttons: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  primaryBtn: {
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: 0.8,
  },
});

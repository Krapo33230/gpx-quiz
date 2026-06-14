import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, SPACING } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const blueY   = useRef(new Animated.Value(height)).current;
  const whiteY  = useRef(new Animated.Value(height)).current;
  const redY    = useRef(new Animated.Value(height)).current;
  const bandsOp = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slide   = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // 1. Bandes tricolores montent
    Animated.stagger(110, [
      Animated.spring(blueY,  { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(whiteY, { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(redY,   { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
    ]).start(() => {
      // 2. Bandes disparaissent + contenu welcome apparaît
      Animated.parallel([
        Animated.timing(bandsOp, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slide,   { toValue: 0, friction: 7, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={s.root}>

      {/* Bandes tricolores animées */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bandsOp }]} pointerEvents="none">
        <Animated.View style={[s.band, { left: 0,             backgroundColor: '#002395', transform: [{ translateY: blueY  }] }]} />
        <Animated.View style={[s.band, { left: width / 3,     backgroundColor: '#F0F4FF', transform: [{ translateY: whiteY }] }]} />
        <Animated.View style={[s.band, { left: width * 2 / 3, backgroundColor: '#EF4135', transform: [{ translateY: redY   }] }]} />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[s.center, { opacity, transform: [{ translateY: slide }] }]}>

          {/* Marqueur tricolore */}
          <View style={s.trimark}>
            <View style={[s.tribar, { backgroundColor: '#002395' }]} />
            <View style={[s.tribar, { backgroundColor: '#F0F4FF' }]} />
            <View style={[s.tribar, { backgroundColor: '#EF4135' }]} />
          </View>

          <Text style={s.appName}>ConcoursPolice</Text>
          <Text style={s.tagline}>
            La préparation fait la différence.{'\n'}Commence dès aujourd'hui.
          </Text>
        </Animated.View>

        <Animated.View style={[s.buttons, { opacity }]}>
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <Text style={s.primaryText}>COMMENCER LA PRÉPARATION</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#001249',
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: width / 3,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  trimark: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 28,
  },
  tribar: {
    width: 9,
    height: 36,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: -1,
    marginBottom: SPACING.md,
  },
  tagline: {
    ...FONTS.body,
    color: 'rgba(208,216,232,0.55)',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttons: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  primaryBtn: {
    backgroundColor: '#002395',
    borderWidth: 1,
    borderColor: '#F0F4FF',
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

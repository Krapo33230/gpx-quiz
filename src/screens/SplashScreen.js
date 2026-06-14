import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const blueY   = useRef(new Animated.Value(height)).current;
  const whiteY  = useRef(new Animated.Value(height)).current;
  const redY    = useRef(new Animated.Value(height)).current;
  const bandsOp = useRef(new Animated.Value(1)).current;
  const textOp  = useRef(new Animated.Value(0)).current;
  const textY   = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // 1. Bandes tricolores montent
    Animated.stagger(110, [
      Animated.spring(blueY,  { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(whiteY, { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
      Animated.spring(redY,   { toValue: 0, friction: 7, tension: 32, useNativeDriver: true }),
    ]).start(() => {
      // 2. Bandes disparaissent + texte apparaît
      Animated.parallel([
        Animated.timing(bandsOp, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(textOp,  { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
        Animated.spring(textY,   { toValue: 0, friction: 7, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  return (
    <View style={s.root}>

      {/* Bandes tricolores */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bandsOp }]} pointerEvents="none">
        <Animated.View style={[s.band, { left: 0,             backgroundColor: '#002395', transform: [{ translateY: blueY  }] }]} />
        <Animated.View style={[s.band, { left: width / 3,     backgroundColor: '#F0F4FF', transform: [{ translateY: whiteY }] }]} />
        <Animated.View style={[s.band, { left: width * 2 / 3, backgroundColor: '#EF4135', transform: [{ translateY: redY   }] }]} />
      </Animated.View>

      {/* Texte ConcoursPolice */}
      <Animated.View style={[s.center, { opacity: textOp, transform: [{ translateY: textY }] }]}>
        <Text style={s.title}>ConcoursPolice</Text>
      </Animated.View>

      {/* Barre de chargement */}
      <Text style={s.version}>ConcoursPolice · v1.0</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#001249',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: width / 3,
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#F0F4FF',
    letterSpacing: -0.5,
  },
  version: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
});

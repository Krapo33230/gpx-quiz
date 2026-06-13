import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const bar  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: 1, duration: 1500, delay: 200, useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <Animated.View style={{ opacity: fade }}>
        <Image
          source={require('../../assets/icon.png')}
          style={s.logo}
          resizeMode="contain"
        />
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
  logo: {
    width: 240,
    height: 120,
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

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SPACING } from '../../theme/colors';
import { TricolorMark } from '../../components/ui';
import { BLUE, ACCENT, GRADIENT_DEFAULT, GRADIENT_SELECTED } from './theme';
import { styles, chatStyles } from './styles';
import {
  INTRO_MESSAGES, LAST_INTRO_IDX, HIGHLIGHT_INTRO, HIGHLIGHT_INTRO2,
  NB_CONFETTI, CONFETTI_COLORS, SHAPES,
} from './data';

// ─── Hook typewriter ──────────────────────────────────────────────────────────
export function useTypewriter(text, speed, onDone) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let cancelled = false;

    function showChar(i) {
      if (cancelled) return;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        setTimeout(() => showChar(i + 1), speed);
      } else {
        setDone(true);
        onDone?.();
      }
    }

    setTimeout(() => showChar(1), speed);
    return () => { cancelled = true; };
  }, [text]);

  return { displayed, done };
}

// ─── Curseur clignotant ───────────────────────────────────────────────────────
export function Cursor({ visible }) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  if (!visible) return null;
  return <Animated.Text style={{ opacity: anim, color: 'rgba(255,255,255,0.6)' }}>|</Animated.Text>;
}

// ─── Bulle mascot ─────────────────────────────────────────────────────────────
export function MascotBubble({ message }) {
  return (
    <View style={styles.mascotRow}>
      <TricolorMark size="sm" />
      <View style={styles.bubbleSide}>
        <Text style={styles.bubbleSideText}>{message}</Text>
      </View>
    </View>
  );
}

// ─── Cercle checkmark ─────────────────────────────────────────────────────────
export function CheckDot({ selected }) {
  return (
    <View style={[styles.checkDot, selected && styles.checkDotSelected]}>
      {selected && <Text style={styles.checkDotText}>✓</Text>}
    </View>
  );
}

// ─── Ligne d'option (date / niveau / objectif) ────────────────────────────────
export function OptionRow({ label, tag, badge, badgeColor, gradient, selected, onPress }) {
  const colors = selected ? GRADIENT_SELECTED : (gradient ?? GRADIENT_DEFAULT);

  const inner = (
    <>
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      {tag && <Text style={[styles.optionTag, selected && styles.optionTagSelected]}>{tag}</Text>}
      <CheckDot selected={selected} />
    </>
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.optionTouchable}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.optionRow, selected && styles.optionRowSelected]}
      >
        {badge && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{badge}</Text>
          </View>
        )}
        {inner}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Bouton CTA ───────────────────────────────────────────────────────────────
export function Cta({ label, onPress, disabled }) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }
  return (
    <TouchableOpacity
      style={[styles.cta, disabled && styles.ctaDisabled]}
      onPress={disabled ? undefined : handlePress}
      activeOpacity={disabled ? 1 : 0.85}
    >
      <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Typewriter avec mascot (steps 2, 4, 6) ──────────────────────────────────
export function TypewriterChat({ message, onDone, speed = 32, highlight }) {
  const { displayed, done } = useTypewriter(message, speed, onDone);

  const hlStart = highlight ? message.indexOf(highlight) : -1;
  const hlEnd   = hlStart >= 0 ? hlStart + highlight.length : -1;

  function renderText() {
    const text = displayed || '';
    if (hlStart === -1 || text.length <= hlStart) {
      return <Text style={chatStyles.sideBubbleText}>{text}<Cursor visible={!done} /></Text>;
    }
    const before      = text.slice(0, hlStart);
    const highlighted = text.slice(hlStart, Math.min(text.length, hlEnd));
    const after       = text.slice(hlEnd);
    return (
      <Text style={chatStyles.sideBubbleText}>
        {before}
        <Text style={{ color: BLUE, fontWeight: '800' }}>{highlighted}</Text>
        {after}
        <Cursor visible={!done} />
      </Text>
    );
  }

  return (
    <View style={chatStyles.sideContainer}>
      <View style={chatStyles.sideRow}>
        <TricolorMark size="lg" />
        <View style={chatStyles.sideBubble}>{renderText()}</View>
      </View>
    </View>
  );
}

// ─── Confetti burst ───────────────────────────────────────────────────────────
function BubbleConfetti() {
  const anims = useRef(
    Array.from({ length: NB_CONFETTI }, () => ({
      x: new Animated.Value(0), y: new Animated.Value(0),
      op: new Animated.Value(1), r: new Animated.Value(0),
    }))
  ).current;

  const pieces = useRef(
    Array.from({ length: NB_CONFETTI }, (_, i) => ({
      tx:    (Math.random() - 0.5) * 500,
      ty:    -(80 + Math.random() * 280),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      delay: Math.random() * 200,
      dur:   800 + Math.random() * 700,
      spin:  Math.random() > 0.5 ? '900deg' : '-720deg',
    }))
  ).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      const { tx, ty, delay, dur } = pieces[i];
      Animated.parallel([
        Animated.timing(anim.x,  { toValue: tx, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(anim.y,  { toValue: ty, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(anim.r,  { toValue: 1,  duration: dur, delay, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(delay + dur * 0.4),
          Animated.timing(anim.op, { toValue: 0, duration: dur * 0.6, useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, []);

  return (
    <View style={{ position: 'absolute', bottom: 10, left: '50%' }} pointerEvents="none">
      {anims.map((anim, i) => {
        const { shape, color, spin } = pieces[i];
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: shape.w, height: shape.h, borderRadius: shape.br,
              backgroundColor: color,
              opacity: anim.op,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                { rotate: anim.r.interpolate({ inputRange: [0, 1], outputRange: ['0deg', spin] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Intro step 0 : centré, bulle pleine largeur ──────────────────────────────
export function IntroChat({ msgIndex, onDone }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const isLast = msgIndex === LAST_INTRO_IDX;

  useEffect(() => {
    if (isLast) setShowConfetti(true);
  }, [msgIndex]);

  const { displayed, done } = useTypewriter(INTRO_MESSAGES[msgIndex], 32, onDone);

  const hlWord  = isLast ? HIGHLIGHT_INTRO : (msgIndex === 2 ? HIGHLIGHT_INTRO2 : null);
  const hlColor = '#4A85E8';
  const fullMsg = INTRO_MESSAGES[msgIndex];
  const hlStart = hlWord ? fullMsg.indexOf(hlWord) : -1;
  const hlEnd   = hlStart >= 0 ? hlStart + hlWord.length : -1;

  function renderText() {
    const text = displayed || '';
    if (hlStart === -1 || text.length <= hlStart) {
      return <Text style={chatStyles.centerBubbleText}>{text}<Cursor visible={!done} /></Text>;
    }
    const before      = text.slice(0, hlStart);
    const highlighted = text.slice(hlStart, Math.min(text.length, hlEnd));
    const after       = text.slice(hlEnd);
    return (
      <Text style={chatStyles.centerBubbleText}>
        {before}
        <Text style={{ color: hlColor, fontWeight: '800' }}>{highlighted}</Text>
        {after}
        <Cursor visible={!done} />
      </Text>
    );
  }

  return (
    <View style={chatStyles.centerContainer}>
      <TricolorMark size="lg" style={{ marginBottom: SPACING.xl }} />
      <View style={{ position: 'relative', width: '100%' }}>
        {showConfetti && <BubbleConfetti />}
        <View style={chatStyles.centerBubble}>{renderText()}</View>
      </View>
    </View>
  );
}

// ─── Écran de chargement animé (step 7) ──────────────────────────────────────
export function LoadingStep({ loadingAnim }) {
  const [dots, setDots] = useState('');

  const flagAnim   = useRef(new Animated.Value(0)).current;
  const labelAnim  = useRef(new Animated.Value(0)).current;
  const barAnim    = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const pulse      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(flagAnim,   { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.spring(labelAnim,  { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.spring(barAnim,    { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.spring(bottomAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.12, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
        ])
      ).start();
    });

    let i = 0;
    const t = setInterval(() => { i = (i + 1) % 4; setDots('.'.repeat(i)); }, 450);
    return () => clearInterval(t);
  }, []);

  const slideIn = (anim) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  return (
    <View style={styles.centerFull}>
      <Animated.View style={[{ marginBottom: 8 }, slideIn(flagAnim), { transform: [
        { scale: pulse },
        { translateY: flagAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
      ]}]}>
        <TricolorMark size="lg" />
      </Animated.View>

      <Animated.View style={slideIn(labelAnim)}>
        <Text style={styles.loadingLabel}>PRÉPARATION DE TON PROGRAMME{dots}</Text>
      </Animated.View>

      <Animated.View style={[{ width: '100%' }, { opacity: barAnim }]}>
        <View style={styles.loadingBarTrack}>
          <Animated.View
            style={[styles.loadingBarFill, {
              width: loadingAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]}
          />
        </View>
      </Animated.View>

      <Animated.View style={slideIn(bottomAnim)}>
        <Text style={styles.loadingText}>
          Rejoins les candidats qui{'\n'}se préparent avec{' '}
          <Text style={{ color: ACCENT, fontWeight: '900' }}>ConcoursPolice</Text> !
        </Text>
      </Animated.View>
    </View>
  );
}

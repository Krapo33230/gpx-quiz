import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
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

// ─── Step 9 : Notifications — Cercle de rappel ───────────────────────────────
const HOURS   = [7, 8, 12, 17, 18, 19, 20, 21, 22];
const CIRCLE  = 280;
const CX      = CIRCLE / 2;
const R_CHIP  = 118;
const CHIP_W  = 48;
const CHIP_H  = 30;

export function NotifStep9({ hour, onHourChange }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 80, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1,  duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
      <View style={ns.scroll}>

        <Text style={ns.title}>🔔 ORDRE DE RAPPEL</Text>
        <Text style={ns.subtitle}>
          CONVOCATION QUOTIDIENNE :{' '}
          <Text style={ns.subtitleBold}>10 minutes</Text> d'engagement pour votre progression.
        </Text>

        {/* Cercle heures + cloche */}
        <View style={ns.circleWrap}>
          {/* Anneaux lumineux */}
          <View style={[ns.ring, { width: CIRCLE,      height: CIRCLE,      borderRadius: CIRCLE / 2,      borderColor: 'rgba(245,158,11,0.10)', top: 0,  left: 0  }]} />
          <View style={[ns.ring, { width: CIRCLE - 44, height: CIRCLE - 44, borderRadius: (CIRCLE-44) / 2, borderColor: 'rgba(245,158,11,0.20)', top: 22, left: 22 }]} />
          <View style={[ns.ring, { width: CIRCLE - 88, height: CIRCLE - 88, borderRadius: (CIRCLE-88) / 2, borderColor: 'rgba(245,158,11,0.35)', top: 44, left: 44 }]} />

          {/* Cloche centrale */}
          <Animated.View style={[ns.bellWrap, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={ns.bell}>🔔</Text>
          </Animated.View>

          {/* Chips d'heures en cercle */}
          {HOURS.map((h, i) => {
            const angle    = (i / HOURS.length) * 2 * Math.PI - Math.PI / 2;
            const left     = CX + Math.cos(angle) * R_CHIP - CHIP_W / 2;
            const top      = CX + Math.sin(angle) * R_CHIP - CHIP_H / 2;
            const selected = hour === h;
            return (
              <TouchableOpacity
                key={h}
                style={[ns.chip, { left, top }, selected && ns.chipSelected]}
                onPress={() => onHourChange?.(h)}
                activeOpacity={0.7}
              >
                <Text style={[ns.chipText, selected && ns.chipTextSelected]}>{h}h</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Streak hint */}
        <View style={ns.streakRow}>
          <Text style={ns.streakText}>🔥 Série de rappel : activez pour l'allumer.</Text>
        </View>

      </View>
    </Animated.View>
  );
}

const ns = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 20, alignItems: 'center' },

  title:        { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' },
  subtitle:     { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  subtitleBold: { fontWeight: '800', color: '#F0F4FF' },

  circleWrap: { width: CIRCLE, height: CIRCLE, position: 'relative', marginBottom: 24 },

  ring: { position: 'absolute', borderWidth: 1.5 },

  bellWrap: {
    position: 'absolute',
    width: 86, height: 86,
    top: CX - 43, left: CX - 43,
    borderRadius: 43,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(245,158,11,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: { fontSize: 36 },

  chip: {
    position: 'absolute',
    width: CHIP_W, height: CHIP_H,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected:     { backgroundColor: 'rgba(245,158,11,0.2)', borderColor: '#F59E0B' },
  chipText:         { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  chipTextSelected: { color: '#FCD34D', fontWeight: '900' },

  streakRow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  streakText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textAlign: 'center' },
});

// ─── Écran de chargement animé (step 7) ──────────────────────────────────────
export function LoadingStep() {
  const [dots, setDots] = useState('');

  const textOp = useRef(new Animated.Value(0)).current;
  const textY  = useRef(new Animated.Value(24)).current;
  const barOp  = useRef(new Animated.Value(0)).current;
  const barW   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOp, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
      Animated.timing(textY,  { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
      Animated.timing(barOp,  { toValue: 1, duration: 400, delay: 600, useNativeDriver: true }),
      Animated.timing(barW,   { toValue: 1, duration: 1500, delay: 600, useNativeDriver: false }),
    ]).start();

    let i = 0;
    const t = setInterval(() => { i = (i + 1) % 4; setDots('.'.repeat(i)); }, 450);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={ls.root}>
      <Animated.View style={[ls.content, { opacity: textOp, transform: [{ translateY: textY }] }]}>
        <Text style={ls.label}>ON PRÉPARE{'\n'}TON PROGRAMME{dots}</Text>
        <Animated.View style={{ width: '100%', opacity: barOp, marginTop: 28 }}>
          <View style={ls.barTrack}>
            <Animated.View style={[ls.barFill, {
              width: barW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const ls = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  label: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F0F4FF',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 30,
  },
  barTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#1A4AFF',
  },
});

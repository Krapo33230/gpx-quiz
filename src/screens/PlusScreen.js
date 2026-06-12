import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserName, getXP, getLevelInfo, clearAll, getProgressionMatiere } from '../utils/storage';
import { CATEGORIES } from '../data/questions';
import { TricolorMark } from '../components/ui';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

const MATIERES_ORDER = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS', 'MONDE'];

export default function PlusScreen({ navigation }) {
  const [userName,    setUserName]    = useState('');
  const [xpInfo,      setXpInfo]      = useState(null);
  const [darkMode,    setDarkMode]    = useState(true);
  const [notifs,      setNotifs]      = useState(false);
  const [progression, setProgression] = useState({});

  async function loadAll() {
    const [name, xp, prog] = await Promise.all([getUserName(), getXP(), getProgressionMatiere()]);
    setUserName(name || 'Candidat');
    setXpInfo(getLevelInfo(xp));
    setProgression(prog);
  }

  useEffect(() => {
    loadAll();
    const unsub = navigation.addListener('focus', loadAll);
    return unsub;
  }, [navigation]);

  function handleReset() {
    Alert.alert(
      'Réinitialiser ?',
      'Toutes tes statistiques et progression seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', style: 'destructive', onPress: async () => {
          await clearAll();
          navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        } },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Plus</Text>

        {/* ── Profil ── */}
        <Text style={styles.sectionLabel}>MON PROFIL</Text>
        <View style={styles.profileCard}>
          <TricolorMark size="md" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            {xpInfo && (
              <Text style={styles.profileLevel}>
                {xpInfo.level.emoji} {xpInfo.level.name} · {xpInfo.xp} XP
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Niveaux' })}
          >
            <Text style={styles.profileBtnText}>Grades →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Progression par matière ── */}
        <Text style={styles.sectionLabel}>PROGRESSION</Text>
        <View style={styles.section}>
          {MATIERES_ORDER.map((key, index, arr) => {
            const cat = CATEGORIES[key];
            if (!cat) return null;
            const pct = progression[key] ?? 0;
            return (
              <View
                key={key}
                style={[styles.matiereRow, index < arr.length - 1 && styles.rowBorder]}
              >
                <Text style={styles.matiereEmoji}>{cat.emoji}</Text>
                <MatiereBar label={cat.label} color={cat.color} pct={pct} />
              </View>
            );
          })}
        </View>

        {/* ── Outils ── */}
        <Text style={styles.sectionLabel}>OUTILS</Text>
        <View style={styles.section}>
          {[
            { label: 'Auto-évaluation', subtitle: 'Diagnostique tes points faibles', icon: '🎯', route: 'AutoEval' },
            { label: 'Lexique police',  subtitle: 'Termes clés de la Police Nationale', icon: '📖', route: 'Lexique' },
            { label: 'Statistiques',   subtitle: 'Historique et performances',          icon: '📊', route: 'Resultats' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.row, index < arr.length - 1 && styles.rowBorder]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowIcon}>{item.icon}</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.rowArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Paramètres ── */}
        <Text style={styles.sectionLabel}>PARAMÈTRES</Text>
        <View style={styles.section}>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowIcon}>🌙</Text>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Mode sombre</Text>
              <Text style={styles.rowSubtitle}>Activé par défaut</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#2A3A52', true: '#1A3F7A' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowIcon}>🔔</Text>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Rappels d'entraînement</Text>
              <Text style={styles.rowSubtitle}>Notifications quotidiennes</Text>
            </View>
            <Switch
              value={notifs}
              onValueChange={setNotifs}
              trackColor={{ false: '#2A3A52', true: '#1A3F7A' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Légal ── */}
        <Text style={styles.sectionLabel}>LÉGAL</Text>
        <View style={styles.section}>
          {[
            { label: 'Conditions d\'utilisation', icon: '📄', route: 'CGU' },
            { label: 'Politique de confidentialité', icon: '🔒', route: 'Confidentialite' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.row, index < arr.length - 1 && styles.rowBorder]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowIcon}>{item.icon}</Text>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Danger zone ── */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetText}>🗑  Réinitialiser mes données</Text>
        </TouchableOpacity>

        <Text style={styles.version}>ConcoursPolice · v1.0</Text>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MatiereBar ───────────────────────────────────────────────────────────────
function MatiereBar({ label, color, pct }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct / 100, duration: 700, useNativeDriver: false }).start();
  }, [pct]);

  const barColor =
    pct >= 75 ? COLORS.success :
    pct >= 50 ? COLORS.warning :
    pct > 0   ? color :
    '#1E2F48';

  return (
    <View style={styles.matiereContent}>
      <View style={styles.matiereHeader}>
        <Text style={styles.matiereLabel}>{label}</Text>
        <Text style={[styles.matierePct, { color: pct > 0 ? barColor : 'rgba(255,255,255,0.2)' }]}>
          {pct > 0 ? `${pct}%` : '—'}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: barColor,
              width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0E1829' },
  scroll:   { paddingHorizontal: 20, paddingBottom: 32 },

  header: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 24, marginBottom: 20 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.2, marginBottom: 8, marginTop: 4,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  profileInfo:    { flex: 1 },
  profileName:    { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  profileLevel:   { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  profileBtn:     { backgroundColor: '#1A3F7A', borderRadius: RADIUS.pill, paddingHorizontal: 12, paddingVertical: 6 },
  profileBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  section: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  rowIcon:     { fontSize: 20 },
  rowContent:  { flex: 1 },
  rowLabel:    { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  rowSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  rowArrow:    { fontSize: 16, color: 'rgba(255,255,255,0.3)' },

  matiereRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 12 },
  matiereEmoji:   { fontSize: 18, width: 26 },
  matiereContent: { flex: 1 },
  matiereHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  matiereLabel:   { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  matierePct:     { fontSize: 13, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: RADIUS.pill, backgroundColor: '#1E2F48', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: RADIUS.pill },

  resetBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(232,64,64,0.4)',
    marginBottom: 20,
  },
  resetText: { fontSize: 14, fontWeight: '600', color: '#E84040' },

  version: { fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 4 },
});

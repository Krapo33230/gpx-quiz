import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserName, getXP, getLevelInfo, clearAll, getProgressionMatiere, getStats } from '../utils/storage';
import { CATEGORIES } from '../data/questions';
import { TricolorMark } from '../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../theme/colors';

const MATIERES_ORDER = ['DROIT', 'CULTURE', 'LOGIQUE', 'SECURITE', 'FRANÇAIS', 'MONDE'];

export default function PlusScreen({ navigation }) {
  const [userName,    setUserName]    = useState('');
  const [xpInfo,      setXpInfo]      = useState(null);
  const [darkMode,    setDarkMode]    = useState(true);
  const [notifs,      setNotifs]      = useState(false);
  const [progression, setProgression] = useState({});
  const [dispOp,      setDispOp]      = useState(null);

  async function loadAll() {
    const [name, xp, prog, stats] = await Promise.all([
      getUserName(), getXP(), getProgressionMatiere(), getStats(),
    ]);
    setUserName(name || 'Candidat');
    setXpInfo(getLevelInfo(xp));
    setProgression(prog);
    if (stats && stats.totalQuestions > 0) {
      setDispOp(Math.round((stats.totalCorrect / stats.totalQuestions) * 100));
    }
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

  const matricule = userName
    ? `#${(userName.charCodeAt(0) * 137 + 10000).toString().slice(0, 5)}`
    : '#—————';

  const dispOpColor =
    dispOp === null ? 'rgba(255,255,255,0.25)' :
    dispOp >= 75    ? COLORS.success :
    dispOp >= 50    ? COLORS.warning :
    COLORS.danger;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Mon Dossier</Text>

        {/* ── Fiche Matricule ── */}
        <Text style={styles.sectionLabel}>FICHE MATRICULE</Text>
        <View style={styles.ficheCard}>
          <LinearGradient
            colors={['#1A4AFF', '#002395']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ficheHeader}
          >
            <Text style={styles.ficheHeaderLabel}>POLICE NATIONALE — CONCOURS GP</Text>
            <Text style={styles.ficheRef}>Réf: CGP-2026</Text>
          </LinearGradient>

          <View style={styles.ficheBody}>
            <TricolorMark size="lg" />
            <View style={styles.ficheInfo}>
              <Text style={styles.ficheName}>{userName}</Text>
              <Text style={styles.ficheMatricule}>Matricule {matricule}</Text>
              {xpInfo && (
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeBadgeText}>
                    {xpInfo.level.emoji}  {xpInfo.level.name.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.ficheFooter}>
            <View style={styles.ficheStatBlock}>
              <Text style={styles.ficheStatLabel}>DISPONIBILITÉ OPÉ.</Text>
              <Text style={[styles.ficheStatValue, { color: dispOpColor }]}>
                {dispOp !== null ? `${dispOp}%` : '—'}
              </Text>
            </View>
            <View style={styles.ficheSep} />
            <View style={styles.ficheStatBlock}>
              <Text style={styles.ficheStatLabel}>STATUT DOSSIER</Text>
              <Text style={styles.ficheStatValue}>En instruction</Text>
            </View>
            <View style={styles.ficheSep} />
            <View style={styles.ficheStatBlock}>
              <Text style={styles.ficheStatLabel}>POINTS XP</Text>
              <Text style={styles.ficheStatValue}>⚡ {xpInfo?.xp ?? 0}</Text>
            </View>
          </View>
        </View>

        {/* ── État de service ── */}
        <Text style={styles.sectionLabel}>ÉTAT DE SERVICE</Text>
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

        {/* ── Mallette pédagogique ── */}
        <Text style={styles.sectionLabel}>MALLETTE PÉDAGOGIQUE</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={() => navigation.navigate('Quiz', { mode: { id: 'concoursBlanc' } })}
            activeOpacity={0.7}
          >
            <Text style={styles.rowIcon}>🏛️</Text>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Concours Blanc</Text>
              <Text style={styles.rowSubtitle}>Simulateur d'examen — 40 questions · 45 min</Text>
            </View>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>
          {[
            { label: 'Auto-évaluation', subtitle: 'Diagnostique tes points faibles',       icon: '🎯', route: 'AutoEval'  },
            { label: 'Lexique police',  subtitle: 'Termes clés de la Police Nationale',     icon: '📖', route: 'Lexique'   },
            { label: 'Statistiques',   subtitle: 'Historique et performances',              icon: '📊', route: 'Resultats' },
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
          <View style={[styles.row, { opacity: 0.4 }]}>
            <Text style={styles.rowIcon}>📓</Text>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Carnet d'erreurs</Text>
              <Text style={styles.rowSubtitle}>Questions ratées à retravailler</Text>
            </View>
            <View style={styles.bientotPill}><Text style={styles.bientotText}>Bientôt</Text></View>
          </View>
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
              trackColor={{ false: '#2A3A52', true: '#1A4AFF' }}
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
              trackColor={{ false: '#2A3A52', true: '#1A4AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Légal ── */}
        <Text style={styles.sectionLabel}>LÉGAL</Text>
        <View style={styles.section}>
          {[
            { label: 'Conditions d\'utilisation',    icon: '📄', route: 'CGU' },
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

        <Text style={styles.version}>ConcoursPolice · v1.0 · Document confidentiel — Usage interne</Text>
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

  const statusLabel =
    pct >= 75 ? 'Maîtrisé'    :
    pct >= 50 ? 'À renforcer' :
    pct > 0   ? 'En cours'    :
    '—';

  const statusColor =
    pct >= 75 ? COLORS.success :
    pct >= 50 ? COLORS.warning :
    pct > 0   ? 'rgba(255,255,255,0.4)' :
    'rgba(255,255,255,0.2)';

  return (
    <View style={styles.matiereContent}>
      <View style={styles.matiereHeader}>
        <Text style={styles.matiereLabel}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.matiereStatus, { color: statusColor }]}>{statusLabel}</Text>
          <Text style={[styles.matierePct, { color: pct > 0 ? barColor : 'rgba(255,255,255,0.2)' }]}>
            {pct > 0 ? `${pct}%` : ''}
          </Text>
        </View>
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
  safeArea: { flex: 1, backgroundColor: '#0F0F0F' },
  scroll:   { paddingHorizontal: 20, paddingBottom: 32 },

  header: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 24, marginBottom: 20 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2, marginBottom: 8, marginTop: 4,
  },

  // ── Fiche Matricule ──────────────────────────────────────────────────────────
  ficheCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: RADIUS.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A4AFF',
    overflow: 'hidden',
  },
  ficheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ficheHeaderLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.2 },
  ficheRef:         { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.8 },

  ficheBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  ficheInfo:      { flex: 1 },
  ficheName:      { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 3 },
  ficheMatricule: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '600', letterSpacing: 0.8, marginBottom: 10 },
  gradeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(26,74,255,0.25)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(26,74,255,0.5)',
  },
  gradeBadgeText: { fontSize: 11, fontWeight: '800', color: '#A0B8FF', letterSpacing: 0.8 },

  ficheFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
  },
  ficheStatBlock: { flex: 1, alignItems: 'center', gap: 4 },
  ficheStatLabel: { fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 1 },
  ficheStatValue: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  ficheSep:       { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  // ── Sections génériques ──────────────────────────────────────────────────────
  section: {
    backgroundColor: '#1C1C1E',
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
  rowSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  rowArrow:    { fontSize: 16, color: 'rgba(255,255,255,0.3)' },

  bientotPill: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 3 },
  bientotText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },

  // ── État de service ──────────────────────────────────────────────────────────
  matiereRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 12 },
  matiereEmoji:   { fontSize: 18, width: 26 },
  matiereContent: { flex: 1 },
  matiereHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  matiereLabel:   { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  matiereStatus:  { fontSize: 11, fontWeight: '700' },
  matierePct:     { fontSize: 13, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: RADIUS.pill, backgroundColor: '#1E2F48', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: RADIUS.pill },

  // ── Reset ────────────────────────────────────────────────────────────────────
  resetBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(232,64,64,0.4)',
    marginBottom: 20,
  },
  resetText: { fontSize: 14, fontWeight: '600', color: '#E84040' },

  version: { fontSize: 10, color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: 4, letterSpacing: 0.5 },
});

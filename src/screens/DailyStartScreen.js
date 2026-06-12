import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RADIUS, SPACING } from '../theme/colors';
import { getUserName, getStreak } from '../utils/storage';
import { TricolorMark } from '../components/ui';

export default function DailyStartScreen({ navigation }) {
  const [name,   setName]   = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    Promise.all([getUserName(), getStreak()]).then(([n, s]) => {
      setName(n || '');
      setStreak(s.currentStreak);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.top}>
          <TricolorMark size="lg" />
          <Text style={styles.greeting}>
            {name ? `Bonjour, ${name} ! 👋` : 'Bonjour ! 👋'}
          </Text>
          <Text style={styles.subtitle}>Que veux-tu faire aujourd'hui ?</Text>
          {streak > 0 && (
            <View style={styles.streakChip}>
              <Text style={styles.streakText}>
                🔥 Série de {streak} jour{streak > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryCard}
            onPress={() => navigation.navigate('Main', { screen: 'ChoixMode' })}
            activeOpacity={0.85}
          >
            <Text style={styles.cardIcon}>🚀</Text>
            <View style={styles.cardText}>
              <Text style={styles.primaryLabel}>Commencer l'entraînement</Text>
              <Text style={styles.primarySub}>Choisis ta matière ou un mode rapide</Text>
            </View>
            <Text style={styles.arrowDark}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineCard}
            onPress={() => navigation.navigate('AutoEval')}
            activeOpacity={0.85}
          >
            <Text style={styles.cardIcon}>🎯</Text>
            <View style={styles.cardText}>
              <Text style={styles.outlineLabel}>Faire mon auto-évaluation</Text>
              <Text style={styles.outlineSub}>Diagnostique tes points faibles</Text>
            </View>
            <Text style={styles.arrowLight}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dashLink}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.6}
        >
          <Text style={styles.dashLinkText}>Accéder à mon tableau de bord →</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0E1829' },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    gap: 32,
  },

  top: { alignItems: 'center', gap: 12 },
  greeting: {
    fontSize: 28, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', marginTop: SPACING.md,
  },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  streakChip: {
    backgroundColor: '#1A2A0A',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2A4A0A',
    marginTop: 4,
  },
  streakText: { fontSize: 14, color: '#7DDB3A', fontWeight: '700' },

  actions: { gap: 12 },

  primaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 18,
    gap: 14,
  },
  outlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1E2F48',
  },
  cardIcon:     { fontSize: 28 },
  cardText:     { flex: 1 },
  primaryLabel: { fontSize: 16, fontWeight: '800', color: '#0E1829' },
  primarySub:   { fontSize: 12, color: 'rgba(14,24,41,0.5)', marginTop: 3 },
  outlineLabel: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  outlineSub:   { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 },
  arrowDark:    { fontSize: 18, color: 'rgba(14,24,41,0.4)', fontWeight: '700' },
  arrowLight:   { fontSize: 18, color: 'rgba(255,255,255,0.25)', fontWeight: '700' },

  dashLink:     { alignItems: 'center', paddingVertical: 8 },
  dashLinkText: { fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: '600' },
});

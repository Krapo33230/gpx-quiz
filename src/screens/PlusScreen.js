import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStats } from '../utils/storage';

export default function PlusScreen({ navigation }) {
  const [sessions, setSessions] = useState(0);

  async function loadStats() {
    const s = await getStats();
    setSessions(s.sessions ?? 0);
  }

  useEffect(() => {
    loadStats();
    const unsub = navigation.addListener('focus', loadStats);
    return unsub;
  }, [navigation]);

  const items = [
    {
      label: 'Auto-évaluation',
      subtitle: 'Diagnostique tes points faibles',
      icon: '🎯',
      route: 'AutoEval',
      enabled: true,
    },
    {
      label: 'Lexique',
      subtitle: 'Termes clés de la Police Nationale',
      icon: '📖',
      route: 'Lexique',
      enabled: true,
    },
    {
      label: 'Résultats',
      subtitle: 'Historique et statistiques',
      icon: '📊',
      route: 'Resultats',
      enabled: sessions > 0,
      disabledHint: 'Commence une session pour voir tes stats',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Plus</Text>

        <View style={styles.section}>
          {items.map((item, index) => {
            const isEnabled = item.enabled;
            return (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.row,
                  index < items.length - 1 && styles.rowBorder,
                  !isEnabled && styles.rowDisabled,
                ]}
                onPress={() => isEnabled && navigation.navigate(item.route)}
                activeOpacity={isEnabled ? 0.7 : 1}
              >
                <Text style={styles.rowIcon}>{item.icon}</Text>
                <View style={styles.rowContent}>
                  <Text style={[styles.rowLabel, !isEnabled && styles.textDisabled]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.rowSubtitle, !isEnabled && styles.textDisabled]}>
                    {!isEnabled && item.disabledHint ? item.disabledHint : item.subtitle}
                  </Text>
                </View>
                <Text style={[styles.rowArrow, !isEnabled && styles.textDisabled]}>→</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E1829',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 28,
  },
  section: {
    backgroundColor: '#162034',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  rowArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 8,
  },
  textDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
});

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme/colors';
import { LEXIQUE } from '../data/lexique';

export default function LexiqueScreen({ navigation }) {
  const [query, setQuery]       = useState('');
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return LEXIQUE;
    return LEXIQUE.map(section => ({
      ...section,
      termes: section.termes.filter(
        t =>
          t.terme.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q),
      ),
    })).filter(s => s.termes.length > 0);
  }, [query]);

  const totalTermes = LEXIQUE.reduce((acc, s) => acc + s.termes.length, 0);

  function toggle(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.titre}>Lexique police</Text>
        <Text style={styles.sousTitre}>{totalTermes} termes essentiels</Text>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un terme…"
          placeholderTextColor={COLORS.textDisabled}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Aucun terme trouvé pour "{query}"</Text>
          </View>
        ) : (
          filtered.map(section => (
            <View key={section.section} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>{section.emoji}</Text>
                <Text style={styles.sectionTitre}>{section.section}</Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{section.termes.length}</Text>
                </View>
              </View>

              {section.termes.map((item, idx) => {
                const key = `${section.section}-${idx}`;
                const open = !!expanded[key];
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.termRow, open && styles.termRowOpen]}
                    onPress={() => toggle(key)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.termTop}>
                      <Text style={[styles.termeName, open && styles.termeNameOpen]}>
                        {item.terme}
                      </Text>
                      <Text style={styles.termeCaret}>{open ? '▲' : '▼'}</Text>
                    </View>
                    {open && (
                      <Text style={styles.termeDefinition}>{item.definition}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn:   { marginBottom: SPACING.sm },
  backText:  { ...FONTS.body, color: COLORS.primary, fontWeight: '600' },
  titre:     { ...FONTS.h1, color: COLORS.text },
  sousTitre: { ...FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.text,
    paddingVertical: 0,
  },

  scroll: { paddingHorizontal: SPACING.lg },

  emptyWrap: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyText: { ...FONTS.body, color: COLORS.textDisabled },

  section: { marginBottom: SPACING.lg },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitre: { ...FONTS.h3, color: COLORS.text, flex: 1 },
  sectionBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  sectionBadgeText: { ...FONTS.xs, color: COLORS.white, fontWeight: '700' },

  termRow: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  termRowOpen: {
    backgroundColor: '#EEF3FF',
    borderColor: COLORS.primaryLight,
    ...SHADOWS.card,
  },
  termTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  termeName: {
    ...FONTS.sm,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  termeNameOpen: { color: COLORS.primary },
  termeCaret: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  termeDefinition: {
    ...FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
});

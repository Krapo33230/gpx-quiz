import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RADIUS, SPACING } from '../theme/colors';

// ─── Données statiques ────────────────────────────────────────────────────────

const ETAPES = [
  {
    num: '1',
    titre: 'Vérifier les conditions',
    detail: 'Nationalité française · Casier judiciaire vierge (bulletin n°2) · Permis B · Entre 17 et 35 ans · Aptitude physique et médicale',
  },
  {
    num: '2',
    titre: 'S\'inscrire en ligne',
    detail: 'Créer un compte sur concours.interieur.gouv.fr et remplir le dossier d\'inscription pendant la période ouverte.',
  },
  {
    num: '3',
    titre: 'Épreuves écrites',
    detail: 'Composition française · Questionnaire de culture générale · Exercices logiques et numériques. Durée : environ 4h.',
  },
  {
    num: '4',
    titre: 'Épreuves sportives (EPS)',
    detail: 'Course de vitesse, endurance, exercices physiques. Les seuils varient selon le sexe et l\'âge.',
  },
  {
    num: '5',
    titre: 'Tests psychotechniques',
    detail: 'Évaluation de la personnalité, aptitudes cognitives et compatibilité avec les missions de police.',
  },
  {
    num: '6',
    titre: 'Entretien avec le jury',
    detail: 'Entretien de motivation, présentation du parcours, questions sur l\'institution policière.',
  },
  {
    num: '7',
    titre: 'Admis(e) → École de police',
    detail: '12 mois de formation rémunérée au Centre National de Formation (CNF). Statut de fonctionnaire stagiaire.',
  },
];

const FAQ = [
  {
    q: 'Quel niveau d\'études est requis ?',
    r: 'Aucun diplôme n\'est exigé. Le concours est ouvert à tous les niveaux à partir du bac ou sans bac.',
  },
  {
    q: 'Quelle est la limite d\'âge ?',
    r: '17 ans minimum à la date de clôture des inscriptions, 35 ans maximum (des dérogations existent pour certains militaires ou anciens policiers).',
  },
  {
    q: 'Le permis de conduire est-il obligatoire ?',
    r: 'Oui, le permis B est obligatoire pour intégrer la formation. Il doit être obtenu avant l\'entrée à l\'école.',
  },
  {
    q: 'Peut-on repasser le concours si on échoue ?',
    r: 'Oui, le nombre de tentatives n\'est pas limité tant que les conditions d\'âge et de nationalité sont respectées.',
  },
  {
    q: 'Quelle est la durée de formation ?',
    r: '12 mois rémunérés à l\'école de police. Le stagiaire perçoit environ 1 400 €/mois net pendant la formation.',
  },
  {
    q: 'Où se déroulent les épreuves ?',
    r: 'Les épreuves écrites et physiques ont lieu dans plusieurs centres en France selon votre zone d\'inscription.',
  },
  {
    q: 'Le concours a-t-il lieu plusieurs fois par an ?',
    r: 'Oui, en général 1 à 2 sessions par an selon les besoins du ministère de l\'Intérieur. Consultez le Journal Officiel.',
  },
];

const DATES_INFO = [
  { icon: '📋', label: 'Inscriptions', value: 'Suivre le Journal Officiel', sub: 'Les dates varient chaque session' },
  { icon: '✍️', label: 'Épreuves écrites', value: 'Quelques semaines après la clôture des inscriptions', sub: '' },
  { icon: '🏃', label: 'Épreuves sportives', value: 'Après les écrits', sub: 'Convocation individuelle' },
  { icon: '📢', label: 'Résultats', value: 'Publiés sur le site officiel', sub: 'Délai variable selon session' },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setOpen(v => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{item.q}</Text>
        <Text style={styles.faqChevron}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && <Text style={styles.faqR}>{item.r}</Text>}
    </TouchableOpacity>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.pageTitle}>Infos Concours</Text>
        <Text style={styles.pageSubtitle}>Gardien de la Paix · Police Nationale</Text>

        {/* ── Dates clés ── */}
        <SectionTitle>📅  Dates & Résultats</SectionTitle>
        <View style={styles.datesCard}>
          {DATES_INFO.map((d, i) => (
            <View key={i} style={[styles.dateRow, i < DATES_INFO.length - 1 && styles.dateRowBorder]}>
              <Text style={styles.dateIcon}>{d.icon}</Text>
              <View style={styles.dateContent}>
                <Text style={styles.dateLabel}>{d.label}</Text>
                <Text style={styles.dateValue}>{d.value}</Text>
                {d.sub ? <Text style={styles.dateSub}>{d.sub}</Text> : null}
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.officialBtn}
            onPress={() => Linking.openURL('https://concours.interieur.gouv.fr')}
            activeOpacity={0.8}
          >
            <Text style={styles.officialBtnText}>🌐  Voir le site officiel</Text>
          </TouchableOpacity>
        </View>

        {/* ── Étapes ── */}
        <SectionTitle>🗺️  Les étapes du concours</SectionTitle>
        {ETAPES.map((e, i) => (
          <View key={i} style={styles.etapeRow}>
            <View style={styles.etapeLeft}>
              <View style={styles.etapeNum}>
                <Text style={styles.etapeNumText}>{e.num}</Text>
              </View>
              {i < ETAPES.length - 1 && <View style={styles.etapeLine} />}
            </View>
            <View style={styles.etapeContent}>
              <Text style={styles.etapeTitre}>{e.titre}</Text>
              <Text style={styles.etapeDetail}>{e.detail}</Text>
            </View>
          </View>
        ))}

        {/* ── FAQ ── */}
        <SectionTitle>❓  Questions fréquentes</SectionTitle>
        <View style={styles.faqCard}>
          {FAQ.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </View>

        {/* ── Lien JO ── */}
        <TouchableOpacity
          style={styles.joBtn}
          onPress={() => Linking.openURL('https://www.legifrance.gouv.fr')}
          activeOpacity={0.8}
        >
          <Text style={styles.joBtnText}>📰  Consulter le Journal Officiel</Text>
          <Text style={styles.joBtnSub}>Pour les dates officielles de la prochaine session</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#0E1829' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },

  pageTitle:    { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 24, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, fontWeight: '600', letterSpacing: 0.4 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },

  // Dates card
  datesCard: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 28,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dateRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  dateIcon:    { fontSize: 20, marginTop: 2 },
  dateContent: { flex: 1 },
  dateLabel:   { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.45)', marginBottom: 3, letterSpacing: 0.4 },
  dateValue:   { fontSize: 15, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
  dateSub:     { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  officialBtn: {
    margin: 12,
    backgroundColor: '#1A3F7A',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  officialBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Étapes
  etapeRow: {
    flexDirection: 'row',
    marginBottom: 0,
    gap: 14,
  },
  etapeLeft: { alignItems: 'center', width: 32 },
  etapeNum: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1A3F7A',
    alignItems: 'center', justifyContent: 'center',
  },
  etapeNumText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  etapeLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(26,63,122,0.4)',
    marginVertical: 4,
    minHeight: 20,
  },
  etapeContent: {
    flex: 1,
    paddingBottom: 20,
  },
  etapeTitre:  { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  etapeDetail: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 19 },

  // FAQ
  faqCard: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 20,
  },
  faqItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  faqHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  faqQ:       { flex: 1, fontSize: 14, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
  faqChevron: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  faqR:       { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 20, marginTop: 10 },

  // Bouton JO
  joBtn: {
    backgroundColor: '#162034',
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  joBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  joBtnSub:  { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
});

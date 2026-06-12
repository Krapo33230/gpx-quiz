import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfidentialiteScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={s.title}>Politique de confidentialité</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>Dernière mise à jour : juin 2026</Text>

        <Section title="1. Responsable du traitement">
          MACREZ — messmacr@gmail.com{'\n'}
          Application ConcoursPolice, disponible sur Google Play Store.
        </Section>

        <Section title="2. Données collectées">
          L'Application collecte uniquement les données suivantes, stockées localement sur
          votre appareil (aucun serveur externe) :{'\n\n'}
          • Prénom et âge (saisis lors de l'onboarding){'\n'}
          • Scores et résultats de quiz{'\n'}
          • Progression par matière et par question{'\n'}
          • Objectif quotidien, streak (série de jours){'\n'}
          • Points XP et grade obtenu{'\n\n'}
          Ces données ne sont jamais transmises à des tiers, sauf dans les cas décrits
          à l'article 4.
        </Section>

        <Section title="3. Finalité">
          Les données collectées servent exclusivement à personnaliser votre expérience de
          révision : afficher votre progression, calculer votre streak et vos points XP,
          et adapter les recommandations de révision.
        </Section>

        <Section title="4. Services tiers">
          L'Application intègre les services suivants, qui peuvent collecter des données
          techniques :{'\n\n'}
          • RevenueCat — gestion des achats in-app Premium. Collecte des données de
          transaction conformément à sa propre politique de confidentialité
          (revenuecat.com/privacy).{'\n\n'}
          • Expo / EAS — plateforme de déploiement. Peut collecter des identifiants
          d'appareil anonymes pour les notifications push (expo.dev/privacy).{'\n\n'}
          • Google Play Store — distribution. Soumis à la politique de confidentialité
          de Google (policies.google.com/privacy).
        </Section>

        <Section title="5. Conservation">
          Les données sont conservées localement sur votre appareil tant que l'Application
          est installée. Elles sont supprimées automatiquement lors de la désinstallation
          ou via le bouton « Réinitialiser mes données » dans l'onglet Plus.
        </Section>

        <Section title="6. Vos droits (RGPD)">
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous
          disposez des droits suivants :{'\n\n'}
          • Accès : vos données sont consultables directement dans l'app (onglet Plus){'\n'}
          • Rectification : modifiables via les paramètres{'\n'}
          • Suppression : via le bouton « Réinitialiser mes données »{'\n\n'}
          Pour toute demande, contactez : messmacr@gmail.com
        </Section>

        <Section title="7. Sécurité">
          Les données sont stockées via AsyncStorage (stockage natif chiffré par le système
          Android). Aucune donnée personnelle n'est transmise sur Internet par l'Application
          elle-même.
        </Section>

        <Section title="8. Mineurs">
          L'Application n'est pas destinée aux enfants de moins de 13 ans. Aucune collecte
          intentionnelle de données relatives à des mineurs n'est effectuée.
        </Section>

        <Section title="9. Modifications">
          Cette politique peut être mise à jour. La version en vigueur est toujours
          accessible dans l'Application (onglet Plus → Politique de confidentialité).
        </Section>

        <Text style={s.contact}>Contact : messmacr@gmail.com</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={s.sectionBody}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#0A1628' },
  header:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#1E3A5A' },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 14, color: '#c9a84c', fontWeight: '600' },
  title:   { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  updated: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#c9a84c', marginBottom: 8 },
  sectionBody:  { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 22 },
  contact: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 8 },
});

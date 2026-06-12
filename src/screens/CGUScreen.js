import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CGUScreen({ navigation }) {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={s.title}>Conditions d'utilisation</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>Dernière mise à jour : juin 2026</Text>

        <Section title="1. Présentation">
          L'application ConcoursPolice (ci-après « l'Application ») est éditée par MACREZ
          (contact : messmacr@gmail.com). Elle est destinée à aider les candidats à préparer
          le concours de Gardien de la Paix de la Police Nationale française.
        </Section>

        <Section title="2. Accès et utilisation">
          L'Application est téléchargeable gratuitement sur le Google Play Store. Certaines
          fonctionnalités avancées peuvent être accessibles via un abonnement ou un achat
          unique (option Premium). L'utilisateur s'engage à utiliser l'Application dans un
          cadre strictement personnel et non commercial.
        </Section>

        <Section title="3. Contenu pédagogique">
          Les questions, corrections et contenus proposés sont fournis à titre informatif et
          pédagogique. ConcoursPolice ne garantit pas la réussite au concours. Les sujets
          officiels restent la référence. L'éditeur s'efforce de maintenir les contenus à
          jour mais décline toute responsabilité en cas d'erreur ou d'omission.
        </Section>

        <Section title="4. Propriété intellectuelle">
          L'ensemble des contenus de l'Application (questions, textes, design, code source)
          est la propriété exclusive de l'éditeur ou de ses partenaires. Toute reproduction,
          diffusion ou exploitation sans autorisation écrite est interdite.
        </Section>

        <Section title="5. Limitation de responsabilité">
          L'Application est fournie « en l'état ». L'éditeur ne saurait être tenu responsable
          de toute interruption de service, perte de données ou dommage indirect lié à
          l'utilisation de l'Application.
        </Section>

        <Section title="6. Achats in-app">
          Les achats Premium sont traités via Google Play et le service RevenueCat. En cas de
          litige lié à un achat, contacter messmacr@gmail.com. Conformément à la politique
          Google Play, les achats peuvent être remboursés dans un délai de 48 heures.
        </Section>

        <Section title="7. Modification des CGU">
          L'éditeur se réserve le droit de modifier les présentes conditions à tout moment.
          L'utilisateur sera informé via une mise à jour de l'Application. La poursuite de
          l'utilisation après modification vaut acceptation.
        </Section>

        <Section title="8. Droit applicable">
          Les présentes conditions sont régies par le droit français. Tout litige relève de
          la compétence des tribunaux français.
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

# GardienQuiz — CLAUDE.md

## Projet
Application React Native (Expo SDK 54) de préparation au concours Gardien de la Paix (Police Nationale, France).

- **Package Android** : `com.macrez.gpxquiz`
- **EAS Project ID** : `502501d9-e2d5-493b-96a0-e976e11da8e7`
- **Owner EAS** : `krapo3`
- **GitHub** : https://github.com/Krapo33230/gpx-quiz

---

## Stack

- React Native + Expo SDK 54
- `@react-navigation/stack` (pas native-stack)
- `react-native-safe-area-context`
- `@react-native-async-storage/async-storage`
- EAS Build pour APK (preview) et AAB (production)

---

## Architecture

```
App.js                          ← NavigationContainer + Stack.Navigator (6 écrans)
src/
  screens/
    AccueilScreen.js            ← Accueil, stats rapides, streak badge, MatiereBar
    ChoixModeScreen.js          ← Sélection mode/matière — passe un objet {id, emoji, titre…}
    QuizScreen.js               ← Session quiz, timer, explication inline, Animated
    FeedbackScreen.js           ← Correction détaillée post-session
    ResultatsScreen.js          ← Stats globales, historique, jauge progression
    PaywallScreen.js            ← Bottom sheet modal, CTA mailto:messmacr@gmail.com
  components/
    ui.js                       ← StatCard, OptionButton, etc.
  utils/
    storage.js                  ← AsyncStorage : scores, stats, streak, progression, compteur journalier
  data/
    questions.js                ← 80 questions (droit, culture, logique, sécurité, français)
  theme/
    colors.js                   ← COLORS, FONTS, RADIUS, SHADOWS, SPACING
```

---

## Règles importantes

### Navigation
- Utiliser `@react-navigation/stack` uniquement — **pas** `@react-navigation/native-stack`.
- `presentation: 'transparentModal'` ne fonctionne pas avec stack → utiliser `cardStyleInterpolator` custom (slide from bottom) pour le Paywall.
- ChoixModeScreen passe `mode` comme **objet** `{id, emoji, titre, ...}` à QuizScreen.
- QuizScreen extrait `modeId` (string) avant de naviguer vers Resultats.
- Toujours normaliser `mode` en string dans `_persistSession` et `HistoryRow`.

### Timer (QuizScreen)
- `timeLeftRef` est utilisé pour les lectures synchrones dans le handler.
- `handleAnswer` doit être dans les deps de `useEffect` du timer pour éviter les stale closures.

### Paywall
- Se déclenche quand `addDailyCount(total)` retourne > 30 (DAILY_LIMIT).
- CTA mailto vers `messmacr@gmail.com` — pas encore de paiement intégré.
- RevenueCat prévu à l'étape 17 du plan MVP.

### Questions
- 80 questions dans `src/data/questions.js`.
- IDs format : `D001`–`D020` (droit), `C001`–`C020` (culture), `L001`–`L015` (logique), `S001`–`S015` (sécurité), `F001`–`F010` (français).
- Corrections factuelles appliquées : D015 (loi 2011), S007 (DGSI 2014), S008 (Gendarmerie sous tutelle intérieure depuis 2009).

### Storage (AsyncStorage)
| Clé | Contenu |
|-----|---------|
| `SCORES` | Array de sessions `{score, total, mode, date}` |
| `STATS` | `{sessions, totalCorrect, totalQuestions, bestScore}` |
| `STREAK` | `{currentStreak, lastDate}` |
| `PROG_MATIERE` | `{[matiere]: {correct, total}}` |
| `DAILY` | `{date, count}` — reset chaque jour |

---

## Commandes utiles

```bash
# Démarrer le dev server
cd ~/Desktop/gpx-quiz && npx expo start

# Build APK (Android preview)
eas build -p android --profile preview

# Build AAB (Play Store)
eas build -p android --profile production

# Push GitHub
git add . && git commit -m "feat: ..." && git push
```

---

## Plan MVP — état d'avancement

| Étape | Statut |
|-------|--------|
| 1–7   | ✅ Setup, UI, Quiz, Timer, Feedback, Stats, Streak |
| 8–10  | ✅ 80 questions, fact-check, Paywall |
| 11–13 | ✅ EAS Build APK, distribution Google Drive, GitHub |
| 14    | 🔄 Bêta-test 5 jours (observer sans intervenir) |
| 15    | ⏳ Mesurer : rétention J3 >50%, sessions/semaine >4, clics paywall >25% |
| 16    | ⏳ Publier sur Play Store (25€ one-time) |
| 17    | ⏳ Intégrer RevenueCat (paiement réel) |
| 18    | ⏳ Post Facebook groupes prépa concours |

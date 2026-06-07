# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Application React Native (Expo SDK 54) de préparation au concours Gardien de la Paix (Police Nationale, France).

- **Package Android** : `dev.macr.concourspolice`
- **EAS Project ID** : `502501d9-e2d5-493b-96a0-e976e11da8e7`
- **Owner EAS** : `krapo3`
- **GitHub** : https://github.com/Krapo33230/gpx-quiz

---

## Stack

- React Native + Expo SDK 54 (`newArchEnabled: true` — nouvelle architecture RN activée)
- `@react-navigation/stack` (pas native-stack)
- `react-native-safe-area-context`, `react-native-reanimated`, `expo-linear-gradient`
- `@react-native-async-storage/async-storage`
- EAS Build pour APK (preview) et AAB (production)
- Pas de suite de tests (no Jest/Vitest)

---

## Architecture

```
index.ts                        ← registerRootComponent (Expo entry)
App.js                          ← NavigationContainer + Stack.Navigator (10 écrans)
src/
  screens/
    AccueilScreen.js            ← Accueil, stats rapides, streak badge, MatiereBar, badge de rang XP
    ChoixModeScreen.js          ← Sélection mode/matière — passe un objet {id, emoji, titre…}
    QuizScreen.js               ← Session quiz, timer 30s, explication inline, Animated
    FeedbackScreen.js           ← Correction détaillée post-session
    ResultatsScreen.js          ← Stats globales, streak/best streak, XP/niveau, graphe 7 jours, historique
    AutoEvalScreen.js           ← Auto-évaluation 10 questions (2/catégorie), diagnostic + recommandation
    NiveauxScreen.js            ← Chemin des 5 grades, niveau actuel animé, verrouillés grisés
    LevelUpScreen.js            ← Écran de montée en grade avec confettis (déclenché auto depuis ResultatsScreen)
    PaywallScreen.js            ← Bottom sheet modal, CTA mailto:messmacr@gmail.com
    LexiqueScreen.js            ← Lexique des termes de police
  components/
    ui.js                       ← StatCard, OptionButton, PrimaryButton, OutlineButton, ProgressBar, CategoryBadge
  utils/
    storage.js                  ← AsyncStorage : scores, stats, streak, XP, scores journaliers, progression
  data/
    questions.js                ← Agrégation + helpers : getByCategorie, getRandomQuestions, shuffleOptions
    questions_droit.js          ← 40 questions D001–D040
    questions_culture.js        ← 40 questions C001–C040
    questions_logique.js        ← 30 questions L001–L030
    questions_securite.js       ← 30 questions S001–S030
    questions_francais.js       ← 25 questions F001–F025
    questions_monde.js          ← Questions citoyenneté / monde (nb variable)
    lexique.js                  ← Dictionnaire termes police (utilisé par LexiqueScreen)
  theme/
    colors.js                   ← COLORS, FONTS, RADIUS, SHADOWS, SPACING
```

---

## Règles importantes

### Navigation
- Utiliser `@react-navigation/stack` uniquement — **pas** `@react-navigation/native-stack`.
- `presentation: 'transparentModal'` ne fonctionne pas avec stack → utiliser `cardStyleInterpolator` custom.
- ChoixModeScreen passe `mode` comme **objet** `{id, emoji, titre, ...}` à QuizScreen.
- QuizScreen extrait `modeId` (string) avant de naviguer vers Resultats.
- Toujours normaliser `mode` en string dans `_persistSession` et `HistoryRow`.
- LevelUp et Paywall : slide depuis le bas (`cardStyleInterpolator` custom).
- Toutes les transitions utilisent une spring animation (stiffness 1000, damping 80, mass 3).

### Quiz
- `timeLeftRef` est utilisé pour les lectures synchrones dans le handler timer — `timeLeft` state sert uniquement au rendu.
- `handleAnswer` doit être dans les deps de `useEffect` du timer pour éviter les stale closures.
- Nombre de questions par mode : `flash` = 5, `complet` = 20, autres = 10 (`MODE_COUNT` dans QuizScreen).
- Les options sont **mélangées aléatoirement** à chaque session via `shuffleOptions()` dans `getRandomQuestions` — le `correctIndex` est recalculé après shuffle.

### XP & Niveaux
- `calcXP(score, total)` : 10 XP par bonne réponse + bonus 20 XP si ≥ 80 %, +10 XP si ≥ 60 %.
- Seuils des grades : Recrue (0), Gardien (500), Brigadier (1500), Officier (3000), Commandant (6000).
- La montée en grade est détectée dans `_persistSession` (comparaison avant/après XP) → navigation vers `LevelUp`.

### Paywall
- Se déclenche quand `addDailyCount(total)` retourne > 30 (DAILY_LIMIT) **et** que `checkPremiumEntitlement()` retourne `false`.
- Si une montée en grade a eu lieu dans la même session, le LevelUp s'affiche en priorité.
- Intégration RevenueCat via `src/utils/purchases.js` — entitlement id : `premium`.
- **Clé API** : `src/utils/purchases.js` ligne 5 → remplacer `goog_XXXX` par la vraie clé RevenueCat.
- RevenueCat nécessite un **EAS build** (pas compatible Expo Go).

### Questions
- **165+ questions** réparties dans les fichiers `questions_*.js` (+ `questions_monde.js` en cours).
- IDs : `D001`–`D040`, `C001`–`C040`, `L001`–`L030`, `S001`–`S030`, `F001`–`F025`.
- Les options sont mélangées à l'affichage — ne pas se fier aux `correctIndex` bruts pour deviner la position.

### Storage (AsyncStorage)
| Clé | Contenu |
|-----|---------|
| `gdp_scores` | Array de sessions `{score, total, mode, date}` (50 max) |
| `gdp_stats` | `{sessions, totalCorrect, totalQuestions, bestScore}` |
| `gdp_streak` | `{currentStreak, bestStreak, lastPlayedDate}` |
| `gdp_prog_matiere` | `{[categorie]: {correct, total}}` |
| `gdp_daily` | `{date, count}` — reset chaque jour |
| `gdp_xp` | nombre entier (XP total) |
| `gdp_daily_scores` | `{'YYYY-MM-DD': pct}` — meilleur score par jour (30 jours max) |
| `gdp_progress` | `{[questionId]: {attempts, correct}}` — suivi par question |

### Streak
- `todayStr()` et `yesterdayStr()` utilisent l'**heure locale** (pas UTC) pour éviter les bugs après minuit.

---

## Commandes utiles

```bash
# Démarrer le dev server
cd ~/Desktop/gpx-quiz && npx expo start

# Cibler Android ou iOS directement
npx expo start --android
npx expo start --ios

# Tuer un serveur expo bloqué
pkill -f "expo start"

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
| 8–10  | ✅ 195 questions, fact-check, Paywall |
| 11–13 | ✅ EAS Build APK, distribution Google Drive, GitHub |
| 14    | ✅ Bêta-test terminé |
| 14b   | ✅ Auto-évaluation, XP/Grades, LevelUp, graphe 7 jours, options mélangées |
| 15    | ⏳ Mesurer : rétention J3 > 50 %, sessions/semaine > 4, clics paywall > 25 % |
| 16    | ✅ Publié sur Play Store — Alpha actif depuis 28 avr. 2026, tests fermés avec 12 testeurs (14 jours en cours) |
| 17    | ⏳ Intégrer RevenueCat (paiement réel) — clé `goog_XXXX` à remplacer dans `src/utils/purchases.js` |
| 18    | ⏳ Post Facebook groupes prépa concours |

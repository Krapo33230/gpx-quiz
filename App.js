/**
 * GardienQuiz – Application de préparation au concours Gardien de la Paix
 * Police Nationale · France
 *
 * Architecture :
 *   App.js
 *   ├── NavigationContainer (React Navigation)
 *   └── Stack.Navigator (5 écrans)
 *       ├── AccueilScreen    → Accueil avec stats
 *       ├── ChoixModeScreen  → Sélection du mode / matière
 *       ├── QuizScreen       → Session de quiz avec timer
 *       ├── FeedbackScreen   → Correction détaillée + explication
 *       └── ResultatsScreen  → Statistiques & historique
 */

import 'react-native-gesture-handler';            // ← doit être la 1ère importation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// ─── Écrans ──────────────────────────────────────────────────────────────────
import AccueilScreen   from './src/screens/AccueilScreen';
import ChoixModeScreen from './src/screens/ChoixModeScreen';
import QuizScreen      from './src/screens/QuizScreen';
import FeedbackScreen  from './src/screens/FeedbackScreen';
import ResultatsScreen from './src/screens/ResultatsScreen';
import PaywallScreen   from './src/screens/PaywallScreen';

// ─── Thème ───────────────────────────────────────────────────────────────────
import { COLORS } from './src/theme/colors';

const Stack = createStackNavigator();

/**
 * Options par défaut du navigator.
 * Les en-têtes natifs sont masqués → chaque écran gère son propre header.
 */
const screenOptions = {
  headerShown: false,
  gestureEnabled: true,
  cardStyle: { backgroundColor: COLORS.background },
  // Animation slide-from-right fluide (native)
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange:  [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange:  [0, 0.5, 1],
        outputRange: [0, 0.8, 1],
      }),
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange:  [0, 1],
        outputRange: [0, 0.1],
      }),
    },
  }),
  transitionSpec: {
    open:  { animation: 'spring', config: { stiffness: 1000, damping: 80, mass: 3, overshootClamping: true } },
    close: { animation: 'spring', config: { stiffness: 1000, damping: 80, mass: 3, overshootClamping: true } },
  },
};

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Accueil"
          screenOptions={screenOptions}
        >
          {/* ── 1. Accueil ──────────────────────────────────────── */}
          <Stack.Screen
            name="Accueil"
            component={AccueilScreen}
          />

          {/* ── 2. Choix du mode ────────────────────────────────── */}
          <Stack.Screen
            name="ChoixMode"
            component={ChoixModeScreen}
          />

          {/* ── 3. Quiz (reçoit : mode) ──────────────────────────── */}
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
          />

          {/* ── 4. Feedback (reçoit : score, total, details, mode) ── */}
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
          />

          {/* ── 5. Résultats / Statistiques ─────────────────────── */}
          <Stack.Screen
            name="Resultats"
            component={ResultatsScreen}
          />

          {/* ── 6. Paywall (modale bottom-sheet) ───────────────── */}
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
              cardOverlayEnabled: false,
              gestureEnabled: true,
              gestureDirection: 'vertical',
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange:  [0, 1],
                        outputRange: [900, 0],
                      }),
                    },
                  ],
                },
              }),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

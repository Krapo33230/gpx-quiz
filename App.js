/**
 * GardienQuiz – Application de préparation au concours Gardien de la Paix
 * Police Nationale · France
 *
 * Architecture :
 *   App.js
 *   ├── SafeAreaProvider
 *   └── NavigationContainer (React Navigation)
 *       └── Stack.Navigator
 *           ├── WelcomeScreen
 *           ├── OnboardingScreen
 *           ├── MainTabs (bottom tab navigator)
 *           │   ├── AccueilScreen   (tab 1 – Accueil)
 *           │   ├── ChoixModeScreen (tab 2 – Apprendre)
 *           │   ├── NiveauxScreen   (tab 3 – Grades)
 *           │   ├── InfoScreen      (tab 4 – Infos)
 *           │   └── PlusScreen      (tab 5 – Plus)
 *           ├── QuizScreen
 *           ├── FeedbackScreen
 *           ├── ResultatsScreen
 *           ├── AutoEvalScreen
 *           ├── LevelUpScreen  (slide from bottom)
 *           ├── LexiqueScreen
 *           └── PaywallScreen  (slide from bottom)
 */

import 'react-native-gesture-handler';            // ← doit être la 1ère importation
import React, { useState, useEffect } from 'react';
import { Dimensions, Text } from 'react-native';
import { isOnboardingDone } from './src/utils/storage';
const { height } = Dimensions.get('window');
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initPurchases } from './src/utils/purchases';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// ─── Écrans ──────────────────────────────────────────────────────────────────
import AccueilScreen   from './src/screens/AccueilScreen';
import ChoixModeScreen from './src/screens/ChoixModeScreen';
import QuizScreen      from './src/screens/QuizScreen';
import FeedbackScreen  from './src/screens/FeedbackScreen';
import ResultatsScreen from './src/screens/ResultatsScreen';
import PaywallScreen   from './src/screens/PaywallScreen';
import AutoEvalScreen      from './src/screens/AutoEvalScreen';
import AutoEvalIntroScreen from './src/screens/AutoEvalIntroScreen';
import NiveauxScreen   from './src/screens/NiveauxScreen';
import LevelUpScreen   from './src/screens/LevelUpScreen';
import LexiqueScreen   from './src/screens/LexiqueScreen';
import WelcomeScreen    from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DailyStartScreen from './src/screens/DailyStartScreen';
import PlusScreen       from './src/screens/PlusScreen';
import InfoScreen            from './src/screens/InfoScreen';
import CGUScreen             from './src/screens/CGUScreen';
import ConfidentialiteScreen from './src/screens/ConfidentialiteScreen';

// ─── Thème ───────────────────────────────────────────────────────────────────
import { COLORS } from './src/theme/colors';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

const bottomSlideInterpolator = ({ current }) => ({
  cardStyle: {
    transform: [{
      translateY: current.progress.interpolate({
        inputRange:  [0, 1],
        outputRange: [height, 0],
      }),
    }],
  },
});

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

// ─── Bottom tab navigator ─────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A1020',
          borderTopColor: '#1E2F48',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={AccueilScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChoixMode"
        component={ChoixModeScreen}
        options={{
          tabBarLabel: 'Apprendre',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📚</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Niveaux"
        component={NiveauxScreen}
        options={{
          tabBarLabel: 'Grades',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏆</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Infos"
        component={InfoScreen}
        options={{
          tabBarLabel: 'Infos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Plus"
        component={PlusScreen}
        options={{
          tabBarLabel: 'Plus',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>☰</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    initPurchases();
    setInitialRoute('Welcome');
  }, []);

  if (!initialRoute) return null; // attend la vérification AsyncStorage

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={screenOptions}
        >
          {/* ── 0. Welcome / Onboarding ─────────────────────────── */}
          <Stack.Screen name="Welcome"    component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="DailyStart" component={DailyStartScreen} />

          {/* ── 1. Main (bottom tabs) ───────────────────────────── */}
          <Stack.Screen name="Main" component={MainTabs} />

          {/* ── 2. Quiz (reçoit : mode) ──────────────────────────── */}
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
          />

          {/* ── 3. Feedback (reçoit : score, total, details, mode) ── */}
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
          />

          {/* ── 4. Résultats / Statistiques ─────────────────────── */}
          <Stack.Screen
            name="Resultats"
            component={ResultatsScreen}
          />

          {/* ── 5. Intro auto-évaluation ────────────────────────── */}
          <Stack.Screen
            name="AutoEvalIntro"
            component={AutoEvalIntroScreen}
          />

          {/* ── 5b. Auto-évaluation ─────────────────────────────── */}
          <Stack.Screen
            name="AutoEval"
            component={AutoEvalScreen}
          />

          {/* ── 6. Level Up (modale plein écran) ───────────────── */}
          <Stack.Screen
            name="LevelUp"
            component={LevelUpScreen}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: '#FFF8E1' },
              cardStyleInterpolator: bottomSlideInterpolator,
            }}
          />

          {/* ── 7. Lexique Police ───────────────────────────────── */}
          <Stack.Screen
            name="Lexique"
            component={LexiqueScreen}
          />

          {/* ── 8b. Légal ───────────────────────────────────── */}
          <Stack.Screen name="CGU"             component={CGUScreen} />
          <Stack.Screen name="Confidentialite" component={ConfidentialiteScreen} />

          {/* ── 8. Paywall (modale bottom-sheet) ──────────────── */}
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
              cardOverlayEnabled: false,
              gestureEnabled: true,
              gestureDirection: 'vertical',
              cardStyleInterpolator: bottomSlideInterpolator,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

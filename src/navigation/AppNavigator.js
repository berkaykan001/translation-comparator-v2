// Main navigation structure for Translation Comparator app
// Bottom tabs: Translate, Grammar, Usage, Settings

import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import InterstitialAdManager from '../services/InterstitialAdManager';

// Import screens
import TranslateScreen from '../screens/TranslateScreen';
import GrammarScreen from '../screens/GrammarScreen';
import UsageScreen from '../screens/UsageScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Translate') {
            iconName = focused ? 'language' : 'language-outline';
          } else if (route.name === 'Grammar') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Usage') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
        },
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
        <Tab.Screen
          name="Translate"
          component={TranslateScreen}
          options={{ title: 'Translation' }}
        />
        <Tab.Screen
          name="Grammar"
          component={GrammarScreen}
          options={{ title: 'Grammar Check' }}
        />
        <Tab.Screen
          name="Usage"
          component={UsageScreen}
          options={{ title: 'Usage Analysis' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isPremium } = useAuth();
  const routeNameRef = useRef();
  const navigationRef = useRef();

  // Initialize interstitial ad manager on mount
  useEffect(() => {
    InterstitialAdManager.init();
  }, []);

  // Handle navigation state changes to show ads on tab switches
  const onNavigationStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      console.log('Navigation changed:', previousRouteName, '->', currentRouteName);

      // Don't show ads when navigating to Settings
      if (currentRouteName !== 'Settings') {
        await InterstitialAdManager.showAdIfReady(isPremium);
      }
    }

    // Save the current route name for next time
    routeNameRef.current = currentRouteName;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={onNavigationStateChange}
    >
      <AppTabs />
    </NavigationContainer>
  );
}

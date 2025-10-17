// Settings screen
// User preferences, account management, subscription status

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AI_MODELS } from '../services/aiService';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // State for AI model toggles (will be connected to context later)
  const [modelStates, setModelStates] = useState(
    AI_MODELS.reduce((acc, model) => {
      acc[model.id] = model.enabled;
      return acc;
    }, {})
  );

  const toggleModel = (modelId) => {
    setModelStates((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
    // TODO: Update global state/context
    console.log(`Toggled ${modelId} to ${!modelStates[modelId]}`);
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Login / Register</Text>
            <Text style={styles.settingValue}>Anonymous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Subscription</Text>
            <Text style={styles.settingValue}>Free (15/day)</Text>
          </TouchableOpacity>
        </View>

        {/* Language Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Native Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Target Languages</Text>
            <Text style={styles.settingValue}>Spanish, French, Turkish</Text>
          </TouchableOpacity>
        </View>

        {/* AI Models Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Models</Text>
          <Text style={styles.sectionDescription}>
            Select which AI models to use for translations and analysis
          </Text>
          {AI_MODELS.map((model) => (
            <View key={model.id} style={styles.settingItem}>
              <Text style={styles.settingLabel}>{model.name}</Text>
              <Switch
                value={modelStates[model.id]}
                onValueChange={() => toggleModel(model.id)}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor={modelStates[model.id] ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Output Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Output Windows</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Translation Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Grammar Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Usage Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
        </View>

        {/* Usage Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Stats</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Translations today: 0/15</Text>
            <Text style={styles.statsText}>This month: 0</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.cardBackground,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.backgroundSecondary,
  },
  sectionDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
    fontStyle: 'italic',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.text,
  },
  settingValue: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsContainer: {
    padding: 15,
  },
  statsText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginVertical: 5,
  },
});

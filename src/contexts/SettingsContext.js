// Settings Context
// Manages global app settings: AI models, languages, output window counts
// Persists to AsyncStorage and syncs with Firestore for logged-in users

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { AI_MODELS } from '../services/aiService';

const SettingsContext = createContext();

// Default settings
const DEFAULT_SETTINGS = {
  // Language preferences
  nativeLanguage: 'en', // English
  targetLanguages: ['es', 'fr', 'tr'], // Spanish, French, Turkish
  // Selected AI models per mode (each mode can have 1-5 models)
  selectedModels: {
    translate: ['perplexity', 'deepseek', 'grok', 'openrouter'], // Default 4 models
    grammar: ['perplexity', 'deepseek', 'grok', 'openrouter'], // Default 4 models
    usage: ['perplexity', 'deepseek', 'grok', 'openrouter'], // Default 4 models
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAnonymous, loadSettingsFromFirestore, syncSettingsToFirestore } = useAuth();

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // When user logs in (not anonymous), load settings from Firestore
  useEffect(() => {
    if (user && !isAnonymous) {
      loadFromFirestore();
    }
  }, [user, isAnonymous]);

  // Migrate old settings format to new format
  const migrateSettings = (oldSettings) => {
    // If already has new structure, return as-is
    if (oldSettings.selectedModels) {
      return oldSettings;
    }

    // Migrate from old structure
    console.log('Migrating settings from old format to new format');

    // Get enabled models from old enabledModels structure
    const enabledModelIds = oldSettings.enabledModels
      ? Object.keys(oldSettings.enabledModels).filter(id => oldSettings.enabledModels[id])
      : ['perplexity', 'deepseek', 'grok', 'openrouter'];

    // Limit to first 4 models if more than 4 were enabled
    const limitedModels = enabledModelIds.slice(0, 4);

    return {
      nativeLanguage: oldSettings.nativeLanguage || DEFAULT_SETTINGS.nativeLanguage,
      targetLanguages: oldSettings.targetLanguages || DEFAULT_SETTINGS.targetLanguages,
      selectedModels: {
        translate: limitedModels,
        grammar: limitedModels,
        usage: limitedModels,
      },
    };
  };

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const migratedSettings = migrateSettings(parsed);
        setSettings(migratedSettings);
        // Save migrated settings back to AsyncStorage
        await AsyncStorage.setItem('app_settings', JSON.stringify(migratedSettings));
        console.log('Settings loaded from AsyncStorage');
      } else {
        console.log('No saved settings, using defaults');
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // If anything goes wrong, use defaults
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings from Firestore (for logged-in users)
  const loadFromFirestore = async () => {
    try {
      const firestoreSettings = await loadSettingsFromFirestore();
      if (firestoreSettings) {
        const migratedSettings = migrateSettings(firestoreSettings);
        setSettings(migratedSettings);
        // Also save migrated settings to AsyncStorage for offline access
        await AsyncStorage.setItem('app_settings', JSON.stringify(migratedSettings));
        // Also sync migrated settings back to Firestore
        await syncSettingsToFirestore(migratedSettings);
        console.log('Settings loaded from Firestore');
      }
    } catch (error) {
      console.error('Error loading from Firestore:', error);
    }
  };

  // Save settings to AsyncStorage and Firestore
  const saveSettings = async (newSettings) => {
    try {
      // Always save to AsyncStorage
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      console.log('Settings saved to AsyncStorage');

      // If user is logged in (not anonymous), also sync to Firestore
      if (user && !isAnonymous) {
        await syncSettingsToFirestore(newSettings);
        console.log('Settings synced to Firestore');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Update native language
  const setNativeLanguage = async (languageCode) => {
    const newSettings = {
      ...settings,
      nativeLanguage: languageCode,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update target languages (array of up to 4 language codes)
  const setTargetLanguages = async (languageCodes) => {
    if (languageCodes.length > 4) {
      console.warn('Target languages must be maximum 4');
      return;
    }
    const newSettings = {
      ...settings,
      targetLanguages: languageCodes,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update selected AI models for a specific mode (1-5 models)
  const setSelectedModels = async (mode, modelIds) => {
    if (modelIds.length < 1 || modelIds.length > 5) {
      console.warn('Selected models must be between 1 and 5');
      return;
    }
    const newSettings = {
      ...settings,
      selectedModels: {
        ...settings.selectedModels,
        [mode]: modelIds,
      },
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Get selected AI models for a specific mode
  const getSelectedModels = (mode) => {
    // Safety check: if selectedModels doesn't exist, use defaults
    if (!settings.selectedModels || !settings.selectedModels[mode]) {
      const defaultIds = DEFAULT_SETTINGS.selectedModels[mode];
      return AI_MODELS.filter((model) => defaultIds.includes(model.id));
    }
    const selectedIds = settings.selectedModels[mode];
    return AI_MODELS.filter((model) => selectedIds.includes(model.id));
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  };

  const value = {
    settings,
    isLoading,
    setNativeLanguage,
    setTargetLanguages,
    setSelectedModels,
    getSelectedModels,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;

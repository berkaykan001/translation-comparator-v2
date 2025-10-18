// Settings Context
// Manages global app settings: AI models, languages, output window counts
// Persists to AsyncStorage and syncs with Firestore for logged-in users

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AI_MODELS } from '../services/aiService';

const SettingsContext = createContext();

// Default settings
const DEFAULT_SETTINGS = {
  // AI Model selection - which models are enabled
  enabledModels: {
    openai: false,
    claude: false,
    gemini: false,
    mistral: false,
    perplexity: true,
    deepseek: true,
    grok: true,
    openrouter: true,
  },
  // Language preferences
  nativeLanguage: 'en', // English
  targetLanguages: ['es', 'fr', 'tr'], // Spanish, French, Turkish
  // Output window counts per mode
  outputCounts: {
    translate: 4,
    grammar: 4,
    usage: 4,
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        console.log('Settings loaded from AsyncStorage');
      } else {
        console.log('No saved settings, using defaults');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      console.log('Settings saved to AsyncStorage');
      // TODO: Also sync to Firestore if user is logged in
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Toggle an AI model on/off
  const toggleAIModel = async (modelId) => {
    const newSettings = {
      ...settings,
      enabledModels: {
        ...settings.enabledModels,
        [modelId]: !settings.enabledModels[modelId],
      },
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
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

  // Update target languages (array of 3 language codes)
  const setTargetLanguages = async (languageCodes) => {
    if (languageCodes.length !== 3) {
      console.warn('Target languages must be exactly 3');
      return;
    }
    const newSettings = {
      ...settings,
      targetLanguages: languageCodes,
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Update output window count for a specific mode
  const setOutputCount = async (mode, count) => {
    const newSettings = {
      ...settings,
      outputCounts: {
        ...settings.outputCounts,
        [mode]: count,
      },
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Get list of enabled AI models
  const getEnabledModels = () => {
    return AI_MODELS.filter((model) => settings.enabledModels[model.id]);
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  };

  const value = {
    settings,
    isLoading,
    toggleAIModel,
    setNativeLanguage,
    setTargetLanguages,
    setOutputCount,
    getEnabledModels,
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

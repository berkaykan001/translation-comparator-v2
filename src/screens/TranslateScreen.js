// Translation mode screen
// Translates text between selected languages using multiple AI models

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useUsageLimit } from '../contexts/UsageLimitContext';
import { useAuth } from '../contexts/AuthContext';
import { createCommonStyles } from '../components/ThemedComponents';
import AIOutputWindow from '../components/AIOutputWindow';
import BannerAd from '../components/BannerAd';
import { callAllModels } from '../services/aiService';
import { buildTranslationPrompt } from '../utils/promptBuilder';
import { getLanguageByCode } from '../config/languages';

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const { settings, getSelectedModels } = useSettings();
  const { canTranslate, incrementCount, getRemainingTranslations } = useUsageLimit();
  const { isPremium } = useAuth();
  const styles = createCommonStyles(theme);

  // Set the first target language as default when settings load
  useEffect(() => {
    if (settings.targetLanguages && settings.targetLanguages.length > 0 && !selectedLanguage) {
      setSelectedLanguage(settings.targetLanguages[0]);
    }
  }, [settings.targetLanguages]);

  const handleTranslate = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validation
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to translate');
      return;
    }

    // Check usage limit (free users only)
    if (!canTranslate()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 15 translations. Upgrade to Premium for unlimited translations!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade to Premium', onPress: () => {
            // TODO: Navigate to subscription screen
            Alert.alert('Coming Soon', 'Premium subscription will be available soon!');
          }}
        ]
      );
      return;
    }

    console.log('Translating:', inputText, 'to', selectedLanguage);

    // Get selected models for translation mode from settings
    const modelsToUse = getSelectedModels('translate');

    // Initialize outputs with loading state
    const initialOutputs = modelsToUse.map((model) => ({
      modelId: model.id,
      modelName: model.name,
      text: null,
      loading: true,
    }));
    setOutputs(initialOutputs);

    // Increment usage count (for free users)
    await incrementCount();

    // Build prompt using settings
    const sourceLanguage = getLanguageByCode(settings.nativeLanguage).name;
    const targetLanguage = getLanguageByCode(selectedLanguage).name;
    const prompt = buildTranslationPrompt(inputText, sourceLanguage, targetLanguage);

    // Get model IDs to call
    const modelIds = modelsToUse.map((model) => model.id);

    // Call all models asynchronously
    await callAllModels(
      prompt,
      (modelId, modelName, response, error) => {
        setOutputs((prevOutputs) => {
          return prevOutputs.map((output) => {
            if (output.modelId === modelId) {
              return {
                ...output,
                text: error ? `Error: ${error.message}` : response,
                loading: false,
              };
            }
            return output;
          });
        });
      },
      modelIds
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps='handled'
      >
        {/* Language selector tabs - dynamically generated from settings */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.languageTabsContainer}
          contentContainerStyle={[
            styles.languageTabs,
            settings.targetLanguages.length < 4 && styles.languageTabsCentered
          ]}
          keyboardShouldPersistTaps='handled'
        >
          {settings.targetLanguages.map((langCode) => {
            const language = getLanguageByCode(langCode);
            return (
              <TouchableOpacity
                key={langCode}
                style={[styles.langTab, selectedLanguage === langCode && styles.langTabActive]}
                onPress={() => {
                  Keyboard.dismiss();
                  setSelectedLanguage(langCode);
                }}
              >
                <Text style={[styles.langTabText, selectedLanguage === langCode && styles.langTabTextActive]}>
                  {language.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text to translate..."
            placeholderTextColor={theme.textPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Translate button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleTranslate}>
          <Text style={styles.actionButtonText}>Translate</Text>
        </TouchableOpacity>

        {/* Usage counter (for free users) */}
        {!isPremium && (
          <View style={styles.usageCounter}>
            <Text style={styles.usageCounterText}>
              {getRemainingTranslations()} translations remaining today
            </Text>
          </View>
        )}

        {/* Output windows */}
        {outputs.length > 0 ? (
          <AIOutputWindow outputs={outputs} showFollowUp={false} />
        ) : (
          <View style={styles.outputSection}>
            <Text style={styles.placeholderText}>
              AI output windows will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Banner ad */}
      <BannerAd />
    </SafeAreaView>
  );
}

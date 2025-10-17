// Translation mode screen
// Translates text between selected languages using multiple AI models

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../components/ThemedComponents';
import AIOutputWindow from '../components/AIOutputWindow';
import { callAllModels, getEnabledModels } from '../services/aiService';
import { buildTranslationPrompt } from '../utils/promptBuilder';

// Language mapping
const LANGUAGE_NAMES = {
  es: 'Spanish',
  fr: 'French',
  tr: 'Turkish',
};

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es'); // Default: Spanish
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleTranslate = async () => {
    // Validation
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to translate');
      return;
    }

    console.log('Translating:', inputText, 'to', selectedLanguage);

    // Get enabled models
    const enabledModels = getEnabledModels();

    // Initialize outputs with loading state
    const initialOutputs = enabledModels.map((model) => ({
      modelId: model.id,
      modelName: model.name,
      text: null,
      loading: true,
    }));
    setOutputs(initialOutputs);

    // Build prompt
    const targetLanguage = LANGUAGE_NAMES[selectedLanguage];
    const prompt = buildTranslationPrompt(inputText, 'English', targetLanguage);

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
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Language selector tabs */}
        <View style={styles.languageTabs}>
          <TouchableOpacity
            style={[styles.langTab, selectedLanguage === 'es' && styles.langTabActive]}
            onPress={() => setSelectedLanguage('es')}
          >
            <Text style={[styles.langTabText, selectedLanguage === 'es' && styles.langTabTextActive]}>
              Spanish
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langTab, selectedLanguage === 'fr' && styles.langTabActive]}
            onPress={() => setSelectedLanguage('fr')}
          >
            <Text style={[styles.langTabText, selectedLanguage === 'fr' && styles.langTabTextActive]}>
              French
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langTab, selectedLanguage === 'tr' && styles.langTabActive]}
            onPress={() => setSelectedLanguage('tr')}
          >
            <Text style={[styles.langTabText, selectedLanguage === 'tr' && styles.langTabTextActive]}>
              Turkish
            </Text>
          </TouchableOpacity>
        </View>

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

      {/* Banner ad placeholder */}
      <View style={styles.adContainer}>
        <Text style={styles.adPlaceholder}>Banner Ad</Text>
      </View>
    </SafeAreaView>
  );
}

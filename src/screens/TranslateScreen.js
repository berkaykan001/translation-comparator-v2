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
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../components/ThemedComponents';
import AIOutputWindow from '../components/AIOutputWindow';

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es'); // Default: Spanish
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleTranslate = () => {
    // TODO: Call AI services asynchronously
    console.log('Translating:', inputText, 'to', selectedLanguage);

    // Mock data for demonstration (will be replaced with real API calls in Phase 2)
    setOutputs([
      { modelName: 'GPT-4.1', text: null, loading: true },
      { modelName: 'Claude Haiku 3.5', text: null, loading: true },
      { modelName: 'Gemini 2.5 Flash', text: null, loading: true },
      { modelName: 'Mistral', text: null, loading: true },
    ]);

    // Simulate API responses arriving at different times
    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[0] = { modelName: 'GPT-4.1', text: 'Hola, ¿cómo estás? (GPT-4.1 translation)', loading: false };
        return newOutputs;
      });
    }, 1000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[1] = { modelName: 'Claude Haiku 3.5', text: 'Hola, ¿cómo estás? (Claude translation)', loading: false };
        return newOutputs;
      });
    }, 1500);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[2] = { modelName: 'Gemini 2.5 Flash', text: 'Hola, ¿cómo estás? (Gemini translation)', loading: false };
        return newOutputs;
      });
    }, 2000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[3] = { modelName: 'Mistral', text: 'Hola, ¿cómo estás? (Mistral translation)', loading: false };
        return newOutputs;
      });
    }, 2500);
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

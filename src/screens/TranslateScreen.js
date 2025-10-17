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

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es'); // Default: Spanish
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleTranslate = () => {
    // TODO: Call AI services asynchronously
    console.log('Translating:', inputText, 'to', selectedLanguage);
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

        {/* Output windows - will be implemented later */}
        <View style={styles.outputSection}>
          <Text style={styles.placeholderText}>
            AI output windows will appear here
          </Text>
        </View>
      </ScrollView>

      {/* Banner ad placeholder */}
      <View style={styles.adContainer}>
        <Text style={styles.adPlaceholder}>Banner Ad</Text>
      </View>
    </SafeAreaView>
  );
}

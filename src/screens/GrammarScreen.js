// Grammar checking mode screen
// Analyzes grammar correctness using multiple AI models
// Includes follow-up question feature

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

export default function GrammarScreen() {
  const [inputText, setInputText] = useState('');
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleCheckGrammar = () => {
    // TODO: Call AI services asynchronously
    console.log('Checking grammar:', inputText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Input box */}
        <View style={[styles.inputContainer, { marginTop: 10 }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text to check grammar..."
            placeholderTextColor={theme.textPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Check Grammar button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleCheckGrammar}>
          <Text style={styles.actionButtonText}>Check Grammar</Text>
        </TouchableOpacity>

        {/* Output windows - will be implemented later */}
        <View style={styles.outputSection}>
          <Text style={styles.placeholderText}>
            AI output windows with follow-up questions will appear here
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

// Usage analysis mode screen
// Analyzes phrase usage and context using multiple AI models
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

export default function UsageScreen() {
  const [inputText, setInputText] = useState('');
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleAnalyzeUsage = () => {
    // TODO: Call AI services asynchronously
    console.log('Analyzing usage:', inputText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Input box */}
        <View style={[styles.inputContainer, { marginTop: 10 }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter text to analyze usage..."
            placeholderTextColor={theme.textPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Analyze Usage button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleAnalyzeUsage}>
          <Text style={styles.actionButtonText}>Analyze Usage</Text>
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

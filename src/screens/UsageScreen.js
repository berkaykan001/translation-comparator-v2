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
import AIOutputWindow from '../components/AIOutputWindow';

export default function UsageScreen() {
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleAnalyzeUsage = () => {
    // TODO: Call AI services asynchronously
    console.log('Analyzing usage:', inputText);

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
        newOutputs[0] = { modelName: 'GPT-4.1', text: 'This phrase is informal and commonly used in casual conversation. It\'s appropriate in friendly settings but not in formal writing. (GPT-4.1 analysis)', loading: false };
        return newOutputs;
      });
    }, 1000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[1] = { modelName: 'Claude Haiku 3.5', text: 'Usage analysis: This is a colloquial expression typically used among friends or peers. Avoid in professional contexts. (Claude analysis)', loading: false };
        return newOutputs;
      });
    }, 1500);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[2] = { modelName: 'Gemini 2.5 Flash', text: 'This phrase is informal. It\'s great for everyday conversation but might be too casual for business communication. (Gemini analysis)', loading: false };
        return newOutputs;
      });
    }, 2000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[3] = { modelName: 'Mistral', text: 'Informal usage. Suitable for casual settings. Not recommended for formal or academic writing. (Mistral analysis)', loading: false };
        return newOutputs;
      });
    }, 2500);
  };

  const handleFollowUpSubmit = (question, modelId) => {
    console.log('Follow-up question for', modelId, ':', question);
    // TODO: Send follow-up question to specific AI model
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

        {/* Output windows with follow-up questions */}
        {outputs.length > 0 ? (
          <AIOutputWindow outputs={outputs} showFollowUp={true} onFollowUpSubmit={handleFollowUpSubmit} />
        ) : (
          <View style={styles.outputSection}>
            <Text style={styles.placeholderText}>
              AI output windows with follow-up questions will appear here
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

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
import AIOutputWindow from '../components/AIOutputWindow';

export default function GrammarScreen() {
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleCheckGrammar = () => {
    // TODO: Call AI services asynchronously
    console.log('Checking grammar:', inputText);

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
        newOutputs[0] = { modelName: 'GPT-4.1', text: 'The grammar is correct. The sentence is properly structured with subject-verb agreement. (GPT-4.1 analysis)', loading: false };
        return newOutputs;
      });
    }, 1000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[1] = { modelName: 'Claude Haiku 3.5', text: 'Grammar check: The sentence is grammatically correct. No errors found. (Claude analysis)', loading: false };
        return newOutputs;
      });
    }, 1500);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[2] = { modelName: 'Gemini 2.5 Flash', text: 'Your grammar looks good! The sentence follows proper English grammar rules. (Gemini analysis)', loading: false };
        return newOutputs;
      });
    }, 2000);

    setTimeout(() => {
      setOutputs(prev => {
        const newOutputs = [...prev];
        newOutputs[3] = { modelName: 'Mistral', text: 'No grammatical errors detected. The sentence is well-formed. (Mistral analysis)', loading: false };
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

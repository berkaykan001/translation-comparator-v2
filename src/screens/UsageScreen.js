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
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createCommonStyles } from '../components/ThemedComponents';
import AIOutputWindow from '../components/AIOutputWindow';
import { callAllModels, getEnabledModels, callSingleModel } from '../services/aiService';
import { buildUsagePrompt, buildFollowUpPrompt } from '../utils/promptBuilder';

export default function UsageScreen() {
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const styles = createCommonStyles(theme);

  const handleAnalyzeUsage = async () => {
    // Validation
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to analyze');
      return;
    }

    console.log('Analyzing usage:', inputText);

    // Get enabled models
    const enabledModels = getEnabledModels();

    // Initialize outputs with loading state
    const initialOutputs = enabledModels.map((model) => ({
      modelId: model.id,
      modelName: model.name,
      text: null,
      loading: true,
      originalPrompt: null,
    }));
    setOutputs(initialOutputs);

    // Build prompt (assuming English as source language for now)
    const prompt = buildUsagePrompt(inputText, 'English', 'English');

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
                originalPrompt: prompt,
              };
            }
            return output;
          });
        });
      }
    );
  };

  const handleFollowUpSubmit = async (question, modelId) => {
    console.log('Follow-up question for', modelId, ':', question);

    // Find the output for this model
    const output = outputs.find((o) => o.modelId === modelId);
    if (!output || !output.text || !output.originalPrompt) {
      Alert.alert('Error', 'Cannot send follow-up question');
      return;
    }

    // Build follow-up prompt
    const followUpPromptText = buildFollowUpPrompt(
      output.originalPrompt,
      output.text,
      question
    );

    // Update this specific output to loading state
    setOutputs((prevOutputs) => {
      return prevOutputs.map((o) => {
        if (o.modelId === modelId) {
          return { ...o, loading: true };
        }
        return o;
      });
    });

    // Call only this model with the follow-up prompt
    try {
      const response = await callSingleModel(modelId, followUpPromptText);
      setOutputs((prevOutputs) => {
        return prevOutputs.map((o) => {
          if (o.modelId === modelId) {
            return {
              ...o,
              text: response,
              loading: false,
            };
          }
          return o;
        });
      });
    } catch (error) {
      setOutputs((prevOutputs) => {
        return prevOutputs.map((o) => {
          if (o.modelId === modelId) {
            return {
              ...o,
              text: `Error: ${error.message}`,
              loading: false,
            };
          }
          return o;
        });
      });
    }
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

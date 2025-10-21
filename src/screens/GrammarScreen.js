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
import { callAllModels, callSingleModel } from '../services/aiService';
import { buildGrammarPrompt, buildFollowUpPrompt } from '../utils/promptBuilder';
import { getLanguageByCode } from '../config/languages';

export default function GrammarScreen() {
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs] = useState([]);
  const { theme } = useTheme();
  const { settings, getSelectedModels } = useSettings();
  const { canTranslate, incrementCount, getRemainingTranslations } = useUsageLimit();
  const { isPremium } = useAuth();
  const styles = createCommonStyles(theme);

  const handleCheckGrammar = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validation
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to check');
      return;
    }

    // Check usage limit (free users only)
    if (!canTranslate()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 15 checks. Upgrade to Premium for unlimited checks!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade to Premium', onPress: () => {
            Alert.alert('Coming Soon', 'Premium subscription will be available soon!');
          }}
        ]
      );
      return;
    }

    console.log('Checking grammar:', inputText);

    // Get selected models for grammar mode from settings
    const modelsToUse = getSelectedModels('grammar');

    // Initialize outputs with loading state
    const initialOutputs = modelsToUse.map((model) => ({
      modelId: model.id,
      modelName: model.name,
      text: null,
      loading: true,
      originalPrompt: null,
    }));
    setOutputs(initialOutputs);

    // Increment usage count (for free users)
    await incrementCount();

    // Build prompt using native language from settings
    const nativeLanguage = getLanguageByCode(settings.nativeLanguage).name;
    const prompt = buildGrammarPrompt(inputText, nativeLanguage, nativeLanguage);

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
                originalPrompt: prompt,
              };
            }
            return output;
          });
        });
      },
      modelIds
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
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps='handled'
      >
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

        {/* Usage counter (for free users) */}
        {!isPremium && (
          <View style={styles.usageCounter}>
            <Text style={styles.usageCounterText}>
              {getRemainingTranslations()} checks remaining today
            </Text>
          </View>
        )}

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

      {/* Banner ad */}
      <BannerAd />
    </SafeAreaView>
  );
}

// FollowUpInput component
// Allows users to ask follow-up questions in Grammar and Usage modes
// Appears at the bottom of each AI output window

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

/**
 * FollowUpInput Component
 *
 * Props:
 * - onSubmit: Function - Called when user submits a follow-up question
 *   Receives the question text as parameter
 * - modelId: String - Identifier for which AI model this follow-up is for
 * - placeholder: String - Optional placeholder text (default: "Ask a follow-up question...")
 */
export default function FollowUpInput({ onSubmit, modelId, placeholder = "Ask a follow-up question..." }) {
  const [question, setQuestion] = useState('');
  const { theme } = useTheme();

  const handleSubmit = () => {
    if (question.trim().length === 0) return;

    // Call the onSubmit callback with the question
    if (onSubmit) {
      onSubmit(question, modelId);
    }

    // Clear the input field after submission
    setQuestion('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBackground, borderTopColor: theme.border }]}>
      <TextInput
        style={[styles.input, { color: theme.inputText }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textPlaceholder}
        value={question}
        onChangeText={setQuestion}
        multiline
        maxLength={500}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: question.trim().length > 0 ? theme.primary : theme.border,
          },
        ]}
        onPress={handleSubmit}
        disabled={question.trim().length === 0}
      >
        <Ionicons
          name="send"
          size={18}
          color={question.trim().length > 0 ? '#fff' : theme.textPlaceholder}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

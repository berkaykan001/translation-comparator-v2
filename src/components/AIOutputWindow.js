// AIOutputWindow component
// Displays AI responses in a horizontally scrollable container
// Each window is vertically scrollable and has tap-to-copy functionality

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';

/**
 * AIOutputWindow Component
 *
 * Props:
 * - outputs: Array of objects with shape:
 *   [
 *     { modelName: 'GPT-4.1', text: 'Translation...', loading: false },
 *     { modelName: 'Claude Haiku 3.5', text: null, loading: true },
 *     ...
 *   ]
 * - showFollowUp: Boolean - Whether to show follow-up input (Grammar/Usage modes only)
 * - onFollowUpSubmit: Function - Called when user submits follow-up question
 */
export default function AIOutputWindow({ outputs = [], showFollowUp = false, onFollowUpSubmit }) {
  const { theme } = useTheme();

  // Handle tap-to-copy with haptic feedback
  const handleCopyToClipboard = async (text, modelName) => {
    if (!text) return;

    try {
      await Clipboard.setStringAsync(text);
      // Trigger haptic feedback on successful copy
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log(`Copied ${modelName} output to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Horizontal ScrollView for output windows */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}
      >
        {outputs.map((output, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.outputCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => handleCopyToClipboard(output.text, output.modelName)}
            activeOpacity={0.7}
          >
            {/* Model name at top */}
            <View style={[styles.modelNameContainer, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modelNameText, { color: theme.primary }]}>
                {output.modelName}
              </Text>
            </View>

            {/* Vertically scrollable content */}
            <ScrollView
              style={styles.verticalScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {output.loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Loading...
                  </Text>
                </View>
              ) : output.text ? (
                <View style={styles.textContainer}>
                  <Text style={[styles.outputText, { color: theme.text }]}>
                    {output.text}
                  </Text>
                  <Text style={[styles.tapToCopyHint, { color: theme.textPlaceholder }]}>
                    Tap to copy
                  </Text>
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: theme.textPlaceholder }]}>
                  No response yet
                </Text>
              )}
            </ScrollView>

            {/* Follow-up input placeholder (will be implemented later) */}
            {showFollowUp && !output.loading && output.text && (
              <View style={[styles.followUpPlaceholder, { borderTopColor: theme.border }]}>
                <Text style={[styles.followUpText, { color: theme.textPlaceholder }]}>
                  Follow-up Q&A (coming soon)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalScrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  outputCard: {
    width: 300,
    height: 400,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modelNameContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  modelNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verticalScroll: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  textContainer: {
    padding: 15,
  },
  outputText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tapToCopyHint: {
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyText: {
    padding: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  followUpPlaceholder: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
  },
  followUpText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

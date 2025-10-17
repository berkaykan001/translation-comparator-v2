// Reusable themed components and style functions

import { StyleSheet } from 'react-native';

// Create common styles based on theme
export const createCommonStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  languageTabs: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: theme.backgroundSecondary,
  },
  langTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  langTabActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  langTabText: {
    fontSize: 14,
    color: theme.text,
  },
  langTabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: theme.inputBackground,
    color: theme.inputText,
  },
  actionButton: {
    margin: 15,
    marginTop: 0,
    backgroundColor: theme.buttonBackground,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outputSection: {
    padding: 15,
    minHeight: 200,
  },
  placeholderText: {
    textAlign: 'center',
    color: theme.textPlaceholder,
    marginTop: 50,
  },
  adContainer: {
    height: 60,
    backgroundColor: theme.adBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  adPlaceholder: {
    color: theme.adText,
  },
});

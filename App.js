// Translation Comparator App
// Multi-AI translation, grammar checking, and usage analysis

import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SettingsProvider>
    </ThemeProvider>
  );
}

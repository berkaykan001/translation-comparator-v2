// Translation Comparator App
// Multi-AI translation, grammar checking, and usage analysis

import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

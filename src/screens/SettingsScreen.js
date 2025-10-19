// Settings screen
// User preferences, account management, subscription status

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useCostTracking } from '../contexts/CostTrackingContext';
import { AI_MODELS } from '../services/aiService';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { settings, isLoading, toggleAIModel } = useSettings();
  const { getCostSummary } = useCostTracking();
  const {
    user,
    isAnonymous,
    isPremium,
    logout,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    purchasePremium,
    restorePurchases
  } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const styles = createStyles(theme);

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setAuthLoading(true);
    const result = await loginWithEmail(email, password);
    setAuthLoading(false);

    if (result.success) {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      Alert.alert('Success', 'Logged in successfully!');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  // Handle register
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setAuthLoading(true);
    const result = await registerWithEmail(email, password);
    setAuthLoading(false);

    if (result.success) {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will be signed in anonymously.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              Alert.alert('Success', 'Logged out successfully');
            }
          },
        },
      ]
    );
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    const result = await loginWithGoogle();
    setAuthLoading(false);

    if (result.success) {
      setShowAuthModal(false);
      Alert.alert('Success', 'Signed in with Google!');
    } else {
      Alert.alert('Google Sign-In', result.error);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setAuthLoading(true);
    const result = await loginWithFacebook();
    setAuthLoading(false);

    if (result.success) {
      setShowAuthModal(false);
      Alert.alert('Success', 'Signed in with Facebook!');
    } else {
      Alert.alert('Facebook Login', result.error);
    }
  };

  // Handle premium purchase
  const handlePurchasePremium = async () => {
    if (isAnonymous) {
      Alert.alert(
        'Account Required',
        'Please create an account or login to purchase Premium subscription.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login/Register', onPress: () => setShowAuthModal(true) }
        ]
      );
      return;
    }

    Alert.alert(
      'Upgrade to Premium',
      'Get unlimited translations, grammar checks, and usage analyses. Remove all ads!\n\nPrice: $4.99/month',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            try {
              const result = await purchasePremium();
              if (result.success) {
                Alert.alert('Success', 'Premium subscription activated! Enjoy unlimited access.');
              } else {
                Alert.alert('Purchase Failed', result.error || 'Failed to complete purchase');
              }
            } catch (error) {
              Alert.alert('Purchase Failed', error.message);
            }
          }
        }
      ]
    );
  };

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    try {
      Alert.alert('Restoring Purchases', 'Please wait...');
      const result = await restorePurchases();

      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Restore Purchases', result.message || 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          {isAnonymous ? (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowAuthModal(true)}
            >
              <Text style={styles.settingLabel}>Login / Register</Text>
              <Text style={styles.settingValue}>Anonymous →</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Email</Text>
                <Text style={styles.settingValue}>{user?.email || 'N/A'}</Text>
              </View>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleLogout}
              >
                <Text style={[styles.settingLabel, { color: theme.error || '#ff4444' }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Subscription</Text>
            <Text style={styles.settingValue}>
              {isPremium ? 'Premium' : 'Free (15/day)'}
            </Text>
          </View>

          {!isPremium && !isAnonymous && (
            <TouchableOpacity style={styles.upgradeButton} onPress={handlePurchasePremium}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium - $4.99/month</Text>
            </TouchableOpacity>
          )}

          {!isAnonymous && (
            <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchases}>
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Language Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Native Language</Text>
            <Text style={styles.settingValue}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Target Languages</Text>
            <Text style={styles.settingValue}>Spanish, French, Turkish</Text>
          </TouchableOpacity>
        </View>

        {/* AI Models Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Models</Text>
          <Text style={styles.sectionDescription}>
            Select which AI models to use for translations and analysis
          </Text>
          {AI_MODELS.map((model) => (
            <View key={model.id} style={styles.settingItem}>
              <Text style={styles.settingLabel}>{model.name}</Text>
              <Switch
                value={settings.enabledModels[model.id]}
                onValueChange={() => toggleAIModel(model.id)}
                trackColor={{ false: '#767577', true: theme.primary }}
                thumbColor={settings.enabledModels[model.id] ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Output Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Output Windows</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Translation Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Grammar Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Usage Mode</Text>
            <Text style={styles.settingValue}>4 windows</Text>
          </TouchableOpacity>
        </View>

        {/* Usage & Cost Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage & Cost Tracking</Text>
          <Text style={styles.sectionDescription}>
            Estimated API costs based on token usage
          </Text>

          {(() => {
            const costSummary = getCostSummary();
            return (
              <>
                {/* Today's Usage */}
                <View style={styles.costCard}>
                  <Text style={styles.costCardTitle}>Today</Text>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>API Calls:</Text>
                    <Text style={styles.costValue}>{costSummary.today.calls}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Estimated Cost:</Text>
                    <Text style={styles.costValue}>${costSummary.today.cost}</Text>
                  </View>
                </View>

                {/* This Month's Usage */}
                <View style={styles.costCard}>
                  <Text style={styles.costCardTitle}>This Month</Text>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>API Calls:</Text>
                    <Text style={styles.costValue}>{costSummary.thisMonth.calls}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Estimated Cost:</Text>
                    <Text style={styles.costValue}>${costSummary.thisMonth.cost}</Text>
                  </View>
                </View>

                {/* Total Usage */}
                <View style={styles.costCard}>
                  <Text style={styles.costCardTitle}>All Time</Text>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>API Calls:</Text>
                    <Text style={styles.costValue}>{costSummary.total.calls}</Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Estimated Cost:</Text>
                    <Text style={styles.costValue}>${costSummary.total.cost}</Text>
                  </View>
                </View>

                {/* Model Breakdown */}
                {costSummary.models.length > 0 && (
                  <View style={styles.costCard}>
                    <Text style={styles.costCardTitle}>By Model</Text>
                    {costSummary.models.map((model) => (
                      <View key={model.modelId} style={styles.costRow}>
                        <Text style={styles.costLabel}>{model.modelId}:</Text>
                        <Text style={styles.costValue}>
                          {model.calls} calls (${model.cost})
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            );
          })()}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Login/Register Modal */}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isRegistering ? 'Create Account' : 'Login'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {authLoading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={isRegistering ? handleRegister : handleLogin}
                >
                  <Text style={styles.primaryButtonText}>
                    {isRegistering ? 'Register' : 'Login'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setIsRegistering(!isRegistering)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {isRegistering
                      ? 'Already have an account? Login'
                      : "Don't have an account? Register"}
                  </Text>
                </TouchableOpacity>

                {/* Social Login Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                {/* Google Sign-In Button */}
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleSignIn}
                >
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Facebook Login Button */}
                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={handleFacebookLogin}
                >
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAuthModal(false);
                    setEmail('');
                    setPassword('');
                    setIsRegistering(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.cardBackground,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: theme.backgroundSecondary,
  },
  sectionDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 10,
    fontStyle: 'italic',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.text,
  },
  settingValue: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsContainer: {
    padding: 15,
  },
  statsText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginVertical: 5,
  },
  costCard: {
    backgroundColor: theme.inputBackground,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  costCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 10,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  costLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  costValue: {
    fontSize: 14,
    color: theme.textPrimary,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: theme.primary,
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: theme.cardBackground,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.borderColor,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: theme.textPrimary,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.backgroundSecondary,
    borderColor: theme.borderLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: theme.text,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 14,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelButtonText: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.borderLight,
  },
  dividerText: {
    marginHorizontal: 10,
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.borderLight,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

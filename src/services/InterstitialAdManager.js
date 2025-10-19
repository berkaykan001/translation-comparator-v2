// Interstitial Ad Manager
// Manages interstitial ads shown during screen transitions
// Only shown to free users with cooldown mechanism
// NOTE: Temporarily disabled - requires development build (not Expo Go)

import { Platform } from 'react-native';
// import {
//   InterstitialAd,
//   AdEventType,
//   TestIds,
// } from 'react-native-google-mobile-ads';

// AdMob Unit IDs for interstitial ads
// const INTERSTITIAL_AD_UNIT_ID = __DEV__
//   ? TestIds.INTERSTITIAL
//   : Platform.select({
//       ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // TODO: Add iOS interstitial ad unit ID
//       android: 'ca-app-pub-7022168619359192/XXXXXXXXXX', // TODO: Add Android interstitial ad unit ID
//     });

class InterstitialAdManager {
  constructor() {
    this.interstitial = null;
    this.isLoaded = false;
    this.isLoading = false;
    this.transitionCount = 0;
    this.AD_FREQUENCY = 3; // Show ad every 3 screen transitions
  }

  // Initialize and load the first ad
  init() {
    // Temporarily disabled - requires development build
    console.log('InterstitialAdManager: Ads disabled in Expo Go');
    return;
  }

  // Load an interstitial ad
  loadAd() {
    // Temporarily disabled - requires development build
    return;
  }

  // Show ad if conditions are met
  // Returns true if ad was shown, false otherwise
  async showAdIfReady(isPremium) {
    // Temporarily disabled - requires development build
    return false;
  }

  // Reset transition counter (useful for testing)
  resetCounter() {
    this.transitionCount = 0;
  }
}

// Export singleton instance
export default new InterstitialAdManager();

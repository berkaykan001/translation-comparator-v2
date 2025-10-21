// Interstitial Ad Manager
// Manages interstitial ads shown during screen transitions
// Only shown to free users with cooldown mechanism

import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// AdMob Unit IDs for interstitial ads
// Using test IDs for now - replace with real ad unit IDs from AdMob console after testing
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // TODO: Add iOS interstitial ad unit ID
      android: 'ca-app-pub-7022168619359192/XXXXXXXXXX', // TODO: Add Android interstitial ad unit ID
    });

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
    try {
      console.log('InterstitialAdManager: Initializing...');
      this.interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);

      // Set up event listeners
      this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded');
        this.isLoaded = true;
        this.isLoading = false;
      });

      this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('Interstitial ad error:', error);
        this.isLoaded = false;
        this.isLoading = false;
      });

      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        this.isLoaded = false;
        // Preload next ad
        this.loadAd();
      });

      // Load the first ad
      this.loadAd();
    } catch (error) {
      console.error('Failed to initialize InterstitialAdManager:', error);
    }
  }

  // Load an interstitial ad
  loadAd() {
    if (this.isLoading || this.isLoaded) {
      console.log('Ad is already loading or loaded');
      return;
    }

    try {
      console.log('Loading interstitial ad...');
      this.isLoading = true;
      this.interstitial?.load();
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
      this.isLoading = false;
    }
  }

  // Show ad if conditions are met
  // Returns true if ad was shown, false otherwise
  async showAdIfReady(isPremium) {
    // Don't show ads for premium users
    if (isPremium) {
      console.log('User is premium, skipping ad');
      return false;
    }

    // Increment transition count
    this.transitionCount++;
    console.log(`Transition count: ${this.transitionCount}/${this.AD_FREQUENCY}`);

    // Check if it's time to show an ad
    if (this.transitionCount < this.AD_FREQUENCY) {
      console.log('Not time to show ad yet');
      return false;
    }

    // Reset counter
    this.transitionCount = 0;

    // Check if ad is loaded
    if (!this.isLoaded) {
      console.log('Interstitial ad not loaded yet');
      // Try to load for next time
      this.loadAd();
      return false;
    }

    // Show the ad
    try {
      console.log('Showing interstitial ad');
      await this.interstitial?.show();
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      // Try to load another ad
      this.loadAd();
      return false;
    }
  }

  // Reset transition counter (useful for testing)
  resetCounter() {
    this.transitionCount = 0;
  }
}

// Export singleton instance
export default new InterstitialAdManager();

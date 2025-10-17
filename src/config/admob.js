// AdMob Configuration
// Account: berkay_k94_@hotmail.com
// App ID: ca-app-pub-7022168619359192~1188502358

// Test Ad Unit IDs (for development)
export const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111', // Google test banner
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712', // Google test interstitial
};

// Production Ad Unit IDs
// TODO: Create these in AdMob Console and replace the placeholders
// Go to: AdMob Console → Apps → Translation Comparator → Ad Units
export const PRODUCTION_AD_UNITS = {
  BANNER: 'ca-app-pub-7022168619359192/XXXXXXXXXX', // TODO: Create Banner ad unit
  INTERSTITIAL: 'ca-app-pub-7022168619359192/XXXXXXXXXX', // TODO: Create Interstitial ad unit
};

// Use test ads during development, production ads in release builds
const __DEV__ = process.env.NODE_ENV === 'development';

export const AD_UNITS = __DEV__ ? TEST_AD_UNITS : PRODUCTION_AD_UNITS;

// Ad display settings
export const AD_CONFIG = {
  // Show interstitial ad every X mode transitions
  INTERSTITIAL_FREQUENCY: 5,

  // Banner ad position
  BANNER_POSITION: 'bottom', // 'top' or 'bottom'

  // Whether to show ads for premium users (should always be false)
  SHOW_ADS_FOR_PREMIUM: false,
};

// BannerAd Component
// Displays AdMob banner ad at bottom of screen
// Hidden for Premium users
// NOTE: Temporarily disabled - requires development build (not Expo Go)

import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAuth } from '../contexts/AuthContext';

// AdMob Unit IDs
// TODO: Replace test IDs with real ad unit IDs from AdMob console
// const BANNER_AD_UNIT_ID = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : Platform.select({
//       ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // TODO: Add iOS banner ad unit ID
//       android: 'ca-app-pub-7022168619359192/XXXXXXXXXX', // TODO: Add Android banner ad unit ID
//     });

export default function BannerAdComponent() {
  const { isPremium } = useAuth();

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  // Temporarily show placeholder (AdMob requires development build)
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Banner Ad (dev build required)</Text>
    </View>
  );

  // TODO: Uncomment when using development build or production build
  // return (
  //   <View style={styles.container}>
  //     <BannerAd
  //       unitId={BANNER_AD_UNIT_ID}
  //       size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  //       requestOptions={{
  //         requestNonPersonalizedAdsOnly: false,
  //         networkExtras: {
  //           collapsible: 'bottom',
  //         },
  //       }}
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 10,
  },
  placeholder: {
    color: '#999',
    fontSize: 12,
  },
});

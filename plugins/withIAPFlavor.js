const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin to add missingDimensionStrategy for react-native-iap
 * This tells Gradle to use the 'play' flavor for Google Play Store builds
 */
const withIAPFlavor = (config) => {
  return withAppBuildGradle(config, (config) => {
    const { modResults } = config;
    let buildGradle = modResults.contents;

    // Check if missingDimensionStrategy already exists
    if (buildGradle.includes("missingDimensionStrategy 'store'")) {
      console.log('⚠️  missingDimensionStrategy for store already exists');
      return config;
    }

    // Find the defaultConfig block and add missingDimensionStrategy
    const defaultConfigPattern = /(defaultConfig\s*\{)/;

    if (defaultConfigPattern.test(buildGradle)) {
      buildGradle = buildGradle.replace(
        defaultConfigPattern,
        `$1\n        missingDimensionStrategy 'store', 'play'`
      );

      modResults.contents = buildGradle;
      console.log('✅ Added missingDimensionStrategy for react-native-iap (play flavor)');
    } else {
      console.warn('⚠️  Could not find defaultConfig block in build.gradle');
    }

    return config;
  });
};

module.exports = withIAPFlavor;

const withIAPFlavor = require('./plugins/withIAPFlavor');

module.exports = ({ config }) => {
  // Read the existing app.json configuration
  const appJson = require('./app.json');

  // Apply the custom plugin for react-native-iap flavor configuration
  return withIAPFlavor(appJson.expo);
};

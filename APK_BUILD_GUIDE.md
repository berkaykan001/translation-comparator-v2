# Translation Comparator APK Build Guide

## 🎯 **WORKING METHOD - EAS Build with Remote Credentials**

This guide documents the **proven working method** for building APKs to test monetization features (ads & billing).

**⚠️ IMPORTANT: Claude will run all build commands automatically.**

---

## 📋 **Prerequisites**

Before building, verify:
- Expo account logged in: `eas whoami` shows `berkay_kan`
- Project linked: `translation-comparator-app`
- Dependencies installed: `npm ci` works locally

---

## 🚀 **Complete Build Process**

### **Step 1: Verify Dependencies**

Ensure these key dependencies are in package.json:
```json
{
  "dependencies": {
    "react-native-iap": "^14.4.34",
    "react-native-google-mobile-ads": "^15.8.1",
    "expo-build-properties": "^1.0.9"
  }
}
```

**Critical versions:**
- `react-native-iap`: Must be v14.4.34+ (v12.x has Kotlin compilation errors)
- Older versions have compatibility issues with React Native 0.81.4

### **Step 2: Verify Expo Plugins Configuration**

Ensure app.json has the required plugins:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-7022168619359192~0000000000",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 36,
            "targetSdkVersion": 36,
            "minSdkVersion": 24,
            "buildToolsVersion": "36.0.0",
            "kotlinVersion": "2.1.20"
          }
        }
      ]
    ]
  }
}
```

### **Step 3: Verify Custom Config Plugin**

Ensure `app.config.js` exists with the IAP flavor configuration:
```javascript
const withIAPFlavor = require('./plugins/withIAPFlavor');

module.exports = ({ config }) => {
  const appJson = require('./app.json');
  return withIAPFlavor(appJson.expo);
};
```

And `plugins/withIAPFlavor.js` exists to add `missingDimensionStrategy 'store', 'play'` to Gradle.

**Why needed:** react-native-iap has separate builds for Google Play and Amazon App Store. This tells Gradle to use the Play Store flavor.

### **Step 4: Verify API Keys Configuration**

Ensure `src/config/apiKeys.js` exists (not gitignored):
```javascript
export const API_KEYS = {
  OPENAI: process.env.EXPO_PUBLIC_OPENAI_API_KEY || "placeholder",
  // ... other keys with env var fallbacks
};
```

Real API keys should be in `src/config/apiKeys.local.js` (gitignored).

### **Step 5: Update Version Numbers**

Increment version in `app.json` before each build:
```json
{
  "expo": {
    "version": "1.0.X",     // Increment
    "android": {
      "versionCode": X      // Increment by 1
    }
  }
}
```

### **Step 6: Regenerate package-lock.json (if dependencies changed)**

If any dependencies were added/updated:
```bash
rm -rf node_modules package-lock.json
npm install
```

Then verify:
```bash
rm -rf node_modules
npm ci --include=dev
```

If `npm ci` works locally, it will work on EAS.

### **Step 7: Run Build Command**

```bash
cd "c:\Users\Master_BME\source\repos\AI_translator_mobile_v2"
eas build --platform android --profile production
```

**Expected output:**
```
✔ Using remote Android credentials (Expo server)
✔ Uploaded to EAS
Waiting for build to complete...
```

**Build time:** 2-3 minutes

---

## ⏱ **Timeline**

- **Upload:** ~30 seconds
- **Build time:** ~2-3 minutes
- **Download:** APK ready immediately after build completes

---

## 🎯 **Success Indicators**

1. ✅ Upload completes without errors
2. ✅ npm ci passes on EAS server
3. ✅ JavaScript bundling succeeds
4. ✅ Gradle build succeeds
5. ✅ APK download link available

---

## 🔍 **Troubleshooting**

### **Error: "npm ci exited with code 1"**
**Solution:** Regenerate package-lock.json properly:
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Gradle build failed - flavor ambiguity"**
**Solution:** Ensure app.config.js and plugins/withIAPFlavor.js exist.

### **Error: "Kotlin compilation error in react-native-iap"**
**Solution:** Update to react-native-iap v14.4.34+:
```bash
npm install react-native-iap@14.4.34
```

### **Error: "JavaScript bundling failed"**
**Solution:** Ensure src/config/apiKeys.js exists and is committed (not gitignored).

---

## ✅ **Pre-Build Checklist**

Before running `eas build`:

- [ ] `eas whoami` shows `berkay_kan`
- [ ] `react-native-iap` is v14.4.34+
- [ ] `react-native-google-mobile-ads` in package.json
- [ ] `expo-build-properties` in package.json
- [ ] Expo plugins configured in app.json
- [ ] app.config.js exists
- [ ] plugins/withIAPFlavor.js exists
- [ ] src/config/apiKeys.js exists (committed)
- [ ] Version incremented in app.json
- [ ] `npm ci --include=dev` works locally

---

## 📱 **Testing After Build**

Once APK is downloaded and installed:
1. Test banner ads (should show test ads at bottom)
2. Test interstitial ads (every 3 screen transitions)
3. Test subscription purchase flow
4. Verify premium features unlock after purchase
5. Test restore purchases functionality

---

## 🔑 **Key Files**

- `app.json` - Expo config with plugins
- `app.config.js` - Custom plugin configuration
- `plugins/withIAPFlavor.js` - Gradle flavor config for IAP
- `src/config/apiKeys.js` - API keys with env var support (committed)
- `src/config/apiKeys.local.js` - Real API keys (gitignored)
- `package.json` - Dependencies
- `package-lock.json` - Exact dependency versions

---

## 📊 **Build History Summary**

**Session 9-10:**
- Attempts 1-4: Dependency and plugin configuration issues
- Attempt 5: JavaScript bundling failed (apiKeys.js missing)
- Attempt 6: Gradle flavor ambiguity

**Session 11:**
- Attempt 7: Kotlin compilation error (react-native-iap v12.15.4)
- **Attempt 8: ✅ SUCCESS** (react-native-iap v14.4.34)

**Key lessons learned:**
1. react-native-iap v12.x is incompatible - use v14.4.34+
2. Custom Expo plugin required for IAP flavor selection
3. apiKeys.js must be committed (with env var fallbacks)
4. Always regenerate package-lock.json by deleting both node_modules and package-lock.json

---

**Last Updated:** Session 11 - First Successful Build ✅
**Build Method:** EAS Build with Remote Credentials
**Working Version:** Expo SDK 54, React Native 0.81.4, react-native-iap 14.4.34

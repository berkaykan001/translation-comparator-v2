# Translation Comparator APK Build Guide

## 🎯 **WORKING METHOD - EAS Build with Remote Credentials**

This guide provides the complete step-by-step process to build an APK for testing monetization features (ads & billing).

---

## 📋 **Prerequisites**
- Expo account logged in: `eas whoami` should show `berkay_kan`
- Project linked to correct Expo project: `translation-comparator-app`
- All dependencies installed: `npm install`

---

## 🚀 **Complete Build Process**

### **Step 1: Uncomment Monetization Features**

Before building, uncomment the ads and billing code that was disabled for Expo Go:

**1.1 Uncomment BannerAd.js:**
```javascript
// File: src/components/BannerAd.js

// Change this:
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// TO:
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Change this:
// const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.ADAPTIVE_BANNER : ...
// TO:
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({ ... });

// Replace placeholder return with:
return (
  <View style={styles.container}>
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ ... }}
    />
  </View>
);
```

**1.2 Uncomment InterstitialAdManager.js:**
```javascript
// File: src/services/InterstitialAdManager.js

// Uncomment imports:
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Uncomment ad unit ID constant
const INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : ...

// Replace placeholder methods with full implementation (see file for details)
```

**1.3 Verify BillingManager.js:**
- This file is already uncommented and ready to use
- No changes needed

### **Step 2: Ensure Dependencies are Installed**

**CRITICAL:** Verify `react-native-iap` is in package.json:
```json
{
  "dependencies": {
    "react-native-iap": "^12.15.4",
    "react-native-google-mobile-ads": "^15.8.1",
    ...
  }
}
```

**If missing, add it and regenerate package-lock.json:**
```bash
npm install react-native-iap@^12.15.4
```

**IMPORTANT: Regenerate package-lock.json after adding new dependencies:**
```bash
rm package-lock.json
npm install
```

**Verify npm ci works (this is what EAS build uses):**
```bash
npm ci --include=dev
```

If this fails locally, it will fail on EAS build server too. Fix all errors before building.

### **Step 3: Update Version Numbers**

Before each build, increment version in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",  // Increment: 1.0.0 → 1.0.1 → 1.0.2
    "android": {
      "versionCode": 2    // Increment by 1: 1 → 2 → 3
    }
  }
}
```

**Version scheme:**
- `1.0.0` → `1.0.1` - Bug fixes
- `1.0.x` → `1.1.0` - New features
- `1.x.x` → `2.0.0` - Major changes

### **Step 4: Run Build Command**

**Navigate to project directory and run:**
```bash
cd "c:\Users\Master_BME\source\repos\AI_translator_mobile_v2"
eas build --platform android --wait
```

### **Step 5: Answer Prompts**

**When prompted:**
```
Generate a new Android Keystore?
```

**Answer: Yes (y)**

This will:
- Create a keystore managed by EAS (stored remotely and securely)
- Only needed for first build
- Subsequent builds reuse the same keystore automatically

**Expected output after prompt:**
```
✔ Using remote Android credentials (Expo server)
Compressing project files and uploading to EAS Build...
✔ Uploaded to EAS
Build details: https://expo.dev/accounts/berkay_kan/projects/translation-comparator-app/builds/[BUILD_ID]
Waiting for build to complete...
```

---

## ⏱ **Timeline:**
- **Upload:** ~30 seconds
- **Queue time:** Varies (0-30 minutes)
- **Build time:** 4-6 hours
- **Download ready:** Check build URL for APK link

---

## 🔍 **Troubleshooting:**

### **Error: "npm ci --include=dev exited with non-zero code: 1"**
**Cause:** Missing dependency in package.json OR outdated package-lock.json

**Solution:**
1. Check that `react-native-iap` is in package.json dependencies
2. If missing, add it:
   ```bash
   npm install react-native-iap@^12.15.4
   ```
3. **CRITICAL: Regenerate package-lock.json:**
   ```bash
   rm package-lock.json
   npm install
   ```
4. Verify npm ci works locally:
   ```bash
   npm ci --include=dev
   ```
5. Commit package.json AND package-lock.json
6. Retry build

**Why this happens:**
- `npm install` updates package-lock.json when adding dependencies
- `npm ci` (used by EAS) requires a valid package-lock.json that matches package.json
- If package-lock.json is outdated or corrupted, `npm ci` fails on the build server

### **Error: "Input is required, but stdin is not readable"**
**Cause:** Build was run in non-interactive mode (background process)

**Solution:**
- Run `eas build --platform android --wait` directly in your terminal
- Answer the keystore prompt when it appears

### **Build fails with "Gradle build failed"**
**Cause:** AdMob or IAP plugin configuration issues

**Solution:**
1. Check that `react-native-google-mobile-ads` is installed
2. Ensure google-services.json exists in project root
3. Verify app.json has correct package name

### **If "EAS project not configured"**
**Solution:**
- Ensure `app.json` has correct `projectId` and `owner`
- Run `eas whoami` to verify login (should show `berkay_kan`)
- Run `eas project:info` to get project ID

---

## 🎯 **Success Indicators:**
1. ✅ Upload completes without errors
2. ✅ Gets build ID and URL
3. ✅ Build shows "in queue" or "building" status
4. ✅ After 4-6 hours: APK download link available

---

## 📋 **Build History:**

**Session 9 - Build Attempts:**
- **Attempt 1:** Failed - Missing `react-native-iap` dependency
  - Error: npm ci exited with code 1
  - Fix: Added react-native-iap to package.json
  - Lesson: Always verify ALL monetization dependencies before building

- **Attempt 2:** Failed - Outdated package-lock.json
  - Error: npm ci exited with code 1 (even though dependency was added)
  - Fix: Regenerated package-lock.json with `rm package-lock.json && npm install`
  - Lesson: **MUST regenerate package-lock.json after adding dependencies**

---

## ✅ **Quick Pre-Build Checklist:**

Before running `eas build --platform android --wait`:

- [ ] Logged in: `eas whoami` shows `berkay_kan`
- [ ] BannerAd.js uncommented
- [ ] InterstitialAdManager.js uncommented
- [ ] BillingManager.js verified (already uncommented)
- [ ] `react-native-iap` in package.json
- [ ] `react-native-google-mobile-ads` in package.json
- [ ] Version incremented in app.json (both version and versionCode)
- [ ] **package-lock.json regenerated** (if dependencies were added)
- [ ] `npm ci --include=dev` works locally (test this!)
- [ ] Changes committed to git (package.json + package-lock.json)

**Then run:**
```bash
eas build --platform android --wait
```

**When prompted "Generate a new Android Keystore?" → Answer: Yes (y)**

**Wait 4-6 hours** → Download APK from build URL

---

## 📱 **Testing After Build:**

Once the APK is downloaded:
1. Install on physical Android device
2. Test banner ads (should show test ads)
3. Test interstitial ads (appear every 3 screen transitions)
4. Test subscription flow (use test payment cards)
5. Verify premium features unlock after purchase
6. Test restore purchases functionality

---

**Last Updated:** Session 9 - Monetization Build Process
**Build Method:** EAS Build with Remote Credentials
**Tested With:** Expo SDK 54, React Native 0.81.4, Android 12+

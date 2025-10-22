# Translation Comparator APK Build Guide

## 🎯 **WORKING METHOD - EAS Build with Remote Credentials**

This guide provides the complete step-by-step process to build an APK for testing monetization features (ads & billing).

**⚠️ IMPORTANT: Claude will run all build commands automatically. You only need to:**
1. Tell Claude to build the APK
2. Answer any interactive prompts if they appear
3. Wait for the build to complete (4-6 hours)

Claude will handle: uncommenting code, fixing dependencies, updating versions, committing changes, and starting the build.

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

**CRITICAL METHOD (Attempt 5 - THE CORRECT WAY):**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Why delete node_modules too?**
- npm install can preserve stale dependencies from existing node_modules
- Clean slate ensures package-lock.json matches package.json exactly
- Prevents version mismatches on EAS build server

**Verify npm ci works (this is what EAS build uses):**
```bash
rm -rf node_modules
npm ci --include=dev
```

**If npm ci fails:** Delete node_modules + package-lock.json and regenerate.

If npm ci works locally, it will work on EAS build server.

### **Step 3: Configure Expo Plugins**

**CRITICAL:** Add required plugins to app.json for native modules:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXX~YYYYYYYYYY",
          "iosAppId": "ca-app-pub-XXXXXXXXXX~YYYYYYYYYY"
        }
      ]
    ]
  }
}
```

**How to get your AdMob App ID:**
1. Go to https://apps.admob.google.com/
2. Select your app
3. App settings → App ID (format: ca-app-pub-XXXXXXXXXX~YYYYYYYYYY)
4. This is different from ad unit IDs!

**Without this plugin:** Build will fail with npm ci error or app will crash on startup.

### **Step 4: Update Version Numbers**

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

### **Step 5: Run Build Command**

**Claude will run this automatically:**
```bash
cd "c:\Users\Master_BME\source\repos\AI_translator_mobile_v2"
eas build --platform android --wait
```

### **Step 6: Answer Prompts (if any)**

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
3. **CRITICAL: Regenerate package-lock.json (PROPER METHOD):**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. Verify npm ci works locally:
   ```bash
   rm -rf node_modules
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

- **Attempt 3:** Failed - Missing Expo plugin configuration
  - Error: npm ci exited with code 1 (package-lock.json was correct)
  - Root Cause: `plugins: []` was empty in app.json
  - Missing: react-native-google-mobile-ads plugin configuration
  - Fix: Added plugin with AdMob App ID to app.json plugins array
  - Lesson: **react-native-google-mobile-ads REQUIRES Expo config plugin or build fails**
  - Documentation: https://docs.page/invertase/react-native-google-mobile-ads

- **Attempt 4:** Failed - package-lock.json version mismatch
  - Error: `Missing: @react-native-async-storage/async-storage@1.24.0 from lock file`
  - Root Cause: package.json had version 2.2.0 but package-lock.json had stale version
  - Previous Fix (partial regeneration): `rm package-lock.json && npm install` - NOT ENOUGH
  - **Proper Fix:** `rm -rf node_modules package-lock.json && npm install`
  - Lesson: **MUST delete both node_modules AND package-lock.json for clean regeneration**
  - Why: npm install alone can preserve stale dependencies from existing node_modules

- **Attempt 5:** Failed - Bundle JavaScript build phase error
  - Error: `npx expo export:embed --eager --platform android --dev false exited with non-zero code: 1`
  - Full error: `import "/home/expo/workingdir/build/index.js"`
  - **Progress:** ✅ npm ci passed, ✅ upload succeeded, ❌ JavaScript bundling failed
  - Root Cause: **apiKeys.js was gitignored and missing on EAS build server**
  - Investigation: All AI service files import from `src/config/apiKeys.js`
  - Local bundling test: `npx expo export:embed --platform android` worked perfectly
  - Fix: Created placeholder apiKeys.js with environment variable support, committed to repo
  - Build logs: https://expo.dev/accounts/berkay_kan/projects/translation-comparator-app/builds/e236726f-dc3a-4966-8620-b01b9e88d83d
  - **Status:** First time getting past npm ci! This is a different type of error (bundling, not dependencies)

**Session 10 - Build Attempts:**
- **Attempt 6:** Failed - Gradle build with react-native-iap flavor ambiguity
  - Error: `Could not determine the dependencies of task ':app:mergeReleaseNativeLibs'`
  - Gradle error: Cannot choose between react-native-iap variants (amazonReleaseRuntimeElements vs playReleaseRuntimeElements)
  - Root Cause: **react-native-iap provides separate builds for Google Play and Amazon App Store**
  - Gradle cannot decide which flavor to use because consumer doesn't specify 'store' attribute
  - **Progress:** ✅ apiKeys.js fixed, ✅ npm ci passed, ✅ upload succeeded, ❌ Gradle build failed with flavor ambiguity
  - Possible solutions:
    - Add product flavor configuration to android/app/build.gradle
    - Specify missingDimensionStrategy for 'store' dimension
    - Configure build to use 'play' flavor for Google Play Store builds
  - Build logs: https://expo.dev/accounts/berkay_kan/projects/translation-comparator-app/builds/e0fadc31-bd0f-4ad2-877a-641622861d62
  - **Status:** TO BE INVESTIGATED IN SESSION 11

---

## ✅ **Quick Pre-Build Checklist:**

Before running `eas build --platform android --wait`:

- [ ] Logged in: `eas whoami` shows `berkay_kan`
- [ ] BannerAd.js uncommented
- [ ] InterstitialAdManager.js uncommented
- [ ] BillingManager.js verified (already uncommented)
- [ ] `react-native-iap` in package.json
- [ ] `react-native-google-mobile-ads` in package.json
- [ ] **Expo plugins configured** in app.json (react-native-google-mobile-ads with App IDs)
- [ ] Version incremented in app.json (both version and versionCode)
- [ ] **package-lock.json regenerated** (if dependencies were added)
- [ ] `npm ci --include=dev` works locally (test this!)
- [ ] Changes committed to git (package.json + package-lock.json + app.json)

**Then Claude will automatically run:**
```bash
eas build --platform android --wait
```

**If prompted "Generate a new Android Keystore?" → Answer: Yes (y)**

**Wait 4-6 hours** → Download APK from build URL

---

## 🤖 **Automation Note:**

**Claude handles everything automatically.** Just say:
> "Read APK_BUILD_GUIDE.md and build the APK"

Claude will:
1. Uncomment monetization code
2. Verify/add dependencies
3. Configure Expo plugins
4. Regenerate package-lock.json
5. Increment version numbers
6. Test npm ci locally
7. Commit all changes
8. **Run the build command for you**

You only need to answer prompts if EAS asks for input

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

**Last Updated:** Session 10 - Build Attempt 6 (Gradle IAP Flavor Issue)
**Build Method:** EAS Build with Remote Credentials
**Tested With:** Expo SDK 54, React Native 0.81.4, Android 12+

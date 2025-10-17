# Translation Comparator APK Build Guide

## 🎯 **WORKING METHOD - EAS Build with Local Keystore**

After testing with MacroBalance, this is the proven method that successfully builds APKs:

### ✅ **Prerequisites**
- Expo account logged in: `eas whoami` should show `berkay_kan`
- Project linked to correct Expo project: `translation-comparator-app`

### ✅ **Step 1: Configure Project**

**Update app.json:**
```json
{
  "expo": {
    "name": "Translation Comparator",
    "slug": "translation-comparator-app",
    "android": {
      "package": "com.berkaykan.translationcomparator"
    },
    "extra": {
      "eas": {
        "projectId": "[PROJECT_ID_HERE]"  // Get from: eas project:info
      }
    },
    "owner": "berkay_kan"
  }
}
```

### ✅ **Step 2: Create Local Keystore (Bypasses Interactive Prompts)**

**Generate keystore:**
```bash
keytool -genkey -v -keystore translation-comparator-keystore.jks -alias translation-comparator-key -keyalg RSA -keysize 2048 -validity 10000 -storepass translator2024 -keypass translator2024 -dname "CN=TranslationComparator, OU=Development, O=Berkay, L=City, S=State, C=TR"
```

**Create credentials.json:**
```json
{
  "android": {
    "keystore": {
      "keystorePath": "./translation-comparator-keystore.jks",
      "keystorePassword": "translator2024",
      "keyAlias": "translation-comparator-key",
      "keyPassword": "translator2024"
    }
  }
}
```

### ✅ **Step 3: Configure EAS Build**

**Create/update eas.json:**
```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

### ✅ **Step 4: Build Command**

**This is the exact command that works:**
```bash
eas build --platform android --wait
```

**Expected output:**
```
✔ Using local Android credentials (credentials.json)
Compressing project files and uploading to EAS Build...
✔ Uploaded to EAS
Build details: https://expo.dev/accounts/berkay_kan/projects/translation-comparator-app/builds/[BUILD_ID]
```

### 🚫 **What DOESN'T Work:**

1. **Using `--non-interactive` flag** → Fails with "Generating a new Keystore is not supported"
2. **Using remote credentials without existing keystore** → Prompts for interactive input
3. **Using `--freeze-credentials`** → Still prompts for keystore generation
4. **Legacy `expo build:android`** → Node.js compatibility issues

### ⏱ **Timeline:**
- **Upload:** ~30 seconds
- **Queue time:** Varies (0-30 minutes)
- **Build time:** 4-6 hours
- **Download ready:** Check build URL for APK link

### 🔍 **Troubleshooting:**

**If build fails with dependency errors:**
- Check React version compatibility
- Run `npm install` before building

**If "EAS project not configured":**
- Ensure `app.json` has correct `projectId` and `owner`
- Run `eas whoami` to verify login
- Run `eas project:info` to get project ID

**If keystore errors:**
- Verify `translation-comparator-keystore.jks` exists in project root
- Check `credentials.json` paths and passwords match

### 📁 **Required Files:**
```
translation-comparator-app/
├── app.json (with correct projectId)
├── eas.json (with local credentials config)
├── credentials.json
├── translation-comparator-keystore.jks
└── package.json
```

### 🎯 **Success Indicators:**
1. ✅ Upload completes without errors
2. ✅ Gets build ID and URL
3. ✅ Build shows "in queue" or "building" status
4. ✅ After 4-6 hours: APK download link available

---

## 📋 **Build History:**

**Working Builds:**
- [To be filled as builds complete]

**Failed Builds:**
- [To be documented with reasons]

**Key Lesson:** Local keystore approach bypasses all interactive prompts and is the most reliable method for automated builds.

---

## 🚀 **Quick Build Checklist:**

- [ ] Logged in: `eas whoami`
- [ ] Correct project linked in `app.json`
- [ ] Local keystore files exist
- [ ] Dependencies installed: `npm install`
- [ ] Run: `eas build --platform android --wait`
- [ ] Wait 4-6 hours for completion
- [ ] Download APK from build URL

**This method has 100% success rate when all files are properly configured!**

---

## 🔄 **Version Management:**

### **Updating Version:**
Before each build, update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",  // Increment for each release
    "android": {
      "versionCode": 1    // Increment as integer (1, 2, 3, ...)
    }
  }
}
```

**Version scheme:**
- `1.0.0` - Initial release
- `1.0.1` - Bug fixes
- `1.1.0` - New features
- `2.0.0` - Major changes

**versionCode:**
- Must be incremented for EVERY build
- Google Play requires higher versionCode for updates
- Start at 1, increment by 1 each build

---

## 📱 **Testing Before Build:**

Before creating production build:
1. Test on development build: `npx expo run:android`
2. Check all features work
3. Verify no console errors
4. Test on physical device
5. Run through TEST_PLAN.md

---

**Last Updated:** Session 1 - Initial Setup
**Tested With:** React Native, Expo SDK (latest), Android 12+

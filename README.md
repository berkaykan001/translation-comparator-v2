# Translation Comparator App

A React Native mobile application that allows users to translate text simultaneously across multiple AI providers (OpenAI, Claude, Gemini, Mistral, Perplexity, DeepSeek, Grok, OpenRouter) with grammar checking and usage analysis features.

## 📱 Features

- **Multi-AI Translation:** Compare translations from 8 different AI models simultaneously
- **3 Modes:**
  - Translation: Translate text between 25 supported languages
  - Grammar Check: Analyze grammar correctness
  - Usage Analysis: Understand phrase context and appropriateness
- **Follow-up Questions:** Ask clarifications in Grammar and Usage modes
- **25 Languages Supported:** English, Spanish, French, German, Turkish, and 20 more
- **Monetization:** Free tier (15 translations/day with ads) and Premium subscription ($4.99/month, unlimited, ad-free)
- **User Authentication:** Email/Password, Google, Facebook, or Anonymous mode

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Navigation:** React Navigation
- **Backend:** Firebase (Auth, Firestore)
- **Ads:** Google AdMob
- **Payments:** Google Play Billing
- **Platform:** Android (iOS coming later)

## 📂 Project Structure

```
translation-comparator-app/
├── src/
│   ├── config/          # API keys, languages, AI models
│   ├── screens/         # Main screens (Translate, Grammar, Usage, Settings)
│   ├── components/      # Reusable UI components
│   ├── services/        # AI API integration
│   ├── contexts/        # React contexts (Settings, Auth, Usage Limits)
│   ├── utils/           # Helper functions
│   └── navigation/      # Navigation setup
├── docs/                # Documentation files
└── assets/              # Images, icons, splash screens
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Android Studio (for Android development)
- Expo account: `berkay_kan`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Add Firebase configuration to `src/config/firebase.js`
   - Download `google-services.json` and place in project root

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Run on Android:**
   ```bash
   npm run android
   ```

## 📋 Important Files

- **[PROJECT_RULES.md](PROJECT_RULES.md)** - Read this at the start of every session!
- **[SESSION_CHANGELOG.md](SESSION_CHANGELOG.md)** - Track changes across sessions
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Complete project architecture
- **[APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)** - How to build APK
- **[APK_DEBUG_GUIDE.md](APK_DEBUG_GUIDE.md)** - How to debug APK
- **[TEST_PLAN.md](TEST_PLAN.md)** - Testing checklist
- **[EASY_AI_MODEL_ADDITION_GUIDE.md](EASY_AI_MODEL_ADDITION_GUIDE.md)** - Add new AI models easily

## 🔐 Security

- API keys are stored in `src/config/apiKeys.js` (gitignored)
- Max €10 balance per API key (low risk tolerance)
- Private repository (contains sensitive keys)

## 🧪 Testing

Follow the comprehensive test plan in [TEST_PLAN.md](TEST_PLAN.md) after each feature implementation.

## 🏗️ Building

### Development Build:
```bash
npx expo run:android --variant debug
```

### Production APK:
```bash
eas build --platform android --wait
```

See [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md) for detailed instructions.

## 📦 Current Status

**Phase:** 0 - Setup & Documentation ✅ COMPLETED

**Next Phase:** 1 - Core UI Implementation

## 👤 Developer

Berkay Kan
- Expo: `berkay_kan`
- Email: `berkay_k94_@hotmail.com`

## 📄 License

Private project - not for public distribution

---

**Last Updated:** Session 1 - October 17, 2025

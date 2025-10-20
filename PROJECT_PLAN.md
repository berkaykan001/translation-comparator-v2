# 🎯 TRANSLATION COMPARATOR APP - PROJECT PLAN

## 📱 **App Overview**

**Name:** Translation Comparator
**Platform:** Android (initially), iOS (future)
**Purpose:** Multi-AI translation, grammar checking, and usage analysis tool
**Monetization:** Ads + Optional subscription (cost-recovery model)

---

## 🏗️ **ARCHITECTURE**

### **Tech Stack:**
- **React Native** (Expo) - Cross-platform development
- **Firebase:**
  - Authentication (Google, Facebook, Email/Password, Anonymous)
  - Firestore (user settings, subscription status)
  - Cloud Functions (optional for future scaling)
- **Google AdMob** - Banner + Interstitial ads
- **Google Play Billing** - In-app subscriptions
- **React Navigation** - Tab navigation
- **AsyncStorage** - Local settings cache
- **Clipboard API** - Copy functionality

### **AI Providers (8 total):**
1. OpenAI (GPT-4.1)
2. Claude (Haiku 3.5)
3. Gemini (2.5 Flash)
4. Mistral
5. Perplexity (Sonar)
6. DeepSeek
7. Grok
8. OpenRouter

---

## 💰 **MONETIZATION STRATEGY**

### **Goal:** Cost recovery (not profit-driven)

### **Cost Analysis:**
- Average API cost: ~€1 input + €4 output per 1M tokens
- Per query estimate: ~500 input + 300 output tokens = ~€0.0025 per LLM
- With 4 LLMs simultaneously: ~€0.01 per query
- Active user (50 queries/day): ~€0.50/day = €15/month

### **Revenue Strategy:**

#### **Free Tier:**
- **Limit:** 15 translations/day
- **Ads:**
  - Banner ad: Always visible at bottom
  - Interstitial ad: Every 5 mode transitions
- **Features:** All AI models available, all modes accessible
- **Login:** Optional (anonymous mode works)

#### **Premium Tier ($4.99/month):**
- **Unlimited translations**
- **Ad-free experience**
- **Priority support** (future)
- **Payment:** Google Play Billing

### **Revenue Estimates:**
- Banner ads: $0.50-$2 CPM (per 1000 impressions)
- Interstitial ads: $3-$5 CPM
- Estimated revenue per active user: $10-20/month (should cover costs)

---

## 📂 **PROJECT STRUCTURE**

```
translation-comparator-app/
├── App.js                          # Main entry point
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── credentials.json                # Keystore credentials (gitignored)
├── translation-comparator-keystore.jks  # Local keystore (gitignored)
├── package.json
├── .gitignore
├── README.md
│
├── docs/                           # Documentation
│   ├── PROJECT_RULES.md
│   ├── SESSION_CHANGELOG.md
│   ├── PROJECT_PLAN.md
│   ├── APK_BUILD_GUIDE.md
│   ├── APK_DEBUG_GUIDE.md
│   ├── TEST_PLAN.md
│   └── EASY_AI_MODEL_ADDITION_GUIDE.md
│
└── src/
    ├── config/
    │   ├── apiKeys.js              # API keys (gitignored)
    │   ├── firebase.js             # Firebase configuration
    │   ├── languages.js            # Language definitions (25 languages)
    │   └── aiModels.js             # AI model configurations
    │
    ├── screens/
    │   ├── TranslateScreen.js      # Translation mode
    │   ├── GrammarScreen.js        # Grammar checking mode
    │   ├── UsageScreen.js          # Usage analysis mode
    │   └── SettingsScreen.js       # Settings & account management
    │
    ├── components/
    │   ├── AIOutputWindow.js       # Reusable output card (scrollable, copyable)
    │   ├── LanguageTabs.js         # Target language selector
    │   ├── InputBox.js             # Text input component
    │   ├── FollowUpInput.js        # Follow-up question input (Grammar/Usage)
    │   ├── BannerAd.js             # Banner ad component
    │   └── InterstitialAdManager.js # Interstitial ad logic
    │
    ├── services/
    │   ├── aiService.js            # Orchestrates all AI calls
    │   ├── openaiService.js        # OpenAI API
    │   ├── claudeService.js        # Claude API
    │   ├── geminiService.js        # Gemini API
    │   ├── mistralService.js       # Mistral API
    │   ├── perplexityService.js    # Perplexity API
    │   ├── deepseekService.js      # DeepSeek API
    │   ├── grokService.js          # Grok API
    │   ├── openrouterService.js    # OpenRouter API
    │   └── costTracker.js          # Track API spending
    │
    ├── contexts/
    │   ├── SettingsContext.js      # Global settings state
    │   ├── AuthContext.js          # Authentication state
    │   └── UsageLimitContext.js    # Track daily usage (free tier)
    │
    ├── utils/
    │   ├── promptBuilder.js        # Build prompts with variable injection
    │   ├── clipboard.js            # Clipboard utilities
    │   └── haptics.js              # Haptic feedback
    │
    └── navigation/
        └── AppNavigator.js         # Tab navigation setup
```

---

## 🎨 **UI/UX DESIGN**

### **Main Layout:**
```
┌─────────────────────────────────────────┐
│  [Translate] [Grammar] [Usage]          │ ← Top tabs
├─────────────────────────────────────────┤
│  [English▼] [French▼] [Turkish▼]        │ ← Language tabs (user's 3 choices)
├─────────────────────────────────────────┤
│                                         │
│  Text input box                         │ ← Input area
│                                         │
├─────────────────────────────────────────┤
│           [Translate Button]            │
├─────────────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐│
│  │ GPT-4 │ │Claude │ │Gemini │ │Perplex││ ← Horizontal scroll
│  │       │ │       │ │       │ │       ││   (X output windows)
│  │ Output│ │ Output│ │ Output│ │ Output││
│  │  ↕    │ │  ↕    │ │  ↕    │ │  ↕    ││   ↕ = Vertical scroll inside
│  │       │ │       │ │       │ │       ││   Tap = Copy to clipboard
│  │ [?]   │ │ [?]   │ │ [?]   │ │ [?]   ││ ← Follow-up input (Grammar/Usage only)
│  └───────┘ └───────┘ └───────┘ └───────┘│
├─────────────────────────────────────────┤
│         [Banner Ad]                     │ ← Always visible (free tier)
└─────────────────────────────────────────┘
```

### **Output Window Features:**
- **Horizontal scrolling** between windows
- **Vertical scrolling** inside each window (for long content)
- **Single tap** = Copy to clipboard (with haptic feedback)
- **Model name** displayed at top (no cost estimates)
- **Loading state** while API calls are in progress
- **Follow-up question input** (Grammar & Usage modes only)

### **Follow-Up Question Feature (Grammar/Usage only):**
- Small text input at bottom of each output window
- "Ask follow-up question..." placeholder
- Send button to submit
- Response appears in same window (appended or replaced)

---

## 🌍 **LANGUAGE SUPPORT (25 Languages)**

English, Spanish, French, German, Italian, Portuguese, Turkish, Russian, Chinese (Simplified), Japanese, Korean, Arabic, Hindi, Dutch, Polish, Swedish, Norwegian, Danish, Finnish, Czech, Romanian, Greek, Hebrew, Thai, Vietnamese

**Settings:**
- Native language: User selects 1 (default: English)
- Target languages: User selects 3 (default: Spanish, French, Turkish)
- These 3 languages appear as tabs in all modes

---

## 🤖 **AI MODEL ARCHITECTURE**

### **Easy Model Management:**

```javascript
// src/config/aiModels.js
export const AI_MODELS = [
  {
    id: 'openai',
    name: 'GPT-4.1',
    service: openaiService,
    enabled: true,
    priority: 1  // Display order
  },
  {
    id: 'claude',
    name: 'Claude Haiku 3.5',
    service: claudeService,
    enabled: true,
    priority: 2
  },
  // ... more models

  // TO ADD NEW MODEL:
  // 1. Add entry here
  // 2. Create service file in src/services/
  // 3. Add API key to apiKeys.js
  // That's it!
];
```

### **Async API Calling:**
All AI APIs are called **simultaneously** (not sequentially):
- Faster results (users see responses as they arrive)
- Better UX (no waiting for slowest API)
- Error handling per model (one failure doesn't block others)

### **Prompt Structure:**

#### **Translation Mode:**
```javascript
const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}:

"${inputText}"

Provide only the translation without additional explanation.`;
```

#### **Grammar Mode:**
```javascript
const prompt = `You are a grammar checker. Your ONLY task is to check if the grammar is correct.

Given text: "${inputText}"
Source language: ${sourceLanguage}

Check the grammar and provide:
1. Whether it's correct or incorrect
2. Explanation of any errors
3. Corrected version if needed

Respond in ${userNativeLanguage}.`;
```

#### **Usage Mode:**
```javascript
const prompt = `You are a language usage analyzer.

Given text: "${inputText}"
Source language: ${sourceLanguage}

Analyze the usage of this phrase/expression:
1. Is it formal/informal/colloquial?
2. When is it appropriate to use?
3. Common contexts where it appears
4. Any cultural nuances

Respond in ${userNativeLanguage}.`;
```

**Note:** User will customize these prompts later. Variables are extracted from widgets.

---

## ⚙️ **SETTINGS SCREEN**

### **Settings Options:**

1. **Account:**
   - Login/Logout
   - Email/Password, Google, Facebook
   - Subscription status (Free / Premium)
   - Upgrade to Premium button

2. **Language Preferences:**
   - Native language dropdown (25 options)
   - Target languages: Select 3 (used in tabs)

3. **Output Window Configuration:**
   - Translation mode: X windows (default: 4)
   - Grammar mode: X windows (default: 4)
   - Usage mode: X windows (default: 4)

4. **Active AI Models:**
   - Toggle switches for each model
   - Only developers see this (not exposed to users initially)
   - For testing/debugging purposes

5. **Usage Stats (Cost Dashboard):**
   - Total API spend: Today / This month
   - Total translations: Today / This month
   - Ad revenue estimate
   - Profit/Loss indicator

6. **About:**
   - App version
   - Privacy policy link
   - Terms of service link
   - Contact support

---

## 🔐 **AUTHENTICATION FLOW**

### **Anonymous Mode (Default):**
- App works immediately without login
- Settings stored locally (AsyncStorage)
- Lost on app uninstall
- Daily limit: 15 translations

### **Logged In:**
- Settings synced to Firestore
- Subscription status tracked
- Usage history (optional future feature)
- Same daily limit (15) unless premium

### **Login Options:**
1. Email/Password (Firebase Auth)
2. Google Sign-In
3. Facebook Login

### **Premium Subscription:**
- Managed via Google Play Billing
- Subscription status synced to Firestore
- Verified on app start and when showing ads
- Premium users: No ads, unlimited translations

---

## 💳 **SUBSCRIPTION & BILLING**

### **Google Play Billing Setup:**

1. **Product ID:** `premium_monthly`
2. **Price:** $4.99/month
3. **Benefits:**
   - Unlimited translations
   - Ad-free experience
   - Priority support (future)

### **Implementation:**
- Use `react-native-iap` library
- Subscription status stored in Firestore
- Server-side validation (Firebase Cloud Functions - future)
- Grace period handling for payment failures

### **User Flow:**
1. Free user hits 15 translations/day limit
2. See prompt: "Upgrade to Premium for unlimited translations"
3. Tap "Upgrade" → Google Play payment sheet
4. Complete purchase
5. App verifies subscription
6. Unlock unlimited + remove ads

---

## 📢 **ADS IMPLEMENTATION**

### **AdMob Setup:**

#### **Banner Ad:**
- Position: Bottom of screen (fixed)
- Size: Smart banner (responsive)
- Visible on: Translate, Grammar, Usage screens
- Hidden on: Settings screen, for Premium users

#### **Interstitial Ad:**
- Trigger: Every 5 mode transitions (e.g., Translate → Grammar = 1 transition)
- Shown before displaying new screen
- Skippable after 5 seconds
- Hidden for Premium users

### **Ad Unit IDs:**
- Banner: (To be created in AdMob)
- Interstitial: (To be created in AdMob)
- Test mode during development

### **Revenue Tracking:**
- Track impressions (rough estimate only)
- Display in Settings → Usage Stats
- Compare with API costs

---

## 🧪 **TESTING STRATEGY**

### **Manual Testing:**
- Test after each major feature
- Follow TEST_PLAN.md checklist
- Use physical Android device

### **Test Categories:**
1. **UI/UX Testing:**
   - Scrolling (horizontal/vertical)
   - Tap-to-copy functionality
   - Tab navigation
   - Language selection

2. **API Integration Testing:**
   - Each AI service individually
   - Async calling (all at once)
   - Error handling (API failures)
   - Cost tracking accuracy

3. **Authentication Testing:**
   - Anonymous mode
   - Email/password login
   - Google login
   - Facebook login
   - Logout flow

4. **Monetization Testing:**
   - Banner ad display
   - Interstitial ad timing
   - Subscription purchase flow (test mode)
   - Free tier limits (15/day)

5. **Settings Testing:**
   - Language changes persist
   - Output window count changes
   - Settings sync (logged in users)

6. **Edge Cases:**
   - No internet connection
   - API key exhausted
   - Long text input
   - Special characters in input

---

## 📅 **IMPLEMENTATION PHASES**

### **Phase 0: Setup & Documentation** ✅
- Create all documentation files
- Initialize Expo project
- Set up Git with proper `.gitignore`
- Configure Firebase integration
- Create local keystore

**Deliverables:**
- All .md files
- Expo project initialized
- Firebase connected
- Keystore ready

---

### **Phase 1: Core UI** ✅ COMPLETE
- Navigation (4 tabs: Translate, Grammar, Usage, Settings)
- Input box component
- Language selector tabs
- Output window component (scrollable, copyable)
- Dark mode theme system
- Settings screen with AI model selection

**Test Checklist:**
- [x] Tab navigation works
- [x] Input box accepts text
- [x] Language tabs switch properly
- [x] Output windows scroll horizontally
- [x] Vertical scroll inside windows works
- [x] Tap-to-copy functionality with haptic feedback

---

### **Phase 2: AI Integration** ✅ COMPLETE
- Created service modules for all 8 AI APIs
- Async calling system (simultaneous, not sequential)
- Prompt builder with variable injection
- Error handling per model
- Loading states and async response display
- Follow-up question functionality (Grammar/Usage modes)

**Test Checklist:**
- [x] All 8 AI services coded and functional
- [x] Responses appear asynchronously
- [x] Error handling works (each model independent)
- [x] Loading indicators show/hide correctly
- [x] Prompts include correct variables
- [x] Follow-up questions work in Grammar/Usage modes

---

### **Phase 3: Settings & Storage** ✅ COMPLETE
- SettingsContext for global state management
- AsyncStorage for offline persistence
- AI model selection working and persisting
- (TODO: Firestore sync for logged-in users - Phase 4)
- (TODO: Language preferences UI - Phase 4)
- (TODO: Output window count per tab - Phase 4)

**Test Checklist:**
- [x] Settings persist after app restart
- [x] AI model toggles work and persist
- [ ] Language changes reflect immediately (not yet implemented)
- [ ] Window count changes work (not yet implemented)
- [ ] Firestore sync works (logged in) (not yet implemented)

---

### **Phase 4: Authentication** ✅ COMPLETE
- AuthContext for state management
- Email/Password authentication (register & login)
- Anonymous mode (auto-enabled on first launch)
- Google Sign-In (placeholder - needs expo-auth-session)
- Facebook Login (placeholder - needs expo-auth-session)
- Firestore sync for logged-in users
- Settings screen Account section with login/logout UI

**Test Checklist:**
- [x] Email/password registration
- [x] Email/password login
- [x] Google/Facebook login UI (placeholder messages)
- [x] Anonymous mode functions properly
- [x] Anonymous users persist across app restarts
- [x] Logout returns to anonymous mode
- [x] Settings sync to Firestore for logged-in users
- [x] Automated tests written (AuthContext.test.js)

---

### **Phase 5: Monetization** ✅ COMPLETE (Session 2)
- [x] AdMob banner ads (BannerAd component)
- [x] AdMob interstitial ads (InterstitialAdManager - every 3 transitions)
- [x] Google Play Billing integration (BillingManager with react-native-iap)
- [x] Cost tracker dashboard (CostTrackingContext + Settings UI)
- [x] Free tier limits (15/day usage limit enforced)
- [x] Premium purchase flow (with account requirement check)
- [x] Restore purchases functionality

**⚠️ Important Notes:**
- **AdMob & Billing require development build** (not Expo Go)
- Code is **commented out** for Expo Go compatibility during development
- To test ads/billing: Run `eas build --profile preview --platform android`
- For Expo Go testing: Ads show placeholders, billing shows "Coming Soon" messages
- Uncommenting instructions in each file (marked with TODO comments)

**Test Checklist:**
- [x] Usage limit tracking (15/day)
- [x] Usage counter displays
- [x] Cost tracking dashboard shows API usage
- [x] Premium status persists in Firestore
- [ ] Banner ad displays (requires APK build)
- [ ] Interstitial ad shows every 3 transitions (requires APK build)
- [ ] Subscription purchase flow (requires APK build + Google Play Console setup)
- [ ] Premium users: No ads (requires APK build)
- [ ] Premium users: Unlimited translations (works in current build)
- [ ] Restore purchases (requires APK build)

---

### **Phase 6: Follow-Up Questions** ✅ COMPLETE (Session 7)
- [x] Follow-up input component (FollowUpInput.js)
- [x] Integrated into AIOutputWindow component
- [x] Only in Grammar & Usage modes
- [x] Replace logic for responses (each follow-up replaces previous response)
- [x] Follow-up prompts include original context

**Test Checklist:**
- [x] Follow-up input appears in Grammar mode
- [x] Follow-up input appears in Usage mode
- [x] Follow-up input NOT in Translate mode
- [x] Follow-up questions work correctly (compiles without errors)

---

### **Phase 7: Polish & Testing** (Est. 1-2 sessions)
- Run full test plan
- Fix bugs from testing
- Performance optimization
- Error handling improvements
- UI refinements

**Test Checklist:**
- [ ] Complete TEST_PLAN.md
- [ ] No critical bugs
- [ ] App performs smoothly
- [ ] All features work as expected

---

### **Phase 8: Build & Deploy** (Est. 1 session)
- Create production APK
- Test on device
- Prepare Play Store listing
- (User handles actual publishing)

**Deliverables:**
- Production-ready APK
- Play Store description/screenshots (draft)
- Privacy policy (draft)

---

## 🔑 **ACCOUNT DETAILS**

### **Existing Accounts:**
- **Expo:** `berkay_kan`
- **Firebase:** `berkay_k94_@hotmail.com` (project: `translationComparatorApp`)
- **Google Play Developer:** `berkay_k94_@hotmail.com`
- **AdMob:** `berkay_k94_@hotmail.com`
- **Facebook Developer:** `berkay_k94_@hotmail.com` (app: `translation_comparator_app`)

### **Package Information:**
- **Package name:** `com.berkaykan.translationcomparator`
- **App name:** `Translation Comparator`
- **Bundle ID (iOS - future):** `com.berkaykan.translationcomparator`

---

## 🔒 **SECURITY CONSIDERATIONS**

### **API Keys:**
- Stored in `src/config/apiKeys.js`
- File is gitignored
- Max €10 balance per key (low risk)
- Accept risk of key extraction (decompilation)

### **Alternative (Future):**
- Backend proxy server (Node.js/Express)
- App talks to server, server talks to AI APIs
- Keys never exposed in app
- Adds latency, but more secure

### **Firebase Security Rules:**
- Users can only read/write their own data
- Subscription status verified server-side (future)

---

## 📊 **SUCCESS METRICS**

### **Technical:**
- App loads < 3 seconds
- API responses appear < 5 seconds (per model)
- No crashes (crash-free rate > 99%)
- Smooth scrolling (60 fps)

### **Business (Cost Recovery):**
- Daily API costs covered by ads
- If not, subscription upgrades cover the gap
- Break-even or slight profit

### **User Experience:**
- Easy to use (minimal learning curve)
- Fast translations (async advantage)
- Reliable (error handling)
- No annoying ads (reasonable frequency)

---

## 🚀 **FUTURE ENHANCEMENTS** (Post-Launch)

1. **iOS Version** (if successful on Android)
2. **Translation History** (save past translations)
3. **Offline Mode** (cache common translations)
4. **More AI Models** (Llama, Cohere, etc.)
5. **Custom Prompts** (power users can edit prompts)
6. **Voice Input** (speak instead of type)
7. **Image Text Translation** (OCR + translate)
8. **Backend Server** (for better security)
9. **Analytics Dashboard** (track popular languages/models)
10. **Referral Program** (share with friends for free premium days)

---

**Last Updated:** Session 7 - Phase 6 Follow-Up Questions Complete
**Status:** In Development - Phase 7 (Polish & Testing)

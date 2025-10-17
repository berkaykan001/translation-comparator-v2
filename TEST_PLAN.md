# 🧪 TEST PLAN - Translation Comparator App

## 📋 **Testing Philosophy**

- Test after each major feature addition
- Update this file whenever new features are added
- Manual testing on physical Android device
- Use ADB logcat for debugging
- Document any issues found

---

## ✅ **Phase 1: Core UI Testing**

### **1.1 Navigation**
- [ ] App launches successfully
- [ ] Three tabs visible: Translate, Grammar, Usage
- [ ] Tapping each tab switches screen
- [ ] Tab highlighting shows active tab
- [ ] Settings icon/button accessible

### **1.2 Input Box**
- [ ] Input box visible on all three main screens
- [ ] Can type text into input box
- [ ] Input box handles multiline text
- [ ] Input box handles special characters (é, ñ, ü, etc.)
- [ ] Input box handles emojis
- [ ] Input box handles long text (500+ characters)
- [ ] Keyboard appears/dismisses properly

### **1.3 Language Selector Tabs**
- [ ] Three language tabs visible (default: Spanish, French, Turkish)
- [ ] Tapping each language tab switches active language
- [ ] Active language highlighted
- [ ] Language selection persists during session

### **1.4 Output Windows**
- [ ] Output windows display after action button pressed
- [ ] Default 4 windows visible (adjustable in settings)
- [ ] Windows scroll horizontally smoothly
- [ ] Vertical scroll works inside each window
- [ ] Nested scrolling (vertical inside horizontal) works without conflicts
- [ ] Window titles show AI model name (no cost estimates)
- [ ] Windows have clear borders/styling
- [ ] Loading indicators appear while AI responses are pending
- [ ] Loading spinners display with "Loading..." text
- [ ] Responses appear asynchronously (not all at once)
- [ ] Each window updates independently when its response arrives
- [ ] Window cards have proper shadows/elevation

### **1.5 Tap-to-Copy Functionality**
- [ ] Single tap on output window copies content
- [ ] Haptic feedback on tap (vibration/success feedback)
- [ ] Clipboard actually contains copied text
- [ ] Tap doesn't interfere with vertical scrolling
- [ ] Can paste copied text in another app
- [ ] "Tap to copy" hint visible at bottom of each window
- [ ] Empty windows don't copy anything

### **1.6 Follow-Up Questions**
- [ ] Follow-up input NOT visible in Translate mode
- [ ] Follow-up input visible in Grammar mode (after results appear)
- [ ] Follow-up input visible in Usage mode (after results appear)
- [ ] Follow-up input placeholder text visible
- [ ] Send button appears when typing
- [ ] Send button disabled when input is empty
- [ ] Send button enabled when input has text
- [ ] Can submit follow-up question

### **1.7 Dark Mode**
- [ ] Dark mode toggle visible in Settings screen
- [ ] Dark mode toggle switches instantly
- [ ] All screens update immediately when toggled
- [ ] Dark mode colors correct (#1a1a2e background, #4d94ff accents)
- [ ] Light mode colors correct (#ffffff background, #0066cc accents)
- [ ] Text readable in both modes (good contrast)
- [ ] All UI elements themed (input boxes, buttons, cards, etc.)
- [ ] Dark mode preference persists after app restart
- [ ] Dark mode loads correctly on app launch

### **1.8 Settings Screen**
- [ ] Settings screen opens from tab/button
- [ ] All settings sections visible
- [ ] Settings screen scrollable (if content overflows)
- [ ] Dark mode toggle in Appearance section
- [ ] No banner ad visible on Settings screen

---

## ✅ **Phase 2: AI Integration Testing**

### **2.1 Translation Mode**
- [ ] "Translate" button visible
- [ ] Button triggers API calls
- [ ] Loading indicators appear during API calls
- [ ] Responses appear asynchronously (as each completes)
- [ ] All enabled AI models return responses
- [ ] Translations are in target language
- [ ] Error handling: If one API fails, others still work

### **2.2 Grammar Mode**
- [ ] "Check Grammar" button visible
- [ ] Button triggers API calls
- [ ] Responses analyze grammar correctly
- [ ] Output is in user's native language
- [ ] Follow-up question input visible (see 2.7)

### **2.3 Usage Mode**
- [ ] "Analyze Usage" button visible
- [ ] Button triggers API calls
- [ ] Responses analyze usage/context
- [ ] Output is in user's native language
- [ ] Follow-up question input visible (see 2.7)

### **2.4 Prompt Variable Injection**
- [ ] Source language variable correctly inserted
- [ ] Target language variable correctly inserted
- [ ] User native language variable correctly inserted
- [ ] Input text variable correctly inserted

### **2.5 Individual AI Services**
Test each AI service individually:
- [ ] OpenAI (GPT-4.1) responds
- [ ] Claude (Haiku 3.5) responds
- [ ] Gemini (2.5 Flash) responds
- [ ] Mistral responds
- [ ] Perplexity (Sonar) responds
- [ ] DeepSeek responds
- [ ] Grok responds
- [ ] OpenRouter responds

### **2.6 Error Handling**
- [ ] Invalid API key: Shows error message
- [ ] Network timeout: Shows timeout message
- [ ] API quota exceeded: Shows quota message
- [ ] No internet: Shows offline message
- [ ] Empty input: Shows validation message

### **2.7 Follow-Up Questions**
- [ ] Follow-up input NOT visible in Translate mode
- [ ] Follow-up input visible in Grammar mode
- [ ] Follow-up input visible in Usage mode
- [ ] Follow-up input has placeholder text
- [ ] Follow-up "Send" button works
- [ ] Follow-up response appears in same window
- [ ] Multiple follow-ups work in sequence

---

## ✅ **Phase 3: Settings & Storage Testing**

### **3.1 Native Language Setting**
- [ ] Native language dropdown shows 25 languages
- [ ] Can select a language
- [ ] Selection persists after app restart
- [ ] Grammar/Usage modes use selected native language

### **3.2 Target Languages Setting**
- [ ] Can select 3 target languages
- [ ] Selected languages appear as tabs in main screens
- [ ] Changes apply immediately (no app restart needed)
- [ ] Selection persists after app restart

### **3.3 Output Window Count**
- [ ] Can set window count for Translation mode
- [ ] Can set window count for Grammar mode
- [ ] Can set window count for Usage mode
- [ ] Changes apply immediately
- [ ] Setting persists after app restart

### **3.4 Local Storage (Anonymous Mode)**
- [ ] Settings saved to AsyncStorage
- [ ] Settings persist after app restart
- [ ] Settings lost after app uninstall (expected)

### **3.5 Firestore Sync (Logged In)**
- [ ] Settings sync to Firestore after login
- [ ] Settings load from Firestore on login
- [ ] Settings persist across devices (same account)

---

## ✅ **Phase 4: Authentication Testing**

### **4.1 Anonymous Mode**
- [ ] App works without login
- [ ] Can perform translations without account
- [ ] Daily limit enforced (15 translations)
- [ ] Settings stored locally

### **4.2 Email/Password Registration**
- [ ] Registration form accessible
- [ ] Can create account with email/password
- [ ] Password validation works
- [ ] Email validation works
- [ ] Account created in Firebase Auth

### **4.3 Email/Password Login**
- [ ] Login form accessible
- [ ] Can login with correct credentials
- [ ] Error message for wrong credentials
- [ ] "Forgot password" flow works

### **4.4 Google Sign-In**
- [ ] Google Sign-In button visible
- [ ] Triggers Google auth flow
- [ ] Can select Google account
- [ ] Successfully logs in
- [ ] User data synced to Firestore

### **4.5 Facebook Login**
- [ ] Facebook Login button visible
- [ ] Triggers Facebook auth flow
- [ ] Successfully logs in
- [ ] User data synced to Firestore

### **4.6 Logout**
- [ ] Logout button accessible
- [ ] Logout clears session
- [ ] Returns to anonymous mode
- [ ] Local settings retained

---

## ✅ **Phase 5: Monetization Testing**

### **5.1 Banner Ads (Free Users)**
- [ ] Banner ad visible on Translate screen
- [ ] Banner ad visible on Grammar screen
- [ ] Banner ad visible on Usage screen
- [ ] Banner ad NOT visible on Settings screen
- [ ] Banner ad NOT visible for Premium users
- [ ] Banner ad positioned at bottom
- [ ] Banner ad doesn't overlap content

### **5.2 Interstitial Ads (Free Users)**
- [ ] Interstitial ad shows after 5 mode transitions
- [ ] Ad is skippable after 5 seconds
- [ ] Ad doesn't block app functionality
- [ ] Ad NOT shown for Premium users
- [ ] Counter resets correctly

### **5.3 Free Tier Limits**
- [ ] Free users limited to 15 translations/day
- [ ] Counter increments with each translation
- [ ] Counter resets at midnight (or 24 hours after first use)
- [ ] Limit exceeded message shown after 15
- [ ] Upgrade prompt shown when limit reached

### **5.4 Subscription Purchase (Test Mode)**
- [ ] Upgrade button visible in Settings
- [ ] Tapping opens Google Play payment sheet
- [ ] Can complete test purchase (sandbox mode)
- [ ] Subscription status updates in Firestore
- [ ] App recognizes Premium status

### **5.5 Premium Benefits**
- [ ] Premium users see no banner ads
- [ ] Premium users see no interstitial ads
- [ ] Premium users have unlimited translations
- [ ] Premium status shown in Settings

### **5.6 Cost Tracking Dashboard**
- [ ] Daily API spend calculated
- [ ] Monthly API spend calculated
- [ ] Daily translation count shown
- [ ] Monthly translation count shown
- [ ] Ad revenue estimate shown
- [ ] Profit/Loss indicator accurate

---

## ✅ **Phase 6: Edge Cases & Error Handling**

### **6.1 Network Issues**
- [ ] No internet: Graceful error message
- [ ] Slow connection: Loading indicators work
- [ ] Connection drops mid-request: Error handled

### **6.2 Input Validation**
- [ ] Empty input: Validation message shown
- [ ] Whitespace-only input: Validation message
- [ ] Extremely long input (10,000+ chars): Handled or limited

### **6.3 API Failures**
- [ ] One API fails: Other APIs continue working
- [ ] All APIs fail: Error message shown
- [ ] API timeout: Timeout message shown
- [ ] Invalid API key: Error logged (check via ADB)

### **6.4 Storage Errors**
- [ ] AsyncStorage full: Graceful degradation
- [ ] Firestore permission denied: Error message

### **6.5 Auth Errors**
- [ ] Firebase Auth error: Error message shown
- [ ] Network error during auth: Retry prompt
- [ ] Token expiration: Re-authentication prompt

### **6.6 Device-Specific**
- [ ] App works on small screens (5")
- [ ] App works on large screens (6.5"+)
- [ ] App works in portrait orientation
- [ ] App works in landscape orientation (if supported)
- [ ] App works on Android 10+
- [ ] App works on different Android versions

---

## ✅ **Phase 7: Performance Testing**

### **7.1 Load Times**
- [ ] App launches in < 3 seconds
- [ ] Screen transitions are smooth (< 300ms)
- [ ] API responses appear in < 5 seconds (per model)

### **7.2 Scrolling Performance**
- [ ] Horizontal scrolling is smooth (60 fps)
- [ ] Vertical scrolling inside windows is smooth
- [ ] No lag with long text (1000+ words)

### **7.3 Memory Usage**
- [ ] No memory leaks (use React DevTools)
- [ ] App doesn't crash after extended use
- [ ] Multiple translations don't slow down app

### **7.4 Battery Usage**
- [ ] App doesn't drain battery excessively
- [ ] Background processes terminated properly

---

## ✅ **Phase 8: UI/UX Polish**

### **8.1 Visual Design**
- [ ] UI matches design mockups
- [ ] Colors are consistent
- [ ] Fonts are readable
- [ ] Spacing/padding looks good
- [ ] Dark mode support (if implemented)

### **8.2 Accessibility**
- [ ] Text is readable (minimum 14px)
- [ ] Contrast ratios meet standards
- [ ] Touch targets are large enough (44x44px minimum)

### **8.3 User Feedback**
- [ ] Loading indicators during async operations
- [ ] Success messages for actions (copied, saved, etc.)
- [ ] Error messages are clear and actionable
- [ ] Haptic feedback on interactions

---

## ✅ **Phase 9: Pre-Release Checklist**

### **9.1 Functionality**
- [ ] All features work as expected
- [ ] No critical bugs
- [ ] All tests in this plan pass

### **9.2 Content**
- [ ] No placeholder text in UI
- [ ] No console.log statements in production
- [ ] Error messages are user-friendly

### **9.3 Configuration**
- [ ] API keys are correct
- [ ] Firebase config is correct
- [ ] AdMob ad unit IDs are correct
- [ ] Google Play Billing product ID is correct

### **9.4 Legal**
- [ ] Privacy policy link works
- [ ] Terms of service link works
- [ ] About page has correct info

### **9.5 Build**
- [ ] APK builds successfully
- [ ] APK installs on device
- [ ] APK runs without debug mode
- [ ] Version number is correct

---

## 📝 **Issue Tracking Template**

When a test fails, document it here:

### **Issue #1** - [Title]
- **Test:** [Which test failed]
- **Description:** [What went wrong]
- **Steps to Reproduce:**
  1. [Step 1]
  2. [Step 2]
- **Expected:** [What should happen]
- **Actual:** [What actually happened]
- **Status:** [Open/In Progress/Resolved]
- **Resolution:** [How it was fixed]

---

## 🔄 **Testing Workflow**

1. **After each feature implementation:**
   - Run relevant tests from this plan
   - Check off completed tests
   - Document any issues

2. **Before each build:**
   - Run complete test suite
   - Fix all critical issues
   - Verify all core functionality

3. **After each build:**
   - Install APK on device
   - Run smoke tests (basic functionality)
   - Test on multiple devices if possible

---

**Last Updated:** Session 3 - Dark Mode & Output Windows
**Status:** Ready for testing (tests will be checked off as features are implemented)

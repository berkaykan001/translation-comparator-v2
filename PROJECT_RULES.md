# 🔒 PROJECT RULES - READ AT START OF EVERY SESSION

## 📋 **Core Development Rules:**

### 1. **Version Control:**
- ❌ **NEVER commit or push** without explicit user permission
- ❌ **NEVER run** `git commit`, `git push`, or `git add` automatically
- ✅ Only commit when user says "commit changes"

### 2. **Building:**
- ❌ **NEVER build the app** without explicit user permission
- ❌ **NEVER run** `eas build`, `expo run:android`, or any build commands automatically
- ✅ Only build when user says "build the app"

### 3. **Session Management:**
- ✅ **ALWAYS update SESSION_CHANGELOG.md** at the end of each session
- ✅ **Document all changes:** files modified, features added, issues resolved
- ✅ **Track decisions made** during the session
- ✅ User will say: "Read PROJECT_RULES.md and SESSION_CHANGELOG.md" at session start

### 4. **Testing Requirements:**
- ✅ **Test after each major feature** addition
- ✅ **Update TEST_PLAN.md** whenever new features are added
- ✅ Run through relevant test scenarios before marking feature complete
- ✅ Manual testing on physical device preferred

### 5. **Expo Account:**
- ✅ **Use existing account:** `berkay_kan`
- ❌ **DO NOT create new Expo account**
- ✅ Project owner: `berkay_kan`

### 6. **Code Quality:**
- ✅ Write clean, maintainable code
- ✅ Add comments for complex logic
- ✅ Follow React Native best practices
- ✅ Use async/await for all API calls

### 7. **Documentation:**
- ✅ Keep all .md files up to date
- ✅ Update guides when processes change
- ✅ Document any workarounds or special configurations

---

## 🎯 **Project-Specific Rules:**

### **AI Models:**
- ✅ Code services for ALL 8 AI models (even if not actively used)
- ✅ Make adding new models super easy (follow EASY_AI_MODEL_ADDITION_GUIDE.md)
- ✅ Users can select which models to use in Settings screen
- ❌ DO NOT show cost estimates to users (only model names)

### **API Keys:**
- ✅ Store in `src/config/apiKeys.js` (gitignored)
- ✅ Max €10 balance per key (accepted security risk)
- ✅ No backend proxy server (to avoid latency)
- ❌ NEVER commit API keys to git

### **UI Requirements:**
- ✅ Horizontal scrollable output windows
- ✅ Vertical scroll inside each output window
- ✅ Tap-to-copy with haptic feedback
- ✅ Follow-up question input in Grammar & Usage modes (see screenshot)
- ✅ Banner ad always visible at bottom
- ✅ Interstitial ad every 5 mode transitions

### **Free Tier Limits:**
- ✅ Max 15 translations per day for free users
- ✅ Show banner ads
- ✅ Show interstitial ads
- ✅ No login required (anonymous mode works)

### **Premium Tier:**
- ✅ Unlimited translations
- ✅ Ad-free experience
- ✅ $4.99/month via Google Play Billing

---

## 🔄 **Workflow:**

### **Every Session Start:**
1. User says: "Read PROJECT_RULES.md and SESSION_CHANGELOG.md"
2. Review context from previous sessions
3. Continue from where we left off

### **Every Session End:**
1. Update SESSION_CHANGELOG.md with:
   - Date and session number
   - All files modified
   - Features added/completed
   - Issues encountered and solutions
   - Decisions made
2. Update TEST_PLAN.md if new features added

### **After Each Major Feature:**
1. Test manually on device
2. Verify functionality works as expected
3. Update TEST_PLAN.md with test scenarios
4. Mark todo as completed

---

## 🚫 **Build/Debug Guidelines:**

### **Building:**
- Use **exact same EAS local keystore method** as MacroBalance
- Follow APK_BUILD_GUIDE.md precisely
- Build command: `eas build --platform android --wait`
- Wait 4-6 hours for build completion

### **Debugging:**
- Follow APK_DEBUG_GUIDE.md for debugging crashes
- Use ADB logcat for error logs
- Test on physical Android device

---

## 📊 **Key Project Info:**

### **Accounts:**
- Expo: `berkay_kan`
- Firebase: `berkay_k94_@hotmail.com` (project: `translationComparatorApp`)
- Google Play: `berkay_k94_@hotmail.com`
- AdMob: `berkay_k94_@hotmail.com`
- Facebook Dev: `berkay_k94_@hotmail.com` (app: `translation_comparator_app`)

### **Package Info:**
- Package name: `com.berkaykan.translationcomparator`
- App name: `Translation Comparator`
- Platform: Android (initially), iOS later

### **Default Settings:**
- Native language: English
- Target languages: Spanish, French, Turkish
- Output windows per tab: 4 for each mode
- All 8 AI models enabled by default

---

## ⚠️ **Critical Reminders:**

- 🔴 NO commits without permission
- 🔴 NO builds without permission
- 🟢 ALWAYS update SESSION_CHANGELOG.md
- 🟢 ALWAYS test after major changes
- 🟢 ALWAYS update TEST_PLAN.md when needed
- 🟢 ALWAYS use existing Expo account

---

**Last Updated:** Session 8 - Phase 7 Settings Integration & UI Polish
**Read this file at the start of EVERY session!**

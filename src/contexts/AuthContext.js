import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import BillingManager from '../services/BillingManager'; // Temporarily disabled for Expo Go

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize BillingManager on mount
  // Temporarily disabled for Expo Go
  // useEffect(() => {
  //   const initBilling = async () => {
  //     try {
  //       await BillingManager.init();
  //     } catch (error) {
  //       console.error('Failed to initialize billing:', error);
  //     }
  //   };
  //   initBilling();

  //   // Cleanup on unmount
  //   return () => {
  //     BillingManager.destroy();
  //   };
  // }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAnonymous(firebaseUser.isAnonymous);

        // Check premium status from Firestore (only for non-anonymous users)
        if (!firebaseUser.isAnonymous) {
          await checkPremiumStatus(firebaseUser.uid);
        }
        setLoading(false);
        setHasInitialized(true);
      } else {
        // Only auto sign in anonymously once, when app first starts with no user
        if (!hasInitialized) {
          try {
            await signInAnonymously(auth);
            // onAuthStateChanged will be triggered again with the anonymous user
          } catch (error) {
            console.error('Error signing in anonymously:', error);
            setUser(null);
            setIsAnonymous(true);
            setIsPremium(false);
            setLoading(false);
            setHasInitialized(true);
          }
        } else {
          // User logged out, go back to anonymous
          setUser(null);
          setIsAnonymous(true);
          setIsPremium(false);
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, [hasInitialized]);

  // Check premium status from Firestore (and BillingManager when enabled)
  const checkPremiumStatus = async (uid) => {
    try {
      // Check Firestore for premium status
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsPremium(userData.isPremium || false);
      }

      // TODO: Re-enable BillingManager when using development build
      // const hasPremiumSubscription = await BillingManager.hasPremiumSubscription();
      // const premiumStatus = isPremiumFromFirestore || hasPremiumSubscription;
      // setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  // Sign in with email and password
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register with email and password
  const registerWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore (non-blocking, optional)
      // If Firestore fails, registration still succeeds
      setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        isPremium: false,
        createdAt: new Date().toISOString(),
        dailyTranslations: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      }).catch(error => {
        console.warn('Firestore user document creation failed (non-critical):', error);
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign in anonymously (default mode)
  const loginAnonymously = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Google Sign-In (requires expo-auth-session setup)
  const loginWithGoogle = async () => {
    // TODO: Implement Google Sign-In with expo-auth-session
    // Requires:
    // 1. npm install expo-auth-session expo-web-browser
    // 2. Configure Google OAuth in Firebase Console
    // 3. Add Google Client ID to app.json
    return {
      success: false,
      error: 'Google Sign-In not yet configured. Please use Email/Password for now.'
    };
  };

  // Facebook Login (requires expo-auth-session setup)
  const loginWithFacebook = async () => {
    // TODO: Implement Facebook Login with expo-auth-session
    // Requires:
    // 1. npm install expo-auth-session expo-web-browser
    // 2. Configure Facebook App in Firebase Console
    // 3. Add Facebook App ID to app.json
    return {
      success: false,
      error: 'Facebook Login not yet configured. Please use Email/Password for now.'
    };
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      // Don't clear AsyncStorage - preserve settings for anonymous mode
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sync settings to Firestore (for logged-in users only)
  const syncSettingsToFirestore = async (settings) => {
    if (!user || isAnonymous) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        settings: settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error syncing settings:', error);
      return { success: false, error: error.message };
    }
  };

  // Load settings from Firestore (for logged-in users only)
  const loadSettingsFromFirestore = async () => {
    if (!user || isAnonymous) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.settings || null;
      }
      return null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  };

  // Purchase premium subscription
  // Temporarily disabled for Expo Go
  const purchasePremium = async () => {
    return {
      success: false,
      error: 'In-app purchases coming soon! Build APK to test billing.'
    };

    // TODO: Re-enable when using development build
    // try {
    //   await BillingManager.purchasePremium();
    //   if (user && !isAnonymous) {
    //     await checkPremiumStatus(user.uid);
    //   }
    //   return { success: true };
    // } catch (error) {
    //   return { success: false, error: error.message };
    // }
  };

  // Restore previous purchases
  // Temporarily disabled for Expo Go
  const restorePurchases = async () => {
    return {
      success: false,
      message: 'Restore purchases coming soon! Build APK to test billing.'
    };

    // TODO: Re-enable when using development build
    // try {
    //   const premiumPurchase = await BillingManager.restorePurchases();
    //   if (premiumPurchase) {
    //     setIsPremium(true);
    //     if (user && !isAnonymous) {
    //       await setDoc(doc(db, 'users', user.uid), {
    //         isPremium: true,
    //         updatedAt: new Date().toISOString()
    //       }, { merge: true });
    //     }
    //     return { success: true, message: 'Premium subscription restored!' };
    //   }
    //   return { success: false, message: 'No previous purchases found.' };
    // } catch (error) {
    //   return { success: false, error: error.message };
    // }
  };

  const value = {
    user,
    isAnonymous,
    isPremium,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginAnonymously,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    syncSettingsToFirestore,
    loadSettingsFromFirestore,
    purchasePremium,
    restorePurchases
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// UsageLimitContext
// Tracks daily translation count for free tier users (15/day limit)
// Premium users have unlimited translations

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const UsageLimitContext = createContext();

const FREE_TIER_DAILY_LIMIT = 15;

export const UsageLimitProvider = ({ children }) => {
  const { user, isAnonymous, isPremium } = useAuth();
  const [dailyCount, setDailyCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load usage data on mount
  useEffect(() => {
    loadUsageData();
  }, [user, isAnonymous]);

  // Load usage data from AsyncStorage or Firestore
  const loadUsageData = async () => {
    try {
      const today = getTodayString();

      if (user && !isAnonymous) {
        // Logged in user - load from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const storedDate = data.lastResetDate || today;
          const storedCount = data.dailyTranslations || 0;

          if (storedDate === today) {
            setDailyCount(storedCount);
            setLastResetDate(storedDate);
          } else {
            // New day - reset count
            setDailyCount(0);
            setLastResetDate(today);
            await updateFirestore(0, today);
          }
        } else {
          // New user
          setDailyCount(0);
          setLastResetDate(today);
        }
      } else {
        // Anonymous user - load from AsyncStorage
        const storedDate = await AsyncStorage.getItem('last_reset_date');
        const storedCount = await AsyncStorage.getItem('daily_translations');

        if (storedDate === today && storedCount) {
          setDailyCount(parseInt(storedCount, 10));
          setLastResetDate(storedDate);
        } else {
          // New day or first time - reset count
          setDailyCount(0);
          setLastResetDate(today);
          await AsyncStorage.setItem('last_reset_date', today);
          await AsyncStorage.setItem('daily_translations', '0');
        }
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Firestore (for logged-in users)
  const updateFirestore = async (count, date) => {
    if (!user || isAnonymous) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        dailyTranslations: count,
        lastResetDate: date,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  };

  // Get today's date as string (YYYY-MM-DD)
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if user can make a translation
  const canTranslate = () => {
    // Premium users have unlimited translations
    if (isPremium) return true;

    // Free users limited to 15/day
    return dailyCount < FREE_TIER_DAILY_LIMIT;
  };

  // Get remaining translations for today
  const getRemainingTranslations = () => {
    if (isPremium) return Infinity;
    return Math.max(0, FREE_TIER_DAILY_LIMIT - dailyCount);
  };

  // Increment translation count
  const incrementCount = async () => {
    const today = getTodayString();

    // Check if we need to reset (new day)
    if (lastResetDate !== today) {
      setDailyCount(1);
      setLastResetDate(today);

      if (user && !isAnonymous) {
        await updateFirestore(1, today);
      } else {
        await AsyncStorage.setItem('last_reset_date', today);
        await AsyncStorage.setItem('daily_translations', '1');
      }
    } else {
      // Same day - increment count
      const newCount = dailyCount + 1;
      setDailyCount(newCount);

      if (user && !isAnonymous) {
        await updateFirestore(newCount, today);
      } else {
        await AsyncStorage.setItem('daily_translations', newCount.toString());
      }
    }
  };

  // Reset count manually (for testing)
  const resetCount = async () => {
    const today = getTodayString();
    setDailyCount(0);
    setLastResetDate(today);

    if (user && !isAnonymous) {
      await updateFirestore(0, today);
    } else {
      await AsyncStorage.setItem('daily_translations', '0');
      await AsyncStorage.setItem('last_reset_date', today);
    }
  };

  const value = {
    dailyCount,
    isLoading,
    canTranslate,
    getRemainingTranslations,
    incrementCount,
    resetCount,
    FREE_TIER_DAILY_LIMIT,
  };

  return (
    <UsageLimitContext.Provider value={value}>
      {children}
    </UsageLimitContext.Provider>
  );
};

export const useUsageLimit = () => {
  const context = useContext(UsageLimitContext);
  if (!context) {
    throw new Error('useUsageLimit must be used within a UsageLimitProvider');
  }
  return context;
};

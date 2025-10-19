// Cost Tracking Context
// Tracks API usage and estimated costs for AI model calls
// Stores data in AsyncStorage and syncs with Firestore for logged-in users

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const CostTrackingContext = createContext();

// Estimated cost per 1K tokens for each model (in USD)
// These are approximate costs - update based on actual pricing
const MODEL_COSTS = {
  openai: 0.002, // GPT-4o mini
  claude: 0.003, // Claude 3 Haiku
  gemini: 0.0001, // Gemini 1.5 Flash
  mistral: 0.001, // Mistral Small
  perplexity: 0.002, // Perplexity Small
  deepseek: 0.0002, // DeepSeek Chat
  grok: 0.005, // Grok Beta
  openrouter: 0.002, // Average cost through OpenRouter
};

// Default cost tracking data
const DEFAULT_COST_DATA = {
  totalCalls: 0,
  totalEstimatedCost: 0,
  todaysCalls: 0,
  todaysEstimatedCost: 0,
  thisMonthCalls: 0,
  thisMonthEstimatedCost: 0,
  lastResetDate: new Date().toISOString().split('T')[0],
  lastMonthResetDate: new Date().toISOString().slice(0, 7), // YYYY-MM
  modelBreakdown: {
    openai: { calls: 0, cost: 0 },
    claude: { calls: 0, cost: 0 },
    gemini: { calls: 0, cost: 0 },
    mistral: { calls: 0, cost: 0 },
    perplexity: { calls: 0, cost: 0 },
    deepseek: { calls: 0, cost: 0 },
    grok: { calls: 0, cost: 0 },
    openrouter: { calls: 0, cost: 0 },
  },
};

export function CostTrackingProvider({ children }) {
  const [costData, setCostData] = useState(DEFAULT_COST_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAnonymous } = useAuth();

  // Load cost data on mount
  useEffect(() => {
    loadCostData();
  }, []);

  // Load cost data from AsyncStorage
  const loadCostData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('cost_tracking');
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Check if we need to reset daily stats
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastResetDate !== today) {
          parsed.todaysCalls = 0;
          parsed.todaysEstimatedCost = 0;
          parsed.lastResetDate = today;
        }

        // Check if we need to reset monthly stats
        const thisMonth = new Date().toISOString().slice(0, 7);
        if (parsed.lastMonthResetDate !== thisMonth) {
          parsed.thisMonthCalls = 0;
          parsed.thisMonthEstimatedCost = 0;
          parsed.lastMonthResetDate = thisMonth;
        }

        setCostData(parsed);
        // Save the reset data if dates changed
        await AsyncStorage.setItem('cost_tracking', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error loading cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cost data to AsyncStorage
  const saveCostData = async (newData) => {
    try {
      await AsyncStorage.setItem('cost_tracking', JSON.stringify(newData));
      console.log('Cost data saved');
    } catch (error) {
      console.error('Error saving cost data:', error);
    }
  };

  // Track an API call
  const trackAPICall = async (modelId, estimatedTokens = 1000) => {
    const costPerToken = MODEL_COSTS[modelId] || 0.002;
    const estimatedCost = (estimatedTokens / 1000) * costPerToken;

    const newData = {
      ...costData,
      totalCalls: costData.totalCalls + 1,
      totalEstimatedCost: costData.totalEstimatedCost + estimatedCost,
      todaysCalls: costData.todaysCalls + 1,
      todaysEstimatedCost: costData.todaysEstimatedCost + estimatedCost,
      thisMonthCalls: costData.thisMonthCalls + 1,
      thisMonthEstimatedCost: costData.thisMonthEstimatedCost + estimatedCost,
      modelBreakdown: {
        ...costData.modelBreakdown,
        [modelId]: {
          calls: (costData.modelBreakdown[modelId]?.calls || 0) + 1,
          cost: (costData.modelBreakdown[modelId]?.cost || 0) + estimatedCost,
        },
      },
    };

    setCostData(newData);
    await saveCostData(newData);
  };

  // Reset all statistics
  const resetStats = async () => {
    setCostData(DEFAULT_COST_DATA);
    await saveCostData(DEFAULT_COST_DATA);
  };

  // Get cost summary for display
  const getCostSummary = () => {
    return {
      total: {
        calls: costData.totalCalls,
        cost: costData.totalEstimatedCost.toFixed(4),
      },
      today: {
        calls: costData.todaysCalls,
        cost: costData.todaysEstimatedCost.toFixed(4),
      },
      thisMonth: {
        calls: costData.thisMonthCalls,
        cost: costData.thisMonthEstimatedCost.toFixed(4),
      },
      models: Object.entries(costData.modelBreakdown)
        .filter(([_, data]) => data.calls > 0)
        .map(([modelId, data]) => ({
          modelId,
          calls: data.calls,
          cost: data.cost.toFixed(4),
        }))
        .sort((a, b) => b.calls - a.calls),
    };
  };

  const value = {
    costData,
    isLoading,
    trackAPICall,
    resetStats,
    getCostSummary,
  };

  return (
    <CostTrackingContext.Provider value={value}>
      {children}
    </CostTrackingContext.Provider>
  );
}

// Custom hook to use cost tracking
export function useCostTracking() {
  const context = useContext(CostTrackingContext);
  if (!context) {
    throw new Error('useCostTracking must be used within a CostTrackingProvider');
  }
  return context;
}

export default CostTrackingContext;

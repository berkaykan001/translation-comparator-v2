// Billing Manager
// Handles Google Play Billing for premium subscriptions
// Manages subscription purchases, restoration, and validation

import {
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  getAvailablePurchases,
  Product,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';

// Subscription SKU (Product ID from Google Play Console)
// TODO: Replace with actual subscription ID from Google Play Console
const PREMIUM_SUBSCRIPTION_SKU = __DEV__
  ? 'android.test.purchased' // Test SKU for development
  : 'premium_monthly_subscription'; // Production SKU

class BillingManager {
  constructor() {
    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
    this.isInitialized = false;
  }

  // Initialize billing connection
  async init() {
    if (this.isInitialized) {
      console.log('BillingManager already initialized');
      return;
    }

    try {
      await initConnection();
      console.log('BillingManager initialized');
      this.isInitialized = true;

      // Set up purchase listeners
      this.setupPurchaseListeners();

      // Check for existing purchases on init
      await this.restorePurchases();
    } catch (error) {
      console.error('Failed to initialize BillingManager:', error);
      throw error;
    }
  }

  // Set up listeners for purchase updates and errors
  setupPurchaseListeners() {
    // Listen for successful purchases
    this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
      console.log('Purchase updated:', purchase);
      this.handlePurchaseUpdate(purchase);
    });

    // Listen for purchase errors
    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.warn('Purchase error:', error);
      // Handle error in UI (could emit event or callback)
    });
  }

  // Handle purchase updates
  async handlePurchaseUpdate(purchase) {
    try {
      // Validate the purchase (in production, validate with your backend)
      const isValid = await this.validatePurchase(purchase);

      if (isValid) {
        console.log('Purchase validated successfully');
        // Finish the transaction
        await finishTransaction({ purchase, isConsumable: false });

        // Return purchase info for AuthContext to update premium status
        return purchase;
      } else {
        console.warn('Purchase validation failed');
        return null;
      }
    } catch (error) {
      console.error('Error handling purchase update:', error);
      return null;
    }
  }

  // Validate purchase (simplified version - in production, validate with backend)
  async validatePurchase(purchase) {
    try {
      // Check if purchase has required fields
      if (!purchase || !purchase.transactionReceipt) {
        return false;
      }

      // In production, send transactionReceipt to your backend
      // for server-side validation with Google Play API

      // For now, just check if the purchase exists and is acknowledged
      return true;
    } catch (error) {
      console.error('Purchase validation error:', error);
      return false;
    }
  }

  // Get available subscription products
  async getProducts() {
    try {
      const subscriptions = await getSubscriptions({ skus: [PREMIUM_SUBSCRIPTION_SKU] });
      console.log('Available subscriptions:', subscriptions);
      return subscriptions;
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      return [];
    }
  }

  // Purchase premium subscription
  async purchasePremium() {
    try {
      console.log('Initiating subscription purchase...');
      const purchase = await requestSubscription({
        sku: PREMIUM_SUBSCRIPTION_SKU,
      });
      console.log('Purchase initiated:', purchase);
      return purchase;
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      throw error;
    }
  }

  // Restore previous purchases
  async restorePurchases() {
    try {
      console.log('Restoring purchases...');
      const purchases = await getAvailablePurchases();
      console.log('Available purchases:', purchases);

      // Check if user has active premium subscription
      const premiumPurchase = purchases.find(
        (purchase) => purchase.productId === PREMIUM_SUBSCRIPTION_SKU
      );

      if (premiumPurchase) {
        console.log('Found existing premium subscription');
        return premiumPurchase;
      }

      console.log('No existing premium subscription found');
      return null;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return null;
    }
  }

  // Check if user has active premium subscription
  async hasPremiumSubscription() {
    try {
      const premiumPurchase = await this.restorePurchases();
      return premiumPurchase !== null;
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  // Clean up when app closes
  async destroy() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    try {
      await endConnection();
      this.isInitialized = false;
      console.log('BillingManager destroyed');
    } catch (error) {
      console.error('Failed to destroy BillingManager:', error);
    }
  }
}

// Export singleton instance
export default new BillingManager();

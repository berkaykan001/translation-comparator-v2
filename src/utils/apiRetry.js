// API Retry Utility
// Handles automatic retries with timeout for AI API calls
// Provides user-friendly error messages on failure

/**
 * Retry an async function with timeout and attempt limits
 * @param {Function} apiFunction - Async function to retry (should throw on error)
 * @param {string} serviceName - Name of the service for error messages (e.g., "Gemini", "OpenAI")
 * @param {number} maxAttempts - Maximum number of attempts (default: 3)
 * @param {number} timeoutMs - Maximum total time in milliseconds (default: 20000)
 * @returns {Promise<string>} - The API response text
 * @throws {Error} - Throws user-friendly error if all attempts fail or timeout
 */
export async function retryWithTimeout(
  apiFunction,
  serviceName,
  maxAttempts = 3,
  timeoutMs = 20000
) {
  const startTime = Date.now();
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Check if we've exceeded the timeout
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= timeoutMs) {
      console.warn(`${serviceName}: Timeout after ${elapsedTime}ms (${attempt - 1} attempts)`);
      throw new Error(`Couldn't connect to ${serviceName} servers. Please try again.`);
    }

    try {
      // Calculate remaining time for this attempt
      const remainingTime = timeoutMs - elapsedTime;

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('timeout'));
        }, remainingTime);
      });

      // Race between API call and timeout
      const result = await Promise.race([
        apiFunction(),
        timeoutPromise
      ]);

      // Success! Return the result
      console.log(`${serviceName}: Success on attempt ${attempt}`);
      return result;

    } catch (error) {
      lastError = error;

      // Log the attempt (but don't show to user)
      if (attempt < maxAttempts) {
        console.warn(`${serviceName}: Attempt ${attempt} failed, retrying... Error:`, error.message);

        // Small delay before retry (100ms) to avoid hammering the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        // Final attempt failed
        console.error(`${serviceName}: All ${maxAttempts} attempts failed. Last error:`, error.message);
      }
    }
  }

  // All attempts failed - return user-friendly error
  throw new Error(`Couldn't connect to ${serviceName} servers. Please try again.`);
}

export default {
  retryWithTimeout,
};

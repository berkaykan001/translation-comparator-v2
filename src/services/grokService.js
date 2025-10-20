// Grok API Service (xAI)
// Handles API calls to xAI's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single Grok API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callGrokOnce(prompt, model) {
  const response = await fetch(API_ENDPOINTS.GROK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.GROK}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Grok API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Grok API returned malformed response:', JSON.stringify(data));
      throw new Error('Grok API returned an empty response.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('Grok API response missing message content:', JSON.stringify(data));
      throw new Error('Grok API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call Grok API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: grok-2-1212)
 * @returns {Promise<string>} - The API response text
 */
export async function callGrok(prompt, model = 'grok-2-1212') {
  return retryWithTimeout(
    () => callGrokOnce(prompt, model),
    'Grok',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callGrok,
  modelName: 'Grok',
  id: 'grok',
};

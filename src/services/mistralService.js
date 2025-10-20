// Mistral API Service
// Handles API calls to Mistral's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single Mistral API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callMistralOnce(prompt, model) {
  const response = await fetch(API_ENDPOINTS.MISTRAL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.MISTRAL}`,
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
      throw new Error(`Mistral API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Mistral API returned malformed response:', JSON.stringify(data));
      throw new Error('Mistral API returned an empty response.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('Mistral API response missing message content:', JSON.stringify(data));
      throw new Error('Mistral API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call Mistral API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: mistral-small-latest)
 * @returns {Promise<string>} - The API response text
 */
export async function callMistral(prompt, model = 'mistral-small-latest') {
  return retryWithTimeout(
    () => callMistralOnce(prompt, model),
    'Mistral',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callMistral,
  modelName: 'Mistral',
  id: 'mistral',
};

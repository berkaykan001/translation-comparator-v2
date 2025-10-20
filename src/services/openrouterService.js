// OpenRouter API Service
// Handles API calls to OpenRouter's Chat Completion endpoint
// OpenRouter provides access to multiple models through a unified API

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single OpenRouter API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callOpenRouterOnce(prompt, model) {
  const response = await fetch(API_ENDPOINTS.OPENROUTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.OPENROUTER}`,
        'HTTP-Referer': 'https://translationcomparator.app', // Optional but recommended
        'X-Title': 'Translation Comparator', // Optional but recommended
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
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('OpenRouter API returned malformed response:', JSON.stringify(data));
      throw new Error('OpenRouter API returned an empty response.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('OpenRouter API response missing message content:', JSON.stringify(data));
      throw new Error('OpenRouter API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call OpenRouter API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: meta-llama/llama-3.3-70b-instruct)
 * @returns {Promise<string>} - The API response text
 */
export async function callOpenRouter(prompt, model = 'meta-llama/llama-3.3-70b-instruct') {
  return retryWithTimeout(
    () => callOpenRouterOnce(prompt, model),
    'OpenRouter',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callOpenRouter,
  modelName: 'OpenRouter',
  id: 'openrouter',
};

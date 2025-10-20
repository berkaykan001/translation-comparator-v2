// Perplexity API Service (Sonar)
// Handles API calls to Perplexity's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single Perplexity API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callPerplexityOnce(prompt, model) {
  const response = await fetch(API_ENDPOINTS.PERPLEXITY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.PERPLEXITY}`,
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
      throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Perplexity API returned malformed response:', JSON.stringify(data));
      throw new Error('Perplexity API returned an empty response.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('Perplexity API response missing message content:', JSON.stringify(data));
      throw new Error('Perplexity API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call Perplexity API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: sonar)
 * @returns {Promise<string>} - The API response text
 */
export async function callPerplexity(prompt, model = 'sonar') {
  return retryWithTimeout(
    () => callPerplexityOnce(prompt, model),
    'Perplexity',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callPerplexity,
  modelName: 'Perplexity Sonar',
  id: 'perplexity',
};

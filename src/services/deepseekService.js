// DeepSeek API Service
// Handles API calls to DeepSeek's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single DeepSeek API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callDeepSeekOnce(prompt, model) {
  const response = await fetch(API_ENDPOINTS.DEEPSEEK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.DEEPSEEK}`,
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
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('DeepSeek API returned malformed response:', JSON.stringify(data));
      throw new Error('DeepSeek API returned an empty response.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('DeepSeek API response missing message content:', JSON.stringify(data));
      throw new Error('DeepSeek API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call DeepSeek API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: deepseek-chat)
 * @returns {Promise<string>} - The API response text
 */
export async function callDeepSeek(prompt, model = 'deepseek-chat') {
  return retryWithTimeout(
    () => callDeepSeekOnce(prompt, model),
    'DeepSeek',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callDeepSeek,
  modelName: 'DeepSeek',
  id: 'deepseek',
};

// OpenAI API Service (GPT-4.1)
// Handles API calls to OpenAI's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single OpenAI API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callOpenAIOnce(prompt, model) {
    const response = await fetch(API_ENDPOINTS.OPENAI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.OPENAI}`,
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
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('OpenAI API returned malformed response:', JSON.stringify(data));
      throw new Error('OpenAI API returned an empty response. Please try again.');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
      console.error('OpenAI API response missing message content:', JSON.stringify(data));
      throw new Error('OpenAI API returned a response without content.');
    }

    return message.trim();
}

/**
 * Call OpenAI API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - The API response text
 */
export async function callOpenAI(prompt, model = 'gpt-4o-mini') {
  return retryWithTimeout(
    () => callOpenAIOnce(prompt, model),
    'OpenAI',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callOpenAI,
  modelName: 'GPT-4.1',
  id: 'openai',
};

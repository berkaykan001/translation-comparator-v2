// Claude API Service (Haiku 3.5)
// Handles API calls to Anthropic's Messages endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single Claude API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callClaudeOnce(prompt, model) {
    const response = await fetch(API_ENDPOINTS.CLAUDE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEYS.CLAUDE,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      console.error('Claude API returned malformed response:', JSON.stringify(data));
      throw new Error('Claude API returned an empty response. Please try again.');
    }

    const text = data.content[0]?.text;
    if (!text || typeof text !== 'string') {
      console.error('Claude API response missing text:', JSON.stringify(data));
      throw new Error('Claude API returned a response without text content.');
    }

    return text.trim();
}

/**
 * Call Claude API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: claude-3-5-haiku-20241022)
 * @returns {Promise<string>} - The API response text
 */
export async function callClaude(prompt, model = 'claude-3-5-haiku-20241022') {
  return retryWithTimeout(
    () => callClaudeOnce(prompt, model),
    'Claude',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callClaude,
  modelName: 'Claude Haiku 3.5',
  id: 'claude',
};

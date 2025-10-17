// Claude API Service (Haiku 3.5)
// Handles API calls to Anthropic's Messages endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call Claude API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: claude-3-5-haiku-20241022)
 * @returns {Promise<string>} - The API response text
 */
export async function callClaude(prompt, model = 'claude-3-5-haiku-20241022') {
  try {
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
    return data.content[0].text.trim();
  } catch (error) {
    console.error('Claude Service Error:', error);
    throw error;
  }
}

export default {
  call: callClaude,
  modelName: 'Claude Haiku 3.5',
  id: 'claude',
};

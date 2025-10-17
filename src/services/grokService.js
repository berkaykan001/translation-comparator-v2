// Grok API Service (xAI)
// Handles API calls to xAI's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call Grok API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: grok-2-1212)
 * @returns {Promise<string>} - The API response text
 */
export async function callGrok(prompt, model = 'grok-2-1212') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Grok Service Error:', error);
    throw error;
  }
}

export default {
  call: callGrok,
  modelName: 'Grok',
  id: 'grok',
};

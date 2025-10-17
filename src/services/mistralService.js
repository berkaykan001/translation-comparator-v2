// Mistral API Service
// Handles API calls to Mistral's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call Mistral API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: mistral-small-latest)
 * @returns {Promise<string>} - The API response text
 */
export async function callMistral(prompt, model = 'mistral-small-latest') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Mistral Service Error:', error);
    throw error;
  }
}

export default {
  call: callMistral,
  modelName: 'Mistral',
  id: 'mistral',
};

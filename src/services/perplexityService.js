// Perplexity API Service (Sonar)
// Handles API calls to Perplexity's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call Perplexity API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: sonar)
 * @returns {Promise<string>} - The API response text
 */
export async function callPerplexity(prompt, model = 'sonar') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Perplexity Service Error:', error);
    throw error;
  }
}

export default {
  call: callPerplexity,
  modelName: 'Perplexity Sonar',
  id: 'perplexity',
};

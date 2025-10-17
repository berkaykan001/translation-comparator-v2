// OpenRouter API Service
// Handles API calls to OpenRouter's Chat Completion endpoint
// OpenRouter provides access to multiple models through a unified API

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call OpenRouter API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: meta-llama/llama-3.3-70b-instruct)
 * @returns {Promise<string>} - The API response text
 */
export async function callOpenRouter(prompt, model = 'meta-llama/llama-3.3-70b-instruct') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter Service Error:', error);
    throw error;
  }
}

export default {
  call: callOpenRouter,
  modelName: 'OpenRouter',
  id: 'openrouter',
};

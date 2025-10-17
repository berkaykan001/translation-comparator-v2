// OpenAI API Service (GPT-4.1)
// Handles API calls to OpenAI's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call OpenAI API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - The API response text
 */
export async function callOpenAI(prompt, model = 'gpt-4o-mini') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    throw error;
  }
}

export default {
  call: callOpenAI,
  modelName: 'GPT-4.1',
  id: 'openai',
};

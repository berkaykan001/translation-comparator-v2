// DeepSeek API Service
// Handles API calls to DeepSeek's Chat Completion endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call DeepSeek API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: deepseek-chat)
 * @returns {Promise<string>} - The API response text
 */
export async function callDeepSeek(prompt, model = 'deepseek-chat') {
  try {
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('DeepSeek Service Error:', error);
    throw error;
  }
}

export default {
  call: callDeepSeek,
  modelName: 'DeepSeek',
  id: 'deepseek',
};

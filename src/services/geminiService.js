// Gemini API Service (2.5 Flash)
// Handles API calls to Google's Generative AI endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: gemini-2.5-flash)
 * @returns {Promise<string>} - The API response text
 */
export async function callGemini(prompt, model = 'gemini-2.5-flash') {
  try {
    const url = `${API_ENDPOINTS.GEMINI}/${model}:generateContent?key=${API_KEYS.GEMINI}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}

export default {
  call: callGemini,
  modelName: 'Gemini 2.5 Flash',
  id: 'gemini',
};

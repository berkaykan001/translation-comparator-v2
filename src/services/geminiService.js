// Gemini API Service (2.5 Flash)
// Handles API calls to Google's Generative AI endpoint

import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';
import { retryWithTimeout } from '../utils/apiRetry';

/**
 * Internal function to make a single Gemini API call
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use
 * @returns {Promise<string>} - The API response text
 */
async function callGeminiOnce(prompt, model) {
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
          thinkingConfig: {
            thinkingBudget: 0,  // Disable extended thinking to prevent MAX_TOKENS in Usage mode
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure (Gemini API sometimes returns responses without candidates)
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('Gemini API returned malformed response (no candidates):', JSON.stringify(data));
      throw new Error('Gemini API returned an empty response. This is a known issue with gemini-2.5-flash. Please try again.');
    }

    const candidate = data.candidates[0];

    // Check if content exists
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('Gemini API response missing content/parts:', JSON.stringify(data));

      // Check if there's a finish reason that explains the issue
      const finishReason = candidate.finishReason || 'UNKNOWN';
      throw new Error(`Gemini API returned incomplete response. Finish reason: ${finishReason}`);
    }

    const text = candidate.content.parts[0].text;

    if (!text || typeof text !== 'string') {
      console.error('Gemini API response missing text:', JSON.stringify(data));
      throw new Error('Gemini API returned a response without text content.');
    }

    return text.trim();
}

/**
 * Call Gemini API with automatic retry logic
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - Model to use (default: gemini-2.5-flash)
 * @returns {Promise<string>} - The API response text
 */
export async function callGemini(prompt, model = 'gemini-2.5-flash') {
  return retryWithTimeout(
    () => callGeminiOnce(prompt, model),
    'Gemini',
    3,  // max attempts
    20000  // 20 seconds timeout
  );
}

export default {
  call: callGemini,
  modelName: 'Gemini 2.5 Flash',
  id: 'gemini',
};

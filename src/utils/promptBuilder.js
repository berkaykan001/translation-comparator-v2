// Prompt Builder Utility
// Builds prompts with variable injection for different modes

/**
 * Build a translation prompt
 * @param {string} inputText - Text to translate
 * @param {string} sourceLanguage - Source language name (e.g., "English")
 * @param {string} targetLanguage - Target language name (e.g., "Spanish")
 * @returns {string} - The constructed prompt
 */
export function buildTranslationPrompt(inputText, sourceLanguage, targetLanguage) {
  return `Translate the following text from ${sourceLanguage} to ${targetLanguage}:

"${inputText}"

Provide only the translation without additional explanation.`;
}

/**
 * Build a grammar check prompt
 * @param {string} inputText - Text to check
 * @param {string} sourceLanguage - Language of the text
 * @param {string} nativeLanguage - User's native language for response
 * @returns {string} - The constructed prompt
 */
export function buildGrammarPrompt(inputText, sourceLanguage, nativeLanguage) {
  return `You are a grammar checker. Your ONLY task is to check if the grammar is correct.

Given text: "${inputText}"
Source language: ${sourceLanguage}

Check the grammar and provide:
1. Whether it's correct or incorrect
2. Explanation of any errors
3. Corrected version if needed

Respond in ${nativeLanguage}.`;
}

/**
 * Build a usage analysis prompt
 * @param {string} inputText - Text to analyze
 * @param {string} sourceLanguage - Language of the text
 * @param {string} nativeLanguage - User's native language for response
 * @returns {string} - The constructed prompt
 */
export function buildUsagePrompt(inputText, sourceLanguage, nativeLanguage) {
  return `You are a language usage analyzer.

Given text: "${inputText}"
Source language: ${sourceLanguage}

Analyze the usage of this phrase/expression:
1. Is it formal/informal/colloquial?
2. When is it appropriate to use?
3. Common contexts where it appears
4. Any cultural nuances

Respond in ${nativeLanguage}.`;
}

/**
 * Build a follow-up question prompt
 * @param {string} originalPrompt - The original prompt
 * @param {string} originalResponse - The AI's previous response
 * @param {string} followUpQuestion - User's follow-up question
 * @returns {string} - The constructed prompt with context
 */
export function buildFollowUpPrompt(originalPrompt, originalResponse, followUpQuestion) {
  return `Original task: ${originalPrompt}

Your previous response: ${originalResponse}

Follow-up question: ${followUpQuestion}

Please answer the follow-up question in the context of your previous response.`;
}

export default {
  buildTranslationPrompt,
  buildGrammarPrompt,
  buildUsagePrompt,
  buildFollowUpPrompt,
};

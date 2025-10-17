// AI Service Orchestrator
// Manages async API calls to all AI providers simultaneously

import openaiService from './openaiService';
import claudeService from './claudeService';
import geminiService from './geminiService';
import mistralService from './mistralService';
import perplexityService from './perplexityService';
import deepseekService from './deepseekService';
import grokService from './grokService';
import openrouterService from './openrouterService';

// All available AI models
export const AI_MODELS = [
  {
    id: 'openai',
    name: 'GPT-4.1',
    service: openaiService,
    enabled: false,
    priority: 1,
  },
  {
    id: 'claude',
    name: 'Claude Haiku 3.5',
    service: claudeService,
    enabled: false,
    priority: 2,
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    service: geminiService,
    enabled: false,
    priority: 3,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    service: mistralService,
    enabled: false,
    priority: 4,
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    service: perplexityService,
    enabled: true, // Testing this one
    priority: 5,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    service: deepseekService,
    enabled: true, // Testing this one
    priority: 6,
  },
  {
    id: 'grok',
    name: 'Grok',
    service: grokService,
    enabled: true, // Testing this one
    priority: 7,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Llama)',
    service: openrouterService,
    enabled: true, // Testing this one
    priority: 8,
  },
];

/**
 * Call all enabled AI models simultaneously with a prompt
 * @param {string} prompt - The prompt to send to all models
 * @param {function} onUpdate - Callback function called when each model responds
 *                              Receives (modelId, response, error)
 * @param {Array<string>} enabledModelIds - Optional array of model IDs to use (defaults to all enabled)
 * @returns {Promise<void>}
 */
export async function callAllModels(prompt, onUpdate, enabledModelIds = null) {
  // Filter to only enabled models
  const modelsToCall = AI_MODELS.filter((model) => {
    if (enabledModelIds) {
      return enabledModelIds.includes(model.id);
    }
    return model.enabled;
  });

  // Sort by priority
  const sortedModels = [...modelsToCall].sort((a, b) => a.priority - b.priority);

  // Call all models simultaneously (Promise.allSettled to handle failures gracefully)
  const promises = sortedModels.map(async (model) => {
    try {
      const response = await model.service.call(prompt);
      // Call onUpdate callback with success
      onUpdate(model.id, model.name, response, null);
      return { model: model.id, response, error: null };
    } catch (error) {
      // Call onUpdate callback with error
      onUpdate(model.id, model.name, null, error);
      return { model: model.id, response: null, error };
    }
  });

  // Wait for all promises to settle
  await Promise.allSettled(promises);
}

/**
 * Call a single AI model with a prompt
 * @param {string} modelId - The ID of the model to call
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - The API response
 */
export async function callSingleModel(modelId, prompt) {
  const model = AI_MODELS.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  try {
    const response = await model.service.call(prompt);
    return response;
  } catch (error) {
    console.error(`Error calling ${modelId}:`, error);
    throw error;
  }
}

/**
 * Get all enabled models
 * @returns {Array} - Array of enabled model objects
 */
export function getEnabledModels() {
  return AI_MODELS.filter((model) => model.enabled);
}

/**
 * Get a model by ID
 * @param {string} modelId - The model ID
 * @returns {Object|null} - The model object or null if not found
 */
export function getModelById(modelId) {
  return AI_MODELS.find((m) => m.id === modelId) || null;
}

export default {
  callAllModels,
  callSingleModel,
  getEnabledModels,
  getModelById,
  AI_MODELS,
};

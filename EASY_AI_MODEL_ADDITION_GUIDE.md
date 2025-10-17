# 🤖 EASY AI MODEL ADDITION GUIDE

## 📋 **How to Add a New AI Model (Without Claude's Help)**

This guide shows you exactly how to add a new AI model to the Translation Comparator app in 3 simple steps.

---

## ✅ **Step 1: Add API Key**

**File:** `src/config/apiKeys.js`

Add your new API key to the object:

```javascript
export const API_KEYS = {
  OPENAI: "sk-...",
  CLAUDE: "sk-ant-...",
  GEMINI: "AIza...",
  MISTRAL: "wuj...",
  PERPLEXITY: "pplx-...",
  DEEPSEEK: "sk-...",
  GROK: "xai-...",
  OPENROUTER: "sk-or-...",

  // ADD NEW KEY HERE:
  LLAMA: "your-llama-api-key-here",  // Example
};

export const API_ENDPOINTS = {
  OPENAI: "https://api.openai.com/v1/chat/completions",
  CLAUDE: "https://api.anthropic.com/v1/messages",
  GEMINI: "https://generativelanguage.googleapis.com/v1/models",
  MISTRAL: "https://api.mistral.ai/v1/chat/completions",
  PERPLEXITY: "https://api.perplexity.ai/chat/completions",
  DEEPSEEK: "https://api.deepseek.com/v1/chat/completions",
  GROK: "https://api.x.ai/v1/chat/completions",
  OPENROUTER: "https://openrouter.ai/api/v1/chat/completions",

  // ADD NEW ENDPOINT HERE:
  LLAMA: "https://api.llama.ai/v1/chat/completions",  // Example
};
```

---

## ✅ **Step 2: Create Service File**

**File:** `src/services/[newmodel]Service.js`

Create a new file for your AI model. Copy one of the existing services as a template.

### **Example: Adding Llama**

**File:** `src/services/llamaService.js`

```javascript
import { API_KEYS, API_ENDPOINTS } from '../config/apiKeys';

export const llamaService = {
  async call(prompt) {
    try {
      const response = await fetch(API_ENDPOINTS.LLAMA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.LLAMA}`,
        },
        body: JSON.stringify({
          model: 'llama-3-70b',  // Replace with actual model name
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Llama API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract response text (adjust based on API response format)
      const text = data.choices[0].message.content;

      // Calculate cost (adjust based on pricing)
      const inputTokens = data.usage?.prompt_tokens || 0;
      const outputTokens = data.usage?.completion_tokens || 0;
      const cost = (inputTokens * 0.001 / 1000) + (outputTokens * 0.004 / 1000);

      return {
        text,
        cost,
        model: 'Llama 3 70B',
        success: true,
      };
    } catch (error) {
      console.error('Llama API error:', error);
      return {
        text: `Error: ${error.message}`,
        cost: 0,
        model: 'Llama 3 70B',
        success: false,
        error: error.message,
      };
    }
  },
};
```

### **Notes:**
- **Adjust the request format** based on the API's documentation
- **Adjust the response extraction** (`data.choices[0].message.content`) based on the API's response structure
- **Update pricing** in the cost calculation (input/output token prices)
- **Change model name** to match the actual model you're using

---

## ✅ **Step 3: Register Model in Config**

**File:** `src/config/aiModels.js`

Add your new model to the `AI_MODELS` array:

```javascript
import { openaiService } from '../services/openaiService';
import { claudeService } from '../services/claudeService';
import { geminiService } from '../services/geminiService';
import { mistralService } from '../services/mistralService';
import { perplexityService } from '../services/perplexityService';
import { deepseekService } from '../services/deepseekService';
import { grokService } from '../services/grokService';
import { openrouterService } from '../services/openrouterService';

// IMPORT YOUR NEW SERVICE:
import { llamaService } from '../services/llamaService';

export const AI_MODELS = [
  {
    id: 'openai',
    name: 'GPT-4.1',
    service: openaiService,
    enabled: true,
    priority: 1,
  },
  {
    id: 'claude',
    name: 'Claude Haiku 3.5',
    service: claudeService,
    enabled: true,
    priority: 2,
  },
  {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    service: geminiService,
    enabled: true,
    priority: 3,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    service: mistralService,
    enabled: true,
    priority: 4,
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    service: perplexityService,
    enabled: true,
    priority: 5,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    service: deepseekService,
    enabled: true,
    priority: 6,
  },
  {
    id: 'grok',
    name: 'Grok',
    service: grokService,
    enabled: true,
    priority: 7,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    service: openrouterService,
    enabled: true,
    priority: 8,
  },

  // ADD YOUR NEW MODEL HERE:
  {
    id: 'llama',
    name: 'Llama 3 70B',
    service: llamaService,
    enabled: true,  // Set to false to disable
    priority: 9,    // Display order
  },
];
```

### **Parameters:**
- **`id`**: Unique identifier (lowercase, no spaces)
- **`name`**: Display name shown to users
- **`service`**: The service object you created in Step 2
- **`enabled`**: `true` to activate, `false` to disable
- **`priority`**: Display order (lower numbers appear first)

---

## 🎉 **That's It!**

Your new AI model is now integrated. It will automatically:
- Appear in the output windows
- Be called asynchronously with other models
- Track costs
- Handle errors gracefully

---

## 🔧 **Common API Request Formats**

### **OpenAI-Compatible APIs** (OpenAI, Mistral, DeepSeek, Grok, OpenRouter)
```javascript
{
  model: 'model-name',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 1000,
}
```

### **Anthropic (Claude)**
```javascript
{
  model: 'claude-3-haiku-20240307',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 1000,
}
```

**Note:** Claude uses `max_tokens` instead of `max_completion_tokens`

### **Google (Gemini)**
```javascript
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  },
}
```

**Note:** Gemini has a different structure. Check the service file for details.

---

## 🔍 **Testing Your New Model**

After adding the model:

1. **Restart the app** (if running in dev mode)
2. **Open any mode** (Translate/Grammar/Usage)
3. **Submit a query**
4. **Check if the new model's output appears**
5. **Check console for errors** (use ADB logcat if testing on APK)

If there are issues:
- Check API key is correct
- Check endpoint URL is correct
- Check request format matches API docs
- Check response extraction logic

---

## 🛠 **Disabling a Model**

To temporarily disable a model without removing it:

**File:** `src/config/aiModels.js`

```javascript
{
  id: 'llama',
  name: 'Llama 3 70B',
  service: llamaService,
  enabled: false,  // ← Set to false
  priority: 9,
},
```

The model will be skipped during API calls but remains in the code for easy re-enabling.

---

## 🔄 **Removing a Model**

To completely remove a model:

1. **Remove from `aiModels.js`** (delete the entire object)
2. **Optionally remove service file** (`src/services/[model]Service.js`)
3. **Optionally remove API key** (from `apiKeys.js`)

**Note:** If you might use it again later, just disable it instead (set `enabled: false`).

---

## 📝 **Quick Checklist for Adding New Model**

- [ ] Add API key to `src/config/apiKeys.js`
- [ ] Add endpoint to `src/config/apiKeys.js`
- [ ] Create service file `src/services/[model]Service.js`
- [ ] Import service in `src/config/aiModels.js`
- [ ] Add model object to `AI_MODELS` array
- [ ] Test the model in the app
- [ ] Verify cost tracking works
- [ ] Check error handling

---

## 🚨 **Common Mistakes to Avoid**

1. **Forgetting to import the service** in `aiModels.js`
   - You'll get: `ReferenceError: llamaService is not defined`

2. **Wrong API response extraction**
   - Check the API docs for the correct response format
   - Console.log the full response to see its structure

3. **Wrong pricing in cost calculation**
   - Check the API's pricing page for accurate costs

4. **Missing or incorrect headers**
   - Some APIs need specific headers (check docs)

5. **Forgetting to set `enabled: true`**
   - Model won't be called even if everything else is correct

---

## 📚 **Resources**

- **OpenAI API Docs:** https://platform.openai.com/docs
- **Anthropic API Docs:** https://docs.anthropic.com
- **Google Gemini Docs:** https://ai.google.dev/docs
- **Mistral Docs:** https://docs.mistral.ai
- **Perplexity Docs:** https://docs.perplexity.ai

For other APIs, search: "[API name] API documentation"

---

**Last Updated:** Session 1 - Initial Setup
**Need help?** Check existing service files for examples!

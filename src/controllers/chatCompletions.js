import { config } from '../config/global-config.js';
import { Logger } from '../helper/logger.js';
import { ChatCompletionService, ChatCompletionError } from '../service/chatCompletionService.js';
import { formatChatResponse } from '../helper/formatter.js';

/**
 * Check if the request contains image content
 * @param {Object} body - The request body
 * @returns {boolean} - True if the request contains image content
 */
function hasImageContent(body) {
  if (!body.messages || !Array.isArray(body.messages)) {
    return false;
  }

  return body.messages.some(message => {
    // Check if content is an array (multimodal format)
    if (Array.isArray(message.content)) {
      return message.content.some(item => item.type === 'image_url');
    }
    return false;
  });
}

export async function handleChatCompletions(c) {
  Logger.info('Received chat completion request');

  const body = await c.req.json();
  const env = c.env;

  // Check if the request contains image content
  const isImageRequest = hasImageContent(body);

  if (isImageRequest) {
    Logger.info('Detected image content, routing to Groq');

    // Get Groq API key
    const groqApiKey = env[config.apis.groq.key];
    if (!groqApiKey) {
      return c.json({ error: 'GROQ_API_KEY not set' }, 500);
    }

    try {
      const service = new ChatCompletionService(groqApiKey, 'groq');
      const response = await service.createCompletion(body);

      // Extract content from Groq response
      const generatedText = response.choices?.[0]?.message?.content || '';
      const modelDisplayName = config.models.groq?.displayName || response.model;
      const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      // Format response using formatChatResponse
      const formattedResponse = formatChatResponse(generatedText, modelDisplayName, usage);
      return c.json(formattedResponse);
    } catch (error) {
      if (error instanceof ChatCompletionError) {
        Logger.error(`Groq chat completion error: ${error.message}`);
        return c.json({
          error: error.message,
          details: error.details
        }, error.statusCode);
      }

      Logger.error(`Unexpected Groq error: ${error.message}`);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Default to OpenRouter for text-only requests
  const apiKey = env[config.apis.openrouter.key];
  if (!apiKey) {
    return c.json({ error: 'OPENROUTER_API_KEY not set' }, 500);
  }

  try {
    const service = new ChatCompletionService(apiKey, 'openrouter');

    // Use raw response for streaming support
    const response = await service.createCompletionRaw(body);
    return response;
  } catch (error) {
    if (error instanceof ChatCompletionError) {
      Logger.error(`Chat completion error: ${error.message}`);
      return c.json({
        error: error.message,
        details: error.details
      }, error.statusCode);
    }

    Logger.error(`Unexpected error: ${error.message}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
}
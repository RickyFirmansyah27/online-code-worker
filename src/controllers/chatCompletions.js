import { config } from '../config/global-config.js';
import { Logger } from '../helper/logger.js';
import { ChatCompletionService, ChatCompletionError } from '../service/chatCompletionService.js';

export async function handleChatCompletions(c) {
  Logger.info('Received chat completion request');

  const body = await c.req.json();
  const env = c.env;

  // Get the API key from environment variable
  const apiKey = env[config.apis.openrouter.key];
  if (!apiKey) {
    return c.json({ error: 'OPENROUTER_API_KEY not set' }, 500);
  }

  try {
    const service = new ChatCompletionService(apiKey);

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
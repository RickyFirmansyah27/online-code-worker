import { config } from '../config/global-config.js';
import { Logger } from '../helper/logger.js';

const API_URL = config.apis.openrouter.url;
const REFERER = "https://online-code-preview.vercel.app";
const TITLE = "Online Code Preview";

export async function handleChatCompletions(c) {
  Logger.info('Received chat completion request, forwarding to OpenRouter');

  const body = await c.req.json();
  const env = c.env;

  // Get the API key from environment variable
  const apiKey = env[config.apis.openrouter.key];
  if (!apiKey) {
    return c.json({ error: 'OPENROUTER_API_KEY not set' }, 500);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': REFERER,
      'X-Title': TITLE,
    },
    body: JSON.stringify(body),
  });

  // Return the response from OpenRouter directly
  return response;
}
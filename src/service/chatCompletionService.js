import { config } from '../config/global-config.js';
import { Logger } from '../helper/logger.js';

const API_URL = config.apis.openrouter.url;
const REFERER = "https://online-code-preview.vercel.app";
const TITLE = "Online Code Preview";

/**
 * Chat Completion Service
 * Handles request/response for chat completions via OpenRouter API
 */
export class ChatCompletionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Send chat completion request to OpenRouter
     * @param {Object} request - The chat completion request body
     * @returns {Promise<Object>} - The chat completion response
     */
    async createCompletion(request) {
        Logger.info('Sending chat completion request to OpenRouter');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': REFERER,
                'X-Title': TITLE,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            Logger.error(`OpenRouter API error: ${response.status}`, errorData);
            throw new ChatCompletionError(
                errorData.error?.message || 'Failed to get chat completion',
                response.status,
                errorData
            );
        }

        const data = await response.json();
        Logger.info('Chat completion response received successfully');
        return data;
    }

    /**
     * Send chat completion request and return raw response (for streaming)
     * @param {Object} request - The chat completion request body
     * @returns {Promise<Response>} - The raw fetch response
     */
    async createCompletionRaw(request) {
        Logger.info('Sending raw chat completion request to OpenRouter');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': REFERER,
                'X-Title': TITLE,
            },
            body: JSON.stringify(request),
        });

        return response;
    }
}

/**
 * Custom error class for chat completion errors
 */
export class ChatCompletionError extends Error {
    constructor(message, statusCode, details = {}) {
        super(message);
        this.name = 'ChatCompletionError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

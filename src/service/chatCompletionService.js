import { config } from '../config/global-config.js';
import { Logger } from '../helper/logger.js';

const REFERER = "https://online-code-preview.vercel.app";
const TITLE = "Online Code Preview";

/**
 * Chat Completion Service
 * Handles request/response for chat completions via OpenRouter or Groq API
 */
export class ChatCompletionService {
    /**
     * @param {string} apiKey - The API key for the selected provider
     * @param {string} provider - The provider to use ('openrouter' or 'groq')
     */
    constructor(apiKey, provider = 'openrouter') {
        this.apiKey = apiKey;
        this.provider = provider;
        this.apiUrl = config.apis[provider]?.url || config.apis.openrouter.url;
    }

    /**
     * Get headers based on the provider
     * @returns {Object} - Headers for the API request
     */
    getHeaders() {
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        // OpenRouter requires additional headers
        if (this.provider === 'openrouter') {
            headers['HTTP-Referer'] = REFERER;
            headers['X-Title'] = TITLE;
        }

        return headers;
    }

    /**
     * Send chat completion request
     * @param {Object} request - The chat completion request body
     * @returns {Promise<Object>} - The chat completion response
     */
    async createCompletion(request) {
        Logger.info(`Sending chat completion request to ${this.provider}`);

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            Logger.error(`${this.provider} API error: ${response.status}`, errorData);
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
        Logger.info(`Sending raw chat completion request to ${this.provider}`);

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: this.getHeaders(),
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

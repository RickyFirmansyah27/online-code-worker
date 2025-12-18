import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from './config/global-config.js';
import { httpLogger } from './helper/http-logger.js';
import { ErrorHandler } from './helper/error-handler.js';

// Import all route handlers
import { handleChatCompletions } from './controllers/chatCompletions.js';

const originalConsole = { ...console };

['log', 'error', 'warn', 'debug', 'info'].forEach(method => {
    console[method] = function(...args) {
        const message = args.join(' ');
        if (message.startsWith('STREAM:')) return;
        originalConsole[method].apply(console, args);
    };
});

const app = new Hono();

// Add CORS middleware
app.use("*", cors());
app.use("*", httpLogger);

// Error handler
app.onError(ErrorHandler);

// Not found handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Route definitions
app.post(config.routes.chatCompletions, async (c) => {
    const body = await c.req.json();
    // we need to make the body available again, because it's a stream
    c.req.json = () => Promise.resolve(body);
    return await handleChatCompletions(c);
});


export default app;
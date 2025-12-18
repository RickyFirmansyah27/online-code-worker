import { Logger } from './logger.js';

export const httpLogger = async (c, next) => {
  const headersObj = c.req.header();

  const start = performance.now();
  Logger.http({
    message: `Request | Method: ${c.req.method} | Headers: ${JSON.stringify(headersObj)} | URL: ${c.req.url}`,
  });

  try {
    await next();
  } catch (err) {
    Logger.error(`Error occurred: ${err}`);
    throw err;
  }

  const durationInMs = performance.now() - start;
  Logger.http({
    message: `Response | Method: ${c.req.method} | URL: ${c.req.url} | Status: ${c.res.status} | Duration: ${durationInMs.toFixed(2)} ms`,
  });
};
import { Logger } from "./logger";

// 🔢 Token estimator sederhana (memory-efficient for large texts)
function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  // Use a more accurate estimation: ~4 characters per token for English text
  // Process in chunks to avoid memory spikes for large texts
  const chunkSize = 10000;
  let totalTokens = 0;
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    totalTokens += Math.ceil(chunk.length / 4);
  }
  return totalTokens;
}

// Performance monitoring helper
function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  Logger.info(`${label} took ${end - start}ms`);
  return result;
}

export { estimateTokens, measurePerformance };

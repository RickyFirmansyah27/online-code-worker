import app from './src/index.js';

export default {
  fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
};
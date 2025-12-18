// Middleware for common functionality

export function validateRequestBody(body, requiredFields) {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  return messages.map(m => ({
    role: m.role,
    content: Array.isArray(m.content) ? m.content.join(' ') : String(m.content || ''),
  }));
}

export function formatChatResponse(generatedText, modelDisplayName, usage) {
  return {
    id: 'chatcmpl-' + crypto.randomUUID(),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: modelDisplayName,
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: generatedText,
      },
      finish_reason: 'stop',
    }],
    usage,
  };
}

export function formatImageResponse(url, modelDisplayName, paramsUsed) {
  return {
    id: 'imggen-' + crypto.randomUUID(),
    object: 'image_url',
    created: Math.floor(Date.now() / 1000),
    model: modelDisplayName,
    params_used: paramsUsed,
    data: { url },
  };
}

export function formatVideoResponse(videoData, modelDisplayName, paramsUsed) {
  const generatedVideos = videoData.response?.generatedVideos || [];
  
  const enhancedResponse = {
    id: 'videogen-' + crypto.randomUUID(),
    object: 'video_generation',
    created: Math.floor(Date.now() / 1000),
    model: modelDisplayName,
    params_used: paramsUsed,
    generatedVideos: generatedVideos.map(video => ({
      video: {
        uri: video.video?.uri || video.uri || '',
        download_url: video.video?.uri || video.uri || '',
        status: 'completed'
      }
    })),
  };
  
  return enhancedResponse;
}

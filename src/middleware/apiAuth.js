import Boom from '@hapi/boom';
import config from '../config/config.js';

const validApiKey = config.APP_API_KEY;

export const validateApiKey = (request, h) => {
  if (request.query.apikey === validApiKey) {
    return h.continue;
  } else {
    return Boom.unauthorized('Invalid API key');
  };
}

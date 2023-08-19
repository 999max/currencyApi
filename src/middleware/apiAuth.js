const Boom = require('@hapi/boom');
const { APP_API_KEY } = require('../config/config');

const validApiKey = APP_API_KEY;

const validateApiKey = (request, h) => {
  if (request.query.apikey === validApiKey) {
    return h.continue;
  } else {
    return Boom.unauthorized('Invalid API key');
  };
}

module.exports = validateApiKey;

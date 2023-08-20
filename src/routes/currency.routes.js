const Joi = require('joi');
const Boom = require('@hapi/boom');
const currencyService = require('../services/currency.service');

const currencyRoutes = [
  {
    method: 'GET',
    path: '/pair',
    handler: currencyService.getCurrencyPair,
    options: {
      cors: true,
      validate: {
        query: Joi.object({
          from: Joi.string().length(3),
          to: Joi.string().length(3),
          apikey: Joi.string().required(),
        }),
        failAction: (request, h, error) => {
          return Boom.badRequest('Invalid query parameters');
        },
      },

    },
  },
  {
    method: 'GET',
    path: '/date/{date}',
    handler: currencyService.getCurrenciesByDate,
    options: {
      cors: true,
      validate: {
        params: Joi.object({
          date: Joi.date().iso(),
        }),
        query: Joi.object({
          apikey: Joi.string().required(),
        }),
        failAction: (request, h, error) => {
          return Boom.badRequest('Invalid query parameters');
        },
      },
    },
  },
  // dev @todo remove
  // {
  //   method: 'POST',
  //   path: '/add',
  //   handler: currencyService.addCurrency
  // },
  {
    method: 'DELETE',
    path: '/delete',
    handler: currencyService.deleteCurrencyById
  },
  {
    method: 'GET',
    path: '/all',
    handler: currencyService.getAllCurrencyRates
  },
];

module.exports = currencyRoutes;

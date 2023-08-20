
const fetch = require('node-fetch');
const Boom = require('@hapi/boom')
const config = require('../config/config');
const Currency = require('../models/currency.model');
const Log = require('../models/log.model');

const URL = config.CURRENCY_URL;
const allowedCurrencies = config.ALLOWED_CURRENCIES;

const getCurrencyPair = async (request, h) => {
  _log('pair');
  const from = request.query.from.toUpperCase();
  const to = request.query.to.toUpperCase();
  if (!allowedCurrencies.includes(from) || !allowedCurrencies.includes(to)) {
    return Boom.notFound('Currency not found');
  }

  let pairCurrency;
  try {
    pairCurrency = await _getLatestCurrency(from, to);
  } catch (e) {
    console.log(e.message); // @todo to logger
    return Boom.internal('Internal error. Try again later');
  }

  const resp = h.response(`${from}/${to} - ${pairCurrency}`)
  return resp;
};

const getCurrenciesByDate = async (request, h) => {
  _log('date');
  const now = new Date();
  let { date } = request.params;

  if (date > now) { // date comes with time 00:00
    return Boom.notFound(`Error: wrong date`);
  }

  let currencies = {};
  currencies = await _getCurrenciesByDate(date);
  if (Object.keys(currencies).length === 0) {
    // fetch today's latest or return Error due to old date
    if (date.toDateString() === now.toDateString()) {
      // adding with custom hours
      currencies = await addOrUpdateCurrency(now.getHours());
    } else {
      return Boom.notFound(`No data for such date`);
    }
  }
  currencies['Date'] = `${date.toDateString()}`;
  return h.response(currencies);
};

const addOrUpdateCurrency = async (hours) => {
  const rates = await _fetchCurrencies();
  const date = new Date();

  const existingCurrencies = await Currency.find({ date: {
    $gte: date.setHours(0, 0, 0, 0),
    $lt: date.setHours(13, 0, 0, 0),
  }});
  date.setHours(hours, 0, 0, 0);

  if (existingCurrencies.length > 0) {
    const updatedCurrencies = await _updateCurrencies(existingCurrencies, rates, date);
    return updatedCurrencies;
  } else {
    const addedCurrencies = await _addCurrency(date, rates);
    return addedCurrencies;
  }
}

const _updateCurrencies = async (currencies, rates, date) => {
  const updatePromises = [];
  for (const currency of currencies) {
    const asset = currency.asset;
    if (rates.hasOwnProperty(asset)) {
      currency.rate = parseFloat(rates[asset]);
      currency.date = date;
      updatePromises.push(currency.save());
    }
  }

  try {
    const currencies = await Promise.all(updatePromises);
    return _formatCurrencies(currencies);
  } catch (e) {
    return Boom.internal(`Update error: ${e.message}`);
  }
};

const _addCurrency = async (date, rates) => {
  const addPromises = [];
  for (const asset of Object.keys(rates)) {
    const currency = new Currency({
      asset,
      rate: parseFloat(rates[asset]),
      date,
    });
    addPromises.push(currency.save());
  }

  try {
    const currencies = await Promise.all(addPromises);
    return _formatCurrencies(currencies);
  } catch (e) {
    return Boom.internal(`Update error: ${e.message}`);
  }
};

const _fetchCurrencies = async () => {
  try {
    const resp = await fetch(URL);
    const data = await resp.json();
    return data.rates;
  } catch (e) {
    console.log(e); // @todo to logger
    return Boom.internal('Fetching currency error')
  }
}

const _getLatestCurrency = async (from, to) => {
  if (from === 'USD' && to === 'USD') return 1;
  if (from === 'USD') {
    const currency = await Currency.findOne({ asset: to }).sort({ date: -1 }).limit(1);
    return currency.rate;
  } else if (to === 'USD') {
    const currency = await Currency.findOne({ asset: from }).sort({ date: -1 }).limit(1);
    return 1 / currency.rate;
  }

  const currencyFrom = await Currency.findOne({ asset: from }).sort({ date: -1 }).limit(1);
  const currencyTo = await Currency.findOne({ asset: to }).sort({ date: -1 }).limit(1);

  // reverse due to relation with base asset USD
  return 1 / (currencyFrom.rate / currencyTo.rate);
}

const _getCurrenciesByDate = async (date) => {
  const currencies = await Currency.find({ date: {
    $gte: date.setHours(0, 0, 0, 0),
    $lte: date.setHours(23, 59, 59, 999),
  }});
  return _formatCurrencies(currencies);
}

const _formatCurrencies = (currencies) => {
  const formattedCurrencies = currencies.reduce((acc, currency) => {
    acc[currency.asset] = parseFloat(currency.rate);
    return acc;
  }, {});

  return formattedCurrencies;
}

const _log = async (queryType) => {
  try {
    const log = new Log({ queryType });
    await log.save();
  } catch(e) {
    console.log(e.message);
  }
}

// dev @todo remove
const getAllCurrencyRates = async () => {
  const currencies = await Currency.find().sort({ createdAt: -1 });
  return currencies;
};

const getCurrencyRates = async (request, h) => {
  const currentCurrency = await _fetchCurrencies();
  return currentCurrency;

};

const deleteCurrencyById = async (request, h) => {
  try {
    const result = await Currency.findByIdAndDelete(request.query.id);
    if (result) {
      return h.response('Currency deleted').code(200);
    } else {
      return h.response('Currency not found').code(404);
    }
  } catch (error) {
    console.error('Error deleting currency:', error);
    return Boom.internal(`Delete error: ${error.message}`);
  }
}

module.exports = {
  getCurrencyPair,
  getCurrencyRates,
  getCurrenciesByDate,
  addOrUpdateCurrency,
  deleteCurrencyById,
  getAllCurrencyRates,
};

import dotenv from 'dotenv';
dotenv.config();

const currencyApiKey = process.env.CURRENCY_API_KEY;
if (!currencyApiKey) {
  throw new Error('Need CURRENCY_API_KEY');
}

const config = {
  APP_HOST: process.env.APP_HOST || '0.0.0.0',
  APP_PORT: process.env.APP_PORT || 5000,
  APP_API_KEY: process.env.APP_API_KEY || '123qwe',
  ALLOWED_CURRENCIES: ['USD', 'RUB', 'EUR', 'JPY'], // @note USD is required as base currency
  CURRENCY_URL: `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${currencyApiKey}&symbols=RUB,EUR,JPY`,
  MONGO_URL: 'mongodb://mongodb:27017/currency_app',
};

export default config;

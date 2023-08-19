module.exports = {
  APP_HOST: 'localhost',
  APP_PORT: 5000,
  APP_API_KEY: '12345abc',
  ALLOWED_CURRENCIES: ['USD', 'RUB', 'EUR', 'JPY'], // @note USD is required as base currency
  CURRENCY_URL: 'https://api.currencyfreaks.com/v2.0/rates/latest?apikey=<API_KEY>&symbols=RUB,EUR,JPY',
  MONGO_URL: 'mongodb+srv://name:pass@cluster0.nlotyqf.mongodb.net/',
};

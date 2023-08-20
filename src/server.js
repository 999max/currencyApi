const Hapi = require('@hapi/hapi');
const cron = require('node-cron');
const mongoose = require('mongoose');
const config = require('./config/config');
const validateApiKey = require('./middleware/apiAuth');
const currencyRoutes = require('./routes/currency.routes');
const updateCurrency = require('./workers/currencyUpdater');

const DB = config.MONGO_URL;
const HOST = config.APP_HOST;
const PORT = config.APP_PORT; 

mongoose
  .connect(DB)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));

const init = async () => {
  const server = Hapi.server({
    host: HOST,
    port: PORT,
  });

  server.ext('onPreHandler', validateApiKey);  
  server.route(currencyRoutes);
  await server.start();
  console.log(`Server started on ${HOST}:${PORT} ${new Date()}`);

  // cron.schedule('*/2 * * * *', updateCurrency);
  cron.schedule('0 12 * * *', updateCurrency);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

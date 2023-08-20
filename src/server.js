import Hapi from '@hapi/hapi';
import cron from 'node-cron';
import mongoose from 'mongoose';
import config from './config/config.js';
import { validateApiKey } from './middleware/apiAuth.js';
import { currencyRoutes } from './routes/currency.routes.js';
import { updateCurrency } from './workers/currencyUpdater.js';
import { fillDatabase } from './workers/mockData.js';

const DB = config.MONGO_URL;
const HOST = config.APP_HOST;
const PORT = config.APP_PORT; 

mongoose
  .connect(DB)
  .then(() => {
    console.log('Connected to DB');
    fillDatabase()
      .then(() =>  console.log('Database sampling completed'))
      .catch((e) => console.error('Error sampling database:', e))
  })
  .catch((error) => console.log('DB error:', error));

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

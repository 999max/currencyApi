const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const config = require('./config/config');
const validateApiKey = require('./middleware/apiAuth');
const currencyRoutes = require('./routes/currency.routes');

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
  console.log(`Server started on ${HOST}:${PORT}`);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

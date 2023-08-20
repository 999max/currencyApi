const { addOrUpdateCurrency } = require('../services/currency.service');

const updateCurrency = async () => {
  console.log('Updated', Date.now())
  const updateHour = 12;
  await addOrUpdateCurrency(updateHour);
}

module.exports = updateCurrency;

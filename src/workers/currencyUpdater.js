import { addOrUpdateCurrency } from '../services/currency.service.js';

export const updateCurrency = async () => {
  console.log('Updated', Date.now())
  const updateHour = 12;
  await addOrUpdateCurrency(updateHour);
}

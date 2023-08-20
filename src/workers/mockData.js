import Currency from '../models/currency.model.js';

export const fillDatabase = async () => {
  const currentDate = new Date();
  currentDate.setHours(12, 0, 0, 0);

  for (let i = 1; i < 31; i++) {
    const fakeDate = new Date(currentDate);
    fakeDate.setDate(fakeDate.getDate() - i);

    const currencies = {
      'EUR': 0.9195,
      'RUB': 94.4561,
      'JPY': 145.6541,
    }
    for (const to of Object.keys(currencies)) {
      const fakeRate = currencies[to] + Math.random() + Math.random();
      const currency = new Currency({
        asset: to,
        rate: fakeRate,
        date: fakeDate,
      });
      await currency.save();
    }
  }

  console.log('Database filled with sample data');
};


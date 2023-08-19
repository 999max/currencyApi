const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  asset: { type: String, required: true },
  rate: { type: Number, required: true },
  date: { type: Date, required: true, set: t => t.setUTCHours(0, 0, 0, 0) },
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;

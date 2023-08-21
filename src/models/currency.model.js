import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  asset: { type: String, required: true },
  rate: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Currency = mongoose.model('Currency', currencySchema);

export default Currency;

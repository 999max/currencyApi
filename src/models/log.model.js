import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  queryType: { type: String, required: true },
});

const Log = mongoose.model('Log', logSchema);

export default Log;

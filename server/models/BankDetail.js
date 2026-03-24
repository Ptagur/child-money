const mongoose = require('mongoose');

const BankDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true }, // This will be encrypted
  accountNumber: { type: String, required: true }, // This will be encrypted
  ifscCode: { type: String, required: true }, // This will be encrypted
}, { timestamps: true });

module.exports = mongoose.model('BankDetail', BankDetailSchema);

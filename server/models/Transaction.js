const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit', 'request'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'completed' },
  description: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For requests to parent
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

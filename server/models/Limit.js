const mongoose = require('mongoose');

const LimitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  monthlyLimit: { type: Number, default: 0 },
  spentAmount: { type: Number, default: 0 },
  month: { type: Number, required: true }, // 0 to 11
  year: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Limit', LimitSchema);

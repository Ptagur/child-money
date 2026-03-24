const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  details: { type: String },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

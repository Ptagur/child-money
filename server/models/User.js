const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['parent', 'child'], required: true },
  childAge: { type: Number },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wallet: { type: Number, default: 0 },
  isFrozen: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

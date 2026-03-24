const User = require('../models/User');
const Transaction = require('../models/Transaction');

const getChildDetails = async (req, res) => {
  try {
    const child = await User.findById(req.user.id).select('-password');
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const requestMoney = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const transaction = new Transaction({
      userId: req.user.id,
      amount: Number(amount),
      type: 'request',
      status: 'pending',
      description,
      parentId: req.user.parentId
    });
    await transaction.save();
    res.json({ message: 'Request sent to parent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getChildDetails, requestMoney, getMyTransactions };

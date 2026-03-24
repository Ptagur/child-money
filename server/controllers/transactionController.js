const Transaction = require('../models/Transaction');
const User = require('../models/User');

const getPendingRequests = async (req, res) => {
  try {
    const requests = await Transaction.find({ parentId: req.user.id, type: 'request', status: 'pending' }).populate('userId', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const handleRequest = async (req, res) => {
  const { requestId, status } = req.body;
  try {
    const transaction = await Transaction.findById(requestId);
    if (!transaction || transaction.parentId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }

    if (status === 'approved') {
      const child = await User.findById(transaction.userId);
      child.wallet += transaction.amount;
      await child.save();
      transaction.status = 'approved';
    } else {
      transaction.status = 'rejected';
    }

    await transaction.save();
    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    // If parent, get all transactions of their children
    if (req.user.role === 'parent') {
      const children = await User.find({ parentId: req.user.id });
      const childIds = children.map(c => c._id);
      const transactions = await Transaction.find({ userId: { $in: childIds } }).populate('userId', 'name').sort({ createdAt: -1 });
      return res.json(transactions);
    }
    // If child, get only their own (already handled in child routes, but here for completeness)
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createSpending = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.wallet -= Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: req.user.id,
      amount: Number(amount),
      type: 'debit',
      description,
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: 'Transaction successful', wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getPendingRequests, handleRequest, getAllTransactions, createSpending };

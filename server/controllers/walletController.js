const Transaction = require('../models/Transaction');
const Limit = require('../models/Limit');
const Wallet = require('../models/Wallet');
const logActivity = require('../utils/logger');

const addMoney = async (req, res) => {
  const { childId, amount } = req.body;
  try {
    const wallet = await Wallet.findOne({ userId: childId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    wallet.balance += Number(amount);
    await wallet.save();

    const transaction = new Transaction({
      userId: childId,
      amount: Number(amount),
      type: 'credit',
      description: 'Added by parent',
      parentId: req.user.id
    });
    await transaction.save();

    await logActivity(req, 'Add Money', `Amount: ${amount}, ChildId: ${childId}`);

    res.json({ message: 'Money added successfully', balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const upiPay = async (req, res) => {
  const { upiId, amount, description } = req.body;
  const userId = req.user.id;
  try {
    const wallet = await Wallet.findOne({ userId });
    if (wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    // Check Monthly Limit
    const now = new Date();
    const limit = await Limit.findOne({ userId, month: now.getMonth(), year: now.getFullYear() });
    
    if (limit && limit.monthlyLimit > 0) {
      if (limit.spentAmount + Number(amount) > limit.monthlyLimit) {
        return res.status(400).json({ 
          message: 'Monthly limit exceeded. Please request more allowance from your parent.',
          limitReached: true 
        });
      }
    }

    // Deduct from wallet
    wallet.balance -= Number(amount);
    await wallet.save();

    // Update limit spent
    if (limit) {
      limit.spentAmount += Number(amount);
      await limit.save();
    }

    const transaction = new Transaction({
      userId,
      amount: Number(amount),
      type: 'debit',
      description: `UPI Pay to ${upiId}: ${description || 'No description'}`,
      status: 'completed'
    });
    await transaction.save();

    await logActivity(req, 'UPI Payment', `Amount: ${amount}, To: ${upiId}`);

    res.json({ 
      message: 'UPI Payment Successful!', 
      balance: wallet.balance, 
      warning: limit && limit.spentAmount >= limit.monthlyLimit * 0.8 ? 'Warning: You have used 80% of your monthly limit!' : null
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addMoney, upiPay };

const { db } = require('../firebase');

const getWalletBalance = async (req, res) => {
  try {
    const walletDoc = await db.collection('wallets').doc(req.user.id).get();
    const balance = walletDoc.exists ? walletDoc.data().balance : 0;
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addMoney = async (req, res) => {
  const { childId, amount } = req.body;
  const parentId = req.user.id;
  try {
    const parentWalletRef = db.collection('wallets').doc(parentId);
    const parentWalletDoc = await parentWalletRef.get();
    const parentBalance = parentWalletDoc.exists ? parentWalletDoc.data().balance : 0;

    if (parentBalance < Number(amount)) {
      return res.status(400).json({ message: 'Insufficient Family Vault balance. Please add funds to your wallet first.' });
    }

    const walletRef = db.collection('wallets').doc(childId);
    const walletDoc = await walletRef.get();
    if (!walletDoc.exists) return res.status(404).json({ message: 'Wallet not found' });

    const newParentBalance = parentBalance - Number(amount);
    await parentWalletRef.update({ balance: newParentBalance });

    const newBalance = walletDoc.data().balance + Number(amount);
    await walletRef.update({ balance: newBalance });

    await db.collection('transactions').add({
      userId: parentId,
      amount: Number(amount),
      type: 'transfer_out',
      description: 'Transferred to child',
      childId: childId,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    await db.collection('transactions').add({
      userId: childId,
      amount: Number(amount),
      type: 'credit',
      description: 'Added by parent',
      parentId: parentId,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Money added successfully', balance: newBalance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const upiPay = async (req, res) => {
  const { upiId, amount, description } = req.body;
  const userId = req.user.id;
  try {
    const walletRef = db.collection('wallets').doc(userId);
    const walletDoc = await walletRef.get();
    const balance = walletDoc.data().balance;

    if (balance < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });

    const now = new Date();
    const limitRef = db.collection('limits').doc(userId);
    const limitDoc = await limitRef.get();
    const limit = limitDoc.exists ? limitDoc.data() : null;

    if (limit && limit.monthlyLimit > 0) {
      if (limit.spentAmount + Number(amount) > limit.monthlyLimit) {
        return res.status(400).json({ message: 'Monthly limit exceeded. Please request more allowance from your parent.', limitReached: true });
      }
    }

    const newBalance = balance - Number(amount);
    await walletRef.update({ balance: newBalance });

    if (limit) {
      await limitRef.update({ spentAmount: limit.spentAmount + Number(amount) });
    }

    await db.collection('transactions').add({
      userId,
      amount: Number(amount),
      type: 'debit',
      description: `UPI Pay to ${upiId}: ${description || 'No description'}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    const updatedLimit = limitDoc.exists ? (await limitRef.get()).data() : null;
    res.json({
      message: 'UPI Payment Successful!',
      balance: newBalance,
      warning: updatedLimit && updatedLimit.spentAmount >= updatedLimit.monthlyLimit * 0.8 ? 'Warning: You have used 80% of your monthly limit!' : null
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addMoney, upiPay, getWalletBalance };

const { db } = require('../firebase');

const getChildDetails = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    const user = { id: userDoc.id, ...userDoc.data() };
    delete user.password;
    const walletDoc = await db.collection('wallets').doc(req.user.id).get();
    res.json({ ...user, wallet: walletDoc.exists ? walletDoc.data().balance : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const requestMoney = async (req, res) => {
  const { amount, description } = req.body;
  try {
    await db.collection('requests').add({
      childId: req.user.id,
      parentId: req.user.parentId,
      amount: Number(amount),
      type: 'request',
      status: 'pending',
      description,
      createdAt: new Date().toISOString()
    });
    res.json({ message: 'Request sent to parent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyTransactions = async (req, res) => {
  try {
    const snap = await db.collection('transactions').where('userId', '==', req.user.id).orderBy('createdAt', 'desc').get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getChildDetails, requestMoney, getMyTransactions };

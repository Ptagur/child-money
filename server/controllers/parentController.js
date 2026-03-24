const { db } = require('../firebase');
const { encrypt, decrypt } = require('../utils/encryption');

const getChildren = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('parentId', '==', req.user.id).get();
    const children = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const now = new Date();
    const enrichedChildren = await Promise.all(children.map(async (child) => {
      const limitDoc = await db.collection('limits').doc(child.id).get();
      const limit = limitDoc.exists ? limitDoc.data() : { monthlyLimit: 0, spentAmount: 0 };
      const walletDoc = await db.collection('wallets').doc(child.id).get();
      const balance = walletDoc.exists ? walletDoc.data().balance : 0;
      const { password, ...safeChild } = child;
      return { ...safeChild, monthlyLimit: limit.monthlyLimit, spentAmount: limit.spentAmount, wallet: balance };
    }));

    res.json(enrichedChildren);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addMoneyToChild = async (req, res) => {
  const { childId, amount } = req.body;
  try {
    const childDoc = await db.collection('users').doc(childId).get();
    if (!childDoc.exists || childDoc.data().parentId !== req.user.id) {
      return res.status(404).json({ message: 'Child not found or unauthorized' });
    }

    const walletRef = db.collection('wallets').doc(childId);
    const walletDoc = await walletRef.get();
    const newBalance = (walletDoc.exists ? walletDoc.data().balance : 0) + Number(amount);
    await walletRef.set({ userId: childId, balance: newBalance }, { merge: true });

    await db.collection('transactions').add({
      userId: childId,
      amount: Number(amount),
      type: 'credit',
      description: 'Added by parent',
      parentId: req.user.id,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Money added successfully', wallet: newBalance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addBankDetails = async (req, res) => {
  const { bankName, accountNumber, ifscCode } = req.body;
  try {
    await db.collection('bankDetails').doc(req.user.id).set({
      userId: req.user.id,
      bankName: JSON.stringify(encrypt(bankName)),
      accountNumber: JSON.stringify(encrypt(accountNumber)),
      ifscCode: JSON.stringify(encrypt(ifscCode))
    });
    res.json({ message: 'Bank details saved securely' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getBankDetails = async (req, res) => {
  try {
    const doc = await db.collection('bankDetails').doc(req.user.id).get();
    if (!doc.exists) return res.json(null);
    const data = doc.data();
    res.json({
      bankName: decrypt(JSON.parse(data.bankName)),
      accountNumber: decrypt(JSON.parse(data.accountNumber)),
      ifscCode: decrypt(JSON.parse(data.ifscCode))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteChild = async (req, res) => {
  try {
    const childDoc = await db.collection('users').doc(req.params.id).get();
    if (!childDoc.exists || childDoc.data().parentId !== req.user.id) {
      return res.status(404).json({ message: 'Child not found' });
    }
    await db.collection('users').doc(req.params.id).delete();
    res.json({ message: 'Child account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const toggleFreeze = async (req, res) => {
  try {
    const childRef = db.collection('users').doc(req.body.childId);
    const childDoc = await childRef.get();
    if (!childDoc.exists || childDoc.data().parentId !== req.user.id) {
      return res.status(404).json({ message: 'Child not found or unauthorized' });
    }
    const isFrozen = !childDoc.data().isFrozen;
    await childRef.update({ isFrozen });

    await db.collection('transactions').add({
      userId: req.body.childId,
      amount: 0,
      type: 'transfer',
      description: `Account ${isFrozen ? 'Frozen' : 'Unfrozen'} by Parent`,
      parentId: req.user.id,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    res.json({ message: `Account ${isFrozen ? 'frozen' : 'unfrozen'} successfully`, isFrozen });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getChildren, addMoneyToChild, addBankDetails, getBankDetails, deleteChild, toggleFreeze };

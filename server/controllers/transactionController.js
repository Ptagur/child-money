const { db } = require('../firebase');

const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role === 'parent') {
      const childSnap = await db.collection('users').where('parentId', '==', req.user.id).get();
      const childIds = childSnap.docs.map(d => d.id);
      
      const parentTxSnap = await db.collection('transactions').where('userId', '==', req.user.id).get();
      let allTxDocs = [...parentTxSnap.docs];

      for (let i = 0; i < childIds.length; i += 10) {
        const chunk = childIds.slice(i, i + 10);
        const childTxSnap = await db.collection('transactions').where('userId', 'in', chunk).get();
        allTxDocs = [...allTxDocs, ...childTxSnap.docs];
      }

      allTxDocs.sort((a, b) => new Date(b.data().createdAt) - new Date(a.data().createdAt));

      const transactions = await Promise.all(allTxDocs.map(async doc => {
        const data = { id: doc.id, ...doc.data() };
        const userDoc = await db.collection('users').doc(data.userId).get();
        data.userName = userDoc.exists ? userDoc.data().name : 'Unknown';
        return data;
      }));
      return res.json(transactions);
    }
    const txSnap = await db.collection('transactions').where('userId', '==', req.user.id).orderBy('createdAt', 'desc').get();
    res.json(txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createSpending = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const walletRef = db.collection('wallets').doc(req.user.id);
    const walletDoc = await walletRef.get();
    const balance = walletDoc.exists ? walletDoc.data().balance : 0;
    if (balance < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });

    await walletRef.update({ balance: balance - Number(amount) });

    await db.collection('transactions').add({
      userId: req.user.id,
      amount: Number(amount),
      type: 'debit',
      description,
      status: 'completed',
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Transaction successful', wallet: balance - Number(amount) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllTransactions, createSpending };

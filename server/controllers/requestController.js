const { db } = require('../firebase');

const createRequest = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    const parentId = userDoc.data().parentId;
    if (!parentId) return res.status(400).json({ message: 'No parent found' });

    const ref = await db.collection('requests').add({
      childId: req.user.id,
      parentId,
      amount: Number(amount),
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.json({ message: 'Request sent to parent', request: { id: ref.id } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getChildRequests = async (req, res) => {
  try {
    const snap = await db.collection('requests').where('childId', '==', req.user.id).orderBy('createdAt', 'desc').get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getParentRequests = async (req, res) => {
  try {
    const snap = await db.collection('requests').where('parentId', '==', req.user.id).where('status', '==', 'pending').get();
    const requests = await Promise.all(snap.docs.map(async doc => {
      const data = { id: doc.id, ...doc.data() };
      const childDoc = await db.collection('users').doc(data.childId).get();
      data.childName = childDoc.exists ? childDoc.data().name : 'Unknown';
      data.childEmail = childDoc.exists ? childDoc.data().email : '';
      return data;
    }));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const handleRequest = async (req, res) => {
  const { requestId, status } = req.body;
  try {
    const reqRef = db.collection('requests').doc(requestId);
    const reqDoc = await reqRef.get();
    if (!reqDoc.exists || reqDoc.data().parentId !== req.user.id) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status === 'approved') {
      const walletRef = db.collection('wallets').doc(reqDoc.data().childId);
      const walletDoc = await walletRef.get();
      const newBalance = (walletDoc.exists ? walletDoc.data().balance : 0) + reqDoc.data().amount;
      await walletRef.set({ userId: reqDoc.data().childId, balance: newBalance }, { merge: true });

      await db.collection('transactions').add({
        userId: reqDoc.data().childId,
        amount: reqDoc.data().amount,
        type: 'credit',
        description: `Request Approved: ${reqDoc.data().description}`,
        parentId: req.user.id,
        status: 'completed',
        createdAt: new Date().toISOString()
      });
    }

    await reqRef.update({ status });
    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createRequest, getChildRequests, getParentRequests, handleRequest };

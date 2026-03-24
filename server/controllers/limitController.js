const { db } = require('../firebase');

const setLimit = async (req, res) => {
  const { childId, monthlyLimit } = req.body;
  const now = new Date();
  try {
    await db.collection('limits').doc(childId).set({
      userId: childId,
      monthlyLimit: Number(monthlyLimit),
      spentAmount: 0,
      month: now.getMonth(),
      year: now.getFullYear()
    }, { merge: true });

    res.json({ message: 'Monthly limit updated', limit: Number(monthlyLimit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLimitStatus = async (req, res) => {
  try {
    const doc = await db.collection('limits').doc(req.user.id).get();
    res.json(doc.exists ? doc.data() : { monthlyLimit: 0, spentAmount: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { setLimit, getLimitStatus };

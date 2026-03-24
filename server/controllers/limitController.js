const Limit = require('../models/Limit');
const logActivity = require('../utils/logger');

const setLimit = async (req, res) => {
  const { childId, monthlyLimit } = req.body;
  const now = new Date();
  try {
    let limit = await Limit.findOne({ userId: childId, month: now.getMonth(), year: now.getFullYear() });
    if (!limit) {
      limit = new Limit({ 
        userId: childId, 
        monthlyLimit, 
        month: now.getMonth(), 
        year: now.getFullYear() 
      });
    } else {
      limit.monthlyLimit = monthlyLimit;
    }
    await limit.save();
    
    await logActivity(req, 'Set Limit', `Limit: ${monthlyLimit}, ChildId: ${childId}`);

    res.json({ message: 'Monthly limit updated', limit: limit.monthlyLimit });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getLimitStatus = async (req, res) => {
  const now = new Date();
  try {
    const limit = await Limit.findOne({ userId: req.user.id, month: now.getMonth(), year: now.getFullYear() });
    res.json(limit || { monthlyLimit: 0, spentAmount: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { setLimit, getLimitStatus };

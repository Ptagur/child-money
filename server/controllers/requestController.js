const Request = require('../models/Request');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const createRequest = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const request = new Request({
      childId: req.user.id,
      parentId: req.user.parentId,
      amount: Number(amount),
      description,
      status: 'pending'
    });
    await request.save();
    res.json({ message: 'Request sent to parent', request });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getChildRequests = async (req, res) => {
  try {
    const requests = await Request.find({ childId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getParentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ parentId: req.user.id, status: 'pending' }).populate('childId', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const handleRequest = async (req, res) => {
  const { requestId, status } = req.body;
  try {
    const request = await Request.findById(requestId);
    if (!request || request.parentId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status === 'approved') {
      const wallet = await Wallet.findOne({ userId: request.childId });
      wallet.balance += request.amount;
      await wallet.save();

      const transaction = new Transaction({
        userId: request.childId,
        amount: request.amount,
        type: 'credit',
        description: `Request Approved: ${request.description}`,
        parentId: req.user.id
      });
      await transaction.save();

      request.status = 'approved';
    } else {
      request.status = 'rejected';
    }

    await request.save();
    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createRequest, getChildRequests, getParentRequests, handleRequest };

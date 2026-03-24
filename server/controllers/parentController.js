const User = require('../models/User');
const BankDetail = require('../models/BankDetail');
const { encrypt, decrypt } = require('../utils/encryption');

const getChildren = async (req, res) => {
  try {
    const children = await User.find({ parentId: req.user.id }).lean();
    
    // Fetch limits for all children for the current month
    const Limit = require('../models/Limit');
    const now = new Date();
    const limits = await Limit.find({ 
      userId: { $in: children.map(c => c._id) },
      month: now.getMonth(),
      year: now.getFullYear()
    });

    const enrichedChildren = children.map(child => {
      const limit = limits.find(l => l.userId.toString() === child._id.toString());
      return {
        ...child,
        monthlyLimit: limit ? limit.monthlyLimit : 0,
        spentAmount: limit ? limit.spentAmount : 0
      };
    });

    res.json(enrichedChildren);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addMoneyToChild = async (req, res) => {
  const { childId, amount } = req.body;
  try {
    const child = await User.findById(childId);
    if (!child || child.parentId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Child not found or unauthorized' });
    }

    child.wallet += Number(amount);
    await child.save();

    // Log transaction
    const Transaction = require('../models/Transaction');
    const transaction = new Transaction({
      userId: childId,
      amount: Number(amount),
      type: 'credit',
      description: 'Added by parent',
      parentId: req.user.id
    });
    await transaction.save();

    res.json({ message: 'Money added successfully', wallet: child.wallet });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addBankDetails = async (req, res) => {
  const { bankName, accountNumber, ifscCode } = req.body;
  try {
    const encryptedBank = encrypt(bankName);
    const encryptedAccount = encrypt(accountNumber);
    const encryptedIFSC = encrypt(ifscCode);

    await BankDetail.findOneAndUpdate(
      { userId: req.user.id },
      {
        bankName: JSON.stringify(encryptedBank),
        accountNumber: JSON.stringify(encryptedAccount),
        ifscCode: JSON.stringify(encryptedIFSC)
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Bank details saved securely' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getBankDetails = async (req, res) => {
  try {
    const details = await BankDetail.findOne({ userId: req.user.id });
    if (!details) return res.json(null);

    const decryptedBank = decrypt(JSON.parse(details.bankName));
    const decryptedAccount = decrypt(JSON.parse(details.accountNumber));
    const decryptedIFSC = decrypt(JSON.parse(details.ifscCode));

    res.json({
      bankName: decryptedBank,
      accountNumber: decryptedAccount,
      ifscCode: decryptedIFSC,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteChild = async (req, res) => {
  try {
    const child = await User.findById(req.params.id);
    if (!child || child.parentId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Child not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Child account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const toggleFreeze = async (req, res) => {
  try {
    const child = await User.findById(req.body.childId);
    if (!child || child.parentId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Child not found or unauthorized' });
    }
    child.isFrozen = !child.isFrozen;
    await child.save();

    // Log this security action
    const Transaction = require('../models/Transaction');
    await new Transaction({
      userId: child._id,
      amount: 0,
      type: 'transfer',
      description: `Account ${child.isFrozen ? 'Frozen' : 'Unfrozen'} by Parent`,
      parentId: req.user.id
    }).save();

    res.json({ message: `Account ${child.isFrozen ? 'frozen' : 'unfrozen'} successfully`, isFrozen: child.isFrozen });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getChildren, addMoneyToChild, addBankDetails, getBankDetails, deleteChild, toggleFreeze };

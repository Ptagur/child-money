const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logActivity = require('../utils/logger');

const registerParent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'parent' });
    await user.save();

    // Initialize Wallet for Parent (optional, but good for consistency)
    const Wallet = require('../models/Wallet');
    const wallet = new Wallet({ userId: user._id, balance: 0 });
    await wallet.save();

    await logActivity({ user: { id: user._id }, ip: req.ip, get: req.get.bind(req) }, 'Parent Registered', `Email: ${email}`);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const registerChild = async (req, res) => {
  const { name, email, password, childAge } = req.body;
  const parentId = req.user.id;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Child email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'child', childAge, parentId });
    await user.save();

    // Initialize Wallet and Limit for Child
    const Wallet = require('../models/Wallet');
    const wallet = new Wallet({ userId: user._id, balance: 0 });
    await wallet.save();

    const Limit = require('../models/Limit');
    const now = new Date();
    const limit = new Limit({ 
      userId: user._id, 
      monthlyLimit: 0, 
      spentAmount: 0, 
      month: now.getMonth(), 
      year: now.getFullYear() 
    });
    await limit.save();
    
    await logActivity({ user: { id: parentId }, ip: req.ip, get: req.get.bind(req) }, 'Child Registered', `Child: ${name} (${email})`);

    res.json({ message: 'Child registered successfully', user: { id: user._id, name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Fetch Wallet
    const Wallet = require('../models/Wallet');
    const wallet = await Wallet.findOne({ userId: user._id });
    
    await logActivity({ user: { id: user._id }, ip: req.ip, get: req.get.bind(req) }, 'User Login', `Role: ${user.role}`);

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, wallet: wallet ? wallet.balance : 0 } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const Wallet = require('../models/Wallet');
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    res.json({ ...user.toObject(), wallet: wallet ? wallet.balance : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerParent, registerChild, login, getMe };

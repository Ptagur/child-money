const { db } = require('../firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerParent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc();
    const userData = { name, email, password: hashedPassword, role: 'parent', isFrozen: false, createdAt: new Date().toISOString() };
    await userRef.set(userData);

    // Initialize wallet
    await db.collection('wallets').doc(userRef.id).set({ userId: userRef.id, balance: 0 });

    const token = jwt.sign({ id: userRef.id, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userRef.id, name, email, role: 'parent' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const registerChild = async (req, res) => {
  const { name, email, password, childAge } = req.body;
  const parentId = req.user.id;
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) return res.status(400).json({ message: 'Child email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc();
    await userRef.set({ name, email, password: hashedPassword, role: 'child', childAge, parentId, isFrozen: false, createdAt: new Date().toISOString() });

    // Initialize wallet and limit
    await db.collection('wallets').doc(userRef.id).set({ userId: userRef.id, balance: 0 });
    const now = new Date();
    await db.collection('limits').doc(userRef.id).set({ userId: userRef.id, monthlyLimit: 0, spentAmount: 0, month: now.getMonth(), year: now.getFullYear() });

    res.json({ message: 'Child registered successfully', user: { id: userRef.id, name, role: 'child' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return res.status(400).json({ message: 'Invalid credentials' });

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const walletDoc = await db.collection('wallets').doc(user.id).get();
    const balance = walletDoc.exists ? walletDoc.data().balance : 0;

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role, wallet: balance, parentId: user.parentId || null } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    const user = { id: userDoc.id, ...userDoc.data() };
    delete user.password;
    const walletDoc = await db.collection('wallets').doc(req.user.id).get();
    res.json({ ...user, wallet: walletDoc.exists ? walletDoc.data().balance : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerParent, registerChild, login, getMe };

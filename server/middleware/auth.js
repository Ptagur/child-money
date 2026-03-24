const jwt = require('jsonwebtoken');
const { db } = require('../firebase');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await db.collection('users').doc(decoded.id).get();
    if (!userDoc.exists) return res.status(401).json({ message: 'User not found' });
    req.user = { id: userDoc.id, ...userDoc.data() };
    delete req.user.password;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
  next();
};

const checkFrozen = (req, res, next) => {
  if (req.user && req.user.isFrozen) return res.status(403).json({ message: 'Account is frozen. Please contact your parent.' });
  next();
};

module.exports = { authMiddleware, roleMiddleware, checkFrozen };

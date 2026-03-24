const { db } = require('../firebase');

const logActivity = async (req, action, details = '') => {
  try {
    await db.collection('activityLogs').add({
      userId: req.user ? req.user.id : null,
      action,
      details,
      ip: req.ip,
      userAgent: req.get ? req.get('User-Agent') : '',
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Logging Error:', err.message);
  }
};

module.exports = logActivity;

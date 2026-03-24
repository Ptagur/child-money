const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, details = '') => {
  try {
    const log = new ActivityLog({
      userId: req.user ? req.user.id : null,
      action,
      details,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    await log.save();
  } catch (err) {
    console.error('Logging Error:', err);
  }
};

module.exports = logActivity;

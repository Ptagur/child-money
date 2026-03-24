const express = require('express');
const { getChildDetails, getMyTransactions } = require('../controllers/childController');
const { upiPay } = require('../controllers/walletController');
const { createRequest, getChildRequests } = require('../controllers/requestController');
const { getLimitStatus } = require('../controllers/limitController');
const { authMiddleware, roleMiddleware, checkFrozen } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['child']));

router.get('/me', getChildDetails);
router.post('/wallet/pay', [
  checkFrozen,
  body('upiId').isString().notEmpty(),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
  validate
], upiPay);
router.post('/request-money', [
  checkFrozen,
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
  validate
], createRequest);
router.get('/requests', getChildRequests);
router.get('/transactions', getMyTransactions);
router.get('/limit-status', getLimitStatus);

module.exports = router;

const express = require('express');
const { getChildren, addBankDetails, getBankDetails, deleteChild, toggleFreeze } = require('../controllers/parentController');
const { setLimit } = require('../controllers/limitController');
const { addMoney, getWalletBalance, depositToWallet } = require('../controllers/walletController');
const { getParentRequests, handleRequest } = require('../controllers/requestController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['parent']));

router.get('/children', getChildren);
router.get('/wallet', getWalletBalance);

router.post('/deposit', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
  validate
], depositToWallet);

router.post('/add-money', [
  body('childId').isString().notEmpty().withMessage('Child ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
  validate
], addMoney);
router.post('/set-limit', [
  body('childId').isString().notEmpty().withMessage('Child ID is required'),
  body('monthlyLimit').isFloat({ min: 0 }).withMessage('Monthly limit must be zero or more'),
  validate
], setLimit);
router.get('/requests', getParentRequests);
router.post('/approve-request', handleRequest);
router.post('/toggle-freeze', toggleFreeze);
router.get('/bank-details', getBankDetails);
router.post('/bank-details', addBankDetails);
router.delete('/child/:id', deleteChild);

module.exports = router;

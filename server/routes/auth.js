const express = require('express');
const { registerParent, registerChild, login, getMe } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const router = express.Router();

router.post('/register/parent', [
  authLimiter,
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
], registerParent);

router.post('/register/child', [
  authLimiter,
  authMiddleware,
  roleMiddleware(['parent']),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('childAge').isNumeric().withMessage('Child age must be a number'),
  validate
], registerChild);

router.post('/login', [
  authLimiter,
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], login);

router.get('/me', authMiddleware, getMe);

module.exports = router;

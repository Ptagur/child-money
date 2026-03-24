const express = require('express');
const { getPendingRequests, handleRequest, getAllTransactions, createSpending } = require('../controllers/transactionController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

// Parent only: view pending requests from their children and handle them
router.get('/pending', roleMiddleware(['parent']), getPendingRequests);
router.post('/handle-request', roleMiddleware(['parent']), handleRequest);

// Common: view transactions (parent sees kids, kid sees self)
router.get('/history', getAllTransactions);

// Child only: log a spending transaction
router.post('/spend', roleMiddleware(['child']), createSpending);

module.exports = router;

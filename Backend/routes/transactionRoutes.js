const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth, isUser } = require('../middlewares/Auth');

// Create payment intent
router.post('/create-payment-intent', auth, isUser, transactionController.createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', auth, isUser, transactionController.confirmPayment);

// Get user transactions
router.get('/user-transactions', auth, isUser, transactionController.getUserTransactions);

// Process refund
router.post('/refund', auth, isUser, transactionController.processRefund);

// Get transaction analytics
router.get('/analytics', auth, transactionController.getTransactionAnalytics);

module.exports = router;
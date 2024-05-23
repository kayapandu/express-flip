const express = require('express');
const { createHandler } = require('../../utils');
const { topupHandler, transactionHistoryHandler, transferHandler } = require('../../handlers');
const verifyToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/topup', verifyToken, createHandler(topupHandler));
router.post('/transfer', verifyToken, createHandler(transferHandler));
router.get('/transaction-history', verifyToken, createHandler(transactionHistoryHandler));


module.exports = router;

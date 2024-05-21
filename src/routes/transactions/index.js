const express = require('express');
const { createHandler } = require('../../utils');
const { topupHandler, transactionHistoryHandler, transferHandler } = require('../../handlers');

const router = express.Router();

router.post('/topup', createHandler(topupHandler));
router.post('/transfer', createHandler(transferHandler));
router.post('/transaction-history', createHandler(transactionHistoryHandler));


module.exports = router;

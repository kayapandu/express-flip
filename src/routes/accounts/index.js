const express = require('express');
const { createHandler } = require('../../utils');
const { balanceHandler, inquiryHandler } = require('../../handlers');
const verifyToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/balance', verifyToken, createHandler(balanceHandler));
router.post('/inquiry', verifyToken, createHandler(inquiryHandler));


module.exports = router;

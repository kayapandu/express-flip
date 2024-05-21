const express = require('express');
const { createHandler } = require('../../utils');
const { balanceHandler } = require('../../handlers');

const router = express.Router();

router.post('/balance', createHandler(balanceHandler));


module.exports = router;

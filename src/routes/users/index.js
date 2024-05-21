const express = require('express');
const { createHandler } = require('../../utils');
const { loginHandler, registerHandler } = require('../../handlers');

const router = express.Router();

router.post('/login', createHandler(loginHandler));
router.post('/register', createHandler(registerHandler))


module.exports = router;

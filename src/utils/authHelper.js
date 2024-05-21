const jwt = require('jsonwebtoken');
const config = require('../../config');

const authHelper = async (payload) => {
  token = await jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3),
    data: payload
  }, config.secretKey);
  return token;
}

module.exports = authHelper;
const { statusCode } = require('../../utils');

const loginHandler = async (req, res) => {
  console.log(req);

  res.status(200).send({ message: 'login' });
};

const registerHandler = async (req, res) => {
  console.log(req);

  res.status(200).send({ message: 'register' });
};


module.exports = {
  loginHandler,
  registerHandler,
};


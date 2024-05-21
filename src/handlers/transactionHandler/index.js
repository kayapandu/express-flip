const { statusCode } = require("../../utils");

const topupHandler = async (req, res) => {
  console.log(req);

  res.status(200).send({ message: 'topup' });
};

const transferHandler = async (req, res) => {
  console.log(req);

  res.status(200).send({ message: 'transfer' });
};

const transactionHistoryHandler = async (req, res) => {
  console.log(req);

  res.status(200).send({ message: 'transaction history' });
};


module.exports = {
  topupHandler,
  transferHandler,
  transactionHistoryHandler,
};


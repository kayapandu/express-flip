const userHandler = require("./userHandler");
const accountHandler = require("./accountHandler");
const transactionHandler = require("./transactionHandler");

module.exports = { 
  ...userHandler,
  ...accountHandler,
  ...transactionHandler,
};

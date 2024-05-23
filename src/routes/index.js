const users = require('./users');
const accounts = require('./accounts');
const transactions = require('./transactions');

const routers = [
  users,
  accounts,
  transactions
];

module.exports = (app) => {
  routers.forEach(router => app.use(router));
};
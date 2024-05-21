const users = require('./users');
const accounts = require('./accounts');

const routers = [
  users,
  accounts,
];

module.exports = (app) => {
  routers.forEach(router => app.use(router));
};
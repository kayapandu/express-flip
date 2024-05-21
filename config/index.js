require('dotenv').config();

const config = {
  secretKey: process.env.SECRET_KEY,
  http: {
    httpPort: process.env.PORT
  },
};

module.exports = config;
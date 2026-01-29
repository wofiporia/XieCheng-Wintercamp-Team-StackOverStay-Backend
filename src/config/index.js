const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

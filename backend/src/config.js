require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/airdrop_hunter',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  ETH_PROVIDER_URL: process.env.ETH_PROVIDER_URL,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL,
};
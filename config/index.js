require('dotenv').config();

exports.config = {
  PORT: process.env.PORT,
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,

  // Website URL
  WEBSITE_URL: process.env.WEBSITE_URL,

  // MONGODB URL
  MONGODB_URL: process.env.MONGODB_URL,

  // Gmail:
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,

  // Twilio
  TW_ACCOUNT_SID: process.env.TW_ACCOUNT_SID,
  TW_AUTH_TOKEN: process.env.TW_AUTH_TOKEN,
};

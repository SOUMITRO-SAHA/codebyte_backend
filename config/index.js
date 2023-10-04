import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.PORT,
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,

  // MONGODB URL
  MONGODB_URL: process.env.MONGODB_URL,

  // Gmail:
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,

  // Twilio
  TW_ACCOUNT_SID: process.env.TW_ACCOUNT_SID,
  TW_AUTH_TOKEN: process.env.TW_AUTH_TOKEN,
};

export default config;

const nodemailer = require('nodemailer');
const { config } = require('../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASSWORD,
  },
});

const sendForgetPasswordTokenByEmail = async (email, resetToken) => {
  const mailOptions = {
    from: config.GMAIL_USER,
    to: email,
    subject: 'Reset Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h2 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  color: #555;
                  margin-bottom: 20px;
              }
              a {
                  display: inline-block;
                  padding: 10px 20px;
                  text-decoration: none;
                  background-color: #007bff;
                  color: #fff;
                  border-radius: 5px;
              }
              a:hover {
                  background-color: #0056b3;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Reset Password</h2>
              <p>Hello,</p>
              <p>You have requested to reset your password. Click on the link below to reset it:</p>
              <a href="${config.WEBSITE_URL}/reset-password?token=${resetToken}">Reset Password</a>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thank you!</p>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = { sendForgetPasswordTokenByEmail };

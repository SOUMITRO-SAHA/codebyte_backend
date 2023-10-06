const { config } = require('.');
const mongoose = require('mongoose');

exports.connect = () => {
  mongoose
    .connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log('DB connected successfully'))
    .catch((err) => {
      console.log(`Error connecting Database.
      Error Message: ${err.message}`);
      process.exit(1);
    });
};

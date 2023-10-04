import mongoose from 'mongoose';
import config from './index.js';

const connect = () => {
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

export default connect;

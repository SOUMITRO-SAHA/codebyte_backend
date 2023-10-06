const app = require('./app.js');
const { config } = require('./config');

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});

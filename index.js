import app from './app.js';
import config from './config/index.js';

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});

import express from 'express';

import { initErrorHandlers } from './errors';
import { initMiddleware } from './middleware';
import { router } from './routes';
import { setupPassport } from './utilities';

export default () => {
  const app = express();

  initMiddleware(app);

  setupPassport();

  app.use('/', router);

  initErrorHandlers(app);

  return app;
};

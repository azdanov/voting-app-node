import { Express } from 'express';
import { logger } from './utilities';

export const initErrorHandlers = (app: Express) => {
  // handle missing csrf token
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
      next(err);
      return;
    }

    req.flash('error', 'Submission has been tampered with');

    res.status(409);
    res.redirect('/');
  });

  // catch-all error handler
  app.use((err, req, res, next) => {
    logger.error('Unhandled error: ', err);
    res.status(500).send(err);
  });
};

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

    res.redirect('/');
  });

  // catch-all error handler
  app.use((err, req, res, next) => {
    logger.error('Unhandled error: ', err);
    const code = err.status || 500;
    res.status(code).render('error', { code, title: `${code} Error` });
  });
};

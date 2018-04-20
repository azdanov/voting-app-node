import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { logger } from './utilities';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/', router);

// catch-all error handler
app.use((err, req, res, next) => {
  logger.error('unhandled application error: ', err);
  res.status(500).send(err);
});

export default app;

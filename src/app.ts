import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import { logger } from './utilities';
import routes from './routes';

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// sanity check route
app.get('/test', (req, res, next) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/', routes);

// catch-all error handler
app.use((err, req, res, next) => {
  logger.error('unhandled application error: ', err);
  res.status(500).send(err);
});

export default app;

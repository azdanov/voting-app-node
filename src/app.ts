import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import connectFlash from 'connect-flash';

import { createUser } from './models';
import routes from './routes';
import { logger, logStream, pugHelpers, setupPassport } from './utilities';

const app = express();
const MongoStore = connectMongo(expressSession);

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('combined', { stream: logStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(connectFlash());

app.use(
  expressSession({
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

createUser();
setupPassport();

// setup addons for pug
app.use((req, res, next) => {
  res.locals.h = pugHelpers;
  res.locals.flashes = req.flash();
  res.locals.siteName = process.env.SITE_NAME;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// sanity check route
app.get('/test', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/', routes);

// catch-all error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error: ', err);
  res.status(500).send(err);
});

export default app;

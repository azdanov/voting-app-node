import bodyParser from 'body-parser';
import compression from 'compression';
import connectFlash from 'connect-flash';
import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import methodOverride from 'method-override';
import moment from 'moment';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';

import { createPoll, createUser } from './models';
import routes from './routes';
import { logger, logStream, pugHelpers, setupPassport } from './utilities';

const connectMongo = require('connect-mongo');

const app = express();

app.use(helmet());
app.use(methodOverride('_method'));
app.use(compression());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(morgan('combined', { stream: logStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(connectFlash());

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

const store = new (connectMongo(expressSession))({
  mongooseConnection: mongoose.connection,
});

app.use(
  expressSession({
    store,
    name: 'votingAppSession',
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: moment()
        .add(1, 'hour')
        .toDate(),
    },
  }),
);
app.use(csurf({ cookie: false }));
app.use(passport.initialize());
app.use(passport.session());

createUser();
createPoll();
setupPassport();

// setup addons for pug
app.use((req, res, next) => {
  res.locals.h = pugHelpers;
  res.locals.flashes = req.flash();
  res.locals.siteName = process.env.SITE_NAME;
  res.locals.currentPath = req.path;
  res.locals.csrfToken = req.csrfToken();

  res.locals.user = req.user || null;

  res.locals.form = { values: null, warnings: null };

  if (req.session!.form) {
    res.locals.name = req.session!.form.name;
    res.locals.email = req.session!.form.email;
    res.locals.form = {
      warnings: req.session!.form.warnings,
      values: req.session!.form.values,
    };
    delete req.session!.form;
  }

  next();
});

app.use('/', routes);

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

export default app;

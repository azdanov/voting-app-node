import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import routes from './routes';
import passport from 'passport';
import { createUser } from './models';
import { logger, logStream, setupPassport, pugHelpers } from './utilities';

const app = express();
const MongoStore = connectMongo(expressSession);

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('combined', { stream: logStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
  res.locals.siteName = process.env.SITE_NAME;
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// sanity check route
app.get('/test', (req, res, next) => {
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

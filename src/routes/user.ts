import { promisify } from 'bluebird';
import crypto from 'crypto';
import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import moment from 'moment';
import mongoose from 'mongoose';

import { assignValidationsToSession } from '../utilities';
import { send } from '../utilities/mail';

let passwordLength = 5;
if (process.env.PASSWORD_LENGTH) {
  passwordLength = +process.env.PASSWORD_LENGTH;
}

export const loginFormPage = (req: express.Request, res: express.Response) => {
  res.render('login', { title: 'Login' });
};

export const registerFormPage = (req: express.Request, res: express.Response) => {
  if (req.user) {
    res.redirect('/');
    return;
  }

  res.render('register', { title: 'Register' });
};

export const validateRegister = [
  check('email', 'Email is incorrect')
    .isEmail()
    .withMessage('Must be a correct email')
    .normalizeEmail()
    .custom((email, { req }) => {
      const User = mongoose.model('User');
      return User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          throw new Error('This email is already in use');
        }
      });
    }),
  check('name', 'Name is incorrect')
    .exists()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage('Please enter only unaccented alphabetical letters, A–Z or a–z')
    .isString(),
  check(
    'password',
    `Password must be at least ${passwordLength} characters long and contain one number`,
  )
    .exists()
    .isLength({ min: passwordLength })
    .matches(new RegExp(`^(?=.*?[A-Za-z])(?=.*?[^a-zA-Z\s]).{${passwordLength},}$`)),
  check('passwordRepeat', 'Passwords do not match')
    .exists()
    .custom((passwordRepeat, { req }) => passwordRepeat === req.body.password),
  sanitize('email')
    .normalizeEmail()
    .trim(),
  sanitize('name')
    .escape()
    .trim(),
];

export const register = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.redirect('/register');
  }

  const User = mongoose.model('User');
  const user = new User({ email: req.body.email, name: req.body.name });

  User.register(user, req.body.password, () => {
    next();
  });
};

export const passwordRequestPage = (req: express.Request, res: express.Response) => {
  res.render('passwordRequest', { title: 'Request Password' });
};

export const validateRequest = [
  check('email', 'Email is incorrect')
    .isEmail()
    .withMessage('Must be a correct email')
    .normalizeEmail()
    .custom((email, { req }) => {
      const User = mongoose.model('User');
      return User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
          throw new Error('No account with that email exists.');
        }
      });
    }),
  sanitize('email')
    .normalizeEmail()
    .trim(),
];

export const passwordRequest = async (req: express.Request, res: express.Response) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.redirect('/password/request');
  }

  const User = mongoose.model('User');
  const { email } = matchedData(req, { locations: ['body'] });

  const user = await User.findOne({ email });

  (<any>user).resetPasswordToken = crypto.randomBytes(48).toString('hex');
  (<any>user).resetPasswordExpiration = moment()
    .add('15', 'minutes')
    .valueOf();

  await user!.save();
  let resetUrl: null | string = `http://${req.headers.host}/password/reset/${
    (<any>user).resetPasswordToken
  }`;

  await send({
    user,
    resetUrl,
    filename: 'passwordResetEmail',
    subject: 'Password Reset',
  });

  console.log('node_env: ', process.env.NODE_ENV);

  if (process.env.NODE_ENV !== 'test') {
    resetUrl = null;
  }

  req.flash(
    'success',
    resetUrl
      ? `<a href="${resetUrl}">Visit</a>`
      : 'You have been emailed a password reset link.',
  );
  res.redirect('/login');
};

export const passwordResetPage = (req: express.Request, res: express.Response) => {
  res.render('passwordReset', { token: req.params.token, title: 'Reset Password' });
};

export const validateReset = [
  check(
    'password',
    `Password must be at least ${passwordLength} characters long and contain one number`,
  )
    .exists()
    .isLength({ min: passwordLength })
    .matches(new RegExp(`^(?=.*?[A-Za-z])(?=.*?[^a-zA-Z\s]).{${passwordLength},}$`)),
  check('passwordRepeat', 'Passwords do not match')
    .exists()
    .custom((passwordRepeat, { req }) => passwordRepeat === req.body.password),
];

export const passwordReset = async (req, res) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    assignValidationsToSession(req, validations);
    return res.redirect(`/password/reset/${req.body.token}`);
  }

  const User = mongoose.model('User');

  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpiration: { $gt: moment.now() },
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired.');
    return res.redirect('/login');
  }

  const setPassword: (password: string) => void = promisify((<any>user).setPassword, {
    context: user,
  });

  await setPassword(req.body.password);

  (<any>user).resetPasswordToken = null;
  (<any>user).resetPasswordExpiration = null;

  const updatedUser = await user.save();

  await req.login(updatedUser, () => {});

  req.flash('success', 'Success! Your password has been reset!');
  res.redirect('/');
};

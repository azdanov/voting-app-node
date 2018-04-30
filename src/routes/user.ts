import express from 'express';
import { check, validationResult } from 'express-validator/check';
import mongoose from 'mongoose';
import { assignValidationsToSession } from '../utilities';
import { sanitize } from 'express-validator/filter';

export const loginForm = (req: express.Request, res: express.Response) => {
  res.render('login', { title: 'Login' });
};

export const registerForm = (req: express.Request, res: express.Response) => {
  if (req.user) {
    res.redirect('/');
    return;
  }

  res.render('register', { title: 'Register' });
};

let passwordLength = 5;
if (process.env.PASSWORD_LENGTH) {
  passwordLength = +process.env.PASSWORD_LENGTH;
}

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
    return res.status(422).redirect('/register');
  }

  const User = mongoose.model('User');
  const user = new User({ email: req.body.email, name: req.body.name });

  User.register(user, req.body.password, () => {
    next();
  });
};

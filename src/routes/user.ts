import express from 'express';
import { check, validationResult } from 'express-validator/check';
import mongoose from 'mongoose';

export const loginForm = (req: express.Request, res: express.Response) => {
  res.locals.csrfToken = req.csrfToken();
  res.render('login', { title: 'Login' });
};

export const registerForm = (req: express.Request, res: express.Response) => {
  res.locals.csrfToken = req.csrfToken();
  res.render('register', { title: 'Register' });
};

export const validateRegister = [
  check('email', 'Email is incorrect')
    .isEmail()
    .withMessage('Must be a correct email')
    .trim()
    .normalizeEmail(),
  check('name', 'Name is incorrect')
    .exists()
    .trim()
    .isString(),
  check('password', 'Password must be at least 5 characters long and contain one number')
    .exists()
    .isLength({ min: 5 })
    .matches(/^.*(?=.{5,})(?=.*[a-zA-Z]).*$/)
    .trim(),
  check('passwordRepeat', 'Passwords do not match')
    .exists()
    .custom((passwordRepeat, { req }) => passwordRepeat === req.body.password),
];

export const register = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    const errors: any = validations.mapped();
    for (const error in errors) {
      if (errors.hasOwnProperty(error)) {
        req.flash('error', errors[error].msg);
      }
    }
    return res.status(422).redirect('/register');
  }

  const User = mongoose.model('User');
  const user = new User({ email: req.body.email, name: req.body.name });

  User.register(user, req.body.password, () => {
    next();
  });
};

import express from 'express';
import { check, validationResult } from 'express-validator/check';
import mongoose from 'mongoose';

export const loginForm = (req: express.Request, res: express.Response) => {
  res.render('login', { title: 'Login' });
};

export const registerForm = (req: express.Request, res: express.Response) => {
  res.render('register', { title: 'Register' });
};

export const validateRegister = [
  check('email', 'must be an email')
    .isEmail()
    .trim()
    .normalizeEmail(),
  check('name', 'must have a name')
    .exists()
    .trim()
    .isString(),
  check('password', 'passwords must be at least 5 chars long and contain one number')
    .exists()
    .matches(/\d/)
    .isLength({ min: 5 })
    .trim(),
  check('passwordRepeat', 'passwords do not match')
    .exists()
    .custom((passwordRepeat, { req }) => passwordRepeat === req.body.password),
];

export const register = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const User = mongoose.model('User');
  const user = new User({ email: req.body.email, name: req.body.name });

  User.register(user, req.body.password, () => {
    next();
  });
};
